import { Torrent } from './Torrent.js';
import { Observable } from 'rxjs';

export interface TorrentClient {
  config: TorrentConfig;
  observeAllTorrents: Observable<Torrent[]>;
  observeClientInfo: Observable<TorrentClientInfo>;
  pauseTorrent: (id: string) => Promise<void>;
  resumeTorrent: (id: string) => Promise<void>;
  removeTorrent: (id: string, removeData: boolean) => Promise<void>;
  addTorrent: (options: AddTorrentOptions) => Promise<string>;
}

export interface TorrentClientInfo {
  version: string;
  downloadSpeed: number;
  uploadSpeed: number;
  dhtNodes: number;
}

export interface TorrentConfig {
  url: string;
  username: string;
  password: string;
  syncInterval?: number;
}

export interface AddTorrentOptions {
  magnet?: string;
  torrent?: Uint8Array;
  paused?: boolean;
  savePath?: string;
  category?: string;
  tags?: string[];
}
