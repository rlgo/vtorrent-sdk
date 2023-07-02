import {
  AddTorrentOptions,
  TorrentClient,
  TorrentConfig,
} from '../common/TorrentClient.js';
import { AxiosInstance } from 'axios';
import { createAxios } from '../common/axios.js';
import { Torrent, TorrentStatus } from '../common/Torrent.js';
import qs from 'qs';
import { Cookie, CookieJar, MemoryCookieStore, Store } from 'tough-cookie';
import { QbTorrent, QbTorrentArraySchema, QbTorrentState } from './schema.js';

export class QbClient implements TorrentClient {
  config: TorrentConfig;
  private readonly cookieStore: Store;
  private readonly cookieJar: CookieJar;
  private readonly axios: AxiosInstance;

  constructor(config: TorrentConfig, store?: Store) {
    this.config = config;
    this.config.syncInterval = this.config.syncInterval
      ? this.config.syncInterval
      : 1000;
    this.config.url = this.config.url + '/api/v2';
    this.cookieStore = store ?? new MemoryCookieStore();
    this.cookieJar = new CookieJar(this.cookieStore);
    this.axios = createAxios({ url: config.url, cookieJar: this.cookieJar });
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          (await checkLoginExpired(this.cookieStore)) &&
          !originalRequest._retry &&
          !originalRequest.url.includes('login')
        ) {
          originalRequest._retry = true;
          await this.login();
          return this.axios(originalRequest);
        }
        return Promise.reject(error);
      }
    );
    checkLoginExpired(this.cookieStore).then((expired) => {
      if (expired) this.login();
    });

    function checkLoginExpired(cookieStore: Store): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        cookieStore.findCookie(
          new URL(config.url).hostname,
          '/',
          'SID',
          (err, cookie) => {
            resolve(
              cookie && !err
                ? cookie.expiryDate().getTime() < new Date().getTime()
                : true
            );
          }
        );
      });
    }
  }

  addTorrent(options: AddTorrentOptions): Promise<string> {
    return Promise.resolve('');
  }

  async getAllTorrents(): Promise<Torrent[]> {
    const res = await this.axios.get('/torrents/info');
    const qbitTorrents = QbTorrentArraySchema.parse(res.data);
    return qbitTorrents.map((torrent) => this.normalizeTorrent(torrent));
  }

  pauseTorrent(id: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  removeTorrent(id: string, removeData: boolean): Promise<void> {
    return Promise.resolve(undefined);
  }

  resumeTorrent(id: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  private async login(): Promise<void> {
    const { username, password } = this.config;
    const res = await this.axios.post(
      '/auth/login',
      qs.stringify({ username, password })
    );
    if (!res.headers['set-cookie'] || !res.headers['set-cookie'].length) {
      throw new Error('Cookie not found. Auth Failed.');
    }
    const cookie = Cookie.parse(res.headers['set-cookie'][0]);
    if (!cookie || cookie.key !== 'SID') {
      throw new Error('Invalid cookie');
    }
  }

  private normalizeTorrent(torrent: QbTorrent): Torrent {
    const result: Torrent = {
      id: torrent.hash,
      name: torrent.name,
      magnet: torrent.magnet_uri,
      progress: torrent.progress,
      status: this.normalizeTorrentStatus(torrent.state),
      statusMessage: '',
      savePath: torrent.save_path,
      tags: torrent.tags.split(',').filter((tag) => tag.length > 0),
      uploadSpeed: torrent.upspeed,
      downloadSpeed: torrent.dlspeed,
      eta: torrent.eta,
      connectedPeers: torrent.num_leechs,
      totalPeers: torrent.num_incomplete,
      connectedSeeds: torrent.num_seeds,
      totalSeeds: torrent.num_complete,
      totalSize: torrent.total_size,
      totalSelected: torrent.size,
      totalUploaded: torrent.uploaded,
      totalDownloaded: torrent.downloaded,
    };
    result.eta = result.eta === 8640000 ? null : result.eta;
    return result;
  }

  private normalizeTorrentStatus(status: string): TorrentStatus {
    switch (status) {
      case QbTorrentState.Downloading:
      case QbTorrentState.StalledDL:
      case QbTorrentState.MetaDL:
      case QbTorrentState.ForcedDL:
        return TorrentStatus.Downloading;
      case QbTorrentState.Uploading:
      case QbTorrentState.StalledUP:
      case QbTorrentState.ForcedUP:
        return TorrentStatus.Seeding;
      case QbTorrentState.PausedUP:
      case QbTorrentState.PausedDL:
        return TorrentStatus.Paused;
      case QbTorrentState.QueuedDL:
      case QbTorrentState.QueuedUP:
      case QbTorrentState.Allocating:
      case QbTorrentState.Moving:
        return TorrentStatus.Queued;
      case QbTorrentState.CheckingDL:
      case QbTorrentState.CheckingUP:
      case QbTorrentState.CheckingResumeData:
        return TorrentStatus.Checking;
      case QbTorrentState.Error:
      case QbTorrentState.MissingFiles:
        return TorrentStatus.Error;
      default:
        return TorrentStatus.Unknown;
    }
  }
}
