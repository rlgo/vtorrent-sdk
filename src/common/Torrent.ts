export enum TorrentStatus {
  Downloading = 'Downloading',
  Seeding = 'Seeding',
  Paused = 'Paused',
  Queued = 'Queued',
  Checking = 'Checking',
  Error = 'Error',
  Unknown = 'Unknown',
}

export interface Torrent {
  id: string;
  name: string;
  magnet: string;
  progress: number;
  status: TorrentStatus;
  statusMessage: string;
  savePath: string;
  tags: string[];
  category?: string;
  uploadSpeed: number;
  downloadSpeed: number;
  eta: number | null;
  connectedPeers: number;
  totalPeers: number;
  connectedSeeds: number;
  totalSeeds: number;
  totalSize: number;
  totalSelected: number;
  totalUploaded: number;
  totalDownloaded: number;
}
