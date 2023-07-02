enum TorrentStatus {
  downloading = 'downloading',
  seeding = 'seeding',
  paused = 'paused',
  queued = 'queued',
  checking = 'checking',
  error = 'error',
  unknown = 'unknown',
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
  eta: number;
  connectedPeers: number;
  totalPeers: number;
  connectedSeeds: number;
  totalSeeds: number;
  totalSize: number;
  totalSelected: number;
  totalUploaded: number;
  totalDownloaded: number;
}