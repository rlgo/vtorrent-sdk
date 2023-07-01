import {
  AddTorrentOptions,
  TorrentClient,
  TorrentConfig,
} from '../common/client';
import { Torrent } from '../common/torrent';

export class Qbittorrent implements TorrentClient {
  config: TorrentConfig;
  connected = false;

  constructor(config: TorrentConfig) {
    this.config = config;
  }

  login(): Promise<void> {
    return Promise.resolve(undefined);
  }

  logout(): Promise<void> {
    return Promise.resolve(undefined);
  }

  addTorrent(options: AddTorrentOptions): Promise<string> {
    return Promise.resolve('');
  }

  getTorrent(id: string): Promise<Torrent> {
    return Promise.resolve(undefined);
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
}
