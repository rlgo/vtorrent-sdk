import { Torrent } from './torrent';

export interface TorrentClient {
  config: TorrentConfig;
  connected: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getTorrent: (id: string) => Promise<Torrent>;
  pauseTorrent: (id: string) => Promise<void>;
  resumeTorrent: (id: string) => Promise<void>;
  removeTorrent: (id: string, removeData: boolean) => Promise<void>;
  addTorrent: (options: AddTorrentOptions) => Promise<string>;
}

export interface TorrentConfig {
  url: string;
  username: string;
  password: string;
}

export interface AddTorrentOptions {
  magnet?: string;
  torrent?: Uint8Array;
  paused?: boolean;
  savePath?: string;
  category?: string;
  tags?: string[];
}
