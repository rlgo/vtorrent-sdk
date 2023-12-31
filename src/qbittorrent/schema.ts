import { z } from 'zod';

export enum QbTorrentState {
  Error = 'error',
  PausedUP = 'pausedUP',
  PausedDL = 'pausedDL',
  QueuedUP = 'queuedUP',
  QueuedDL = 'queuedDL',
  Uploading = 'uploading',
  StalledUP = 'stalledUP',
  CheckingUP = 'checkingUP',
  CheckingDL = 'checkingDL',
  Downloading = 'downloading',
  StalledDL = 'stalledDL',
  ForcedDL = 'forcedDL',
  ForcedMetaDL = 'ForcedMetaDL',
  ForcedUP = 'forcedUP',
  MetaDL = 'metaDL',
  Allocating = 'allocating',
  QueuedForChecking = 'queuedForChecking',
  CheckingResumeData = 'checkingResumeData',
  Moving = 'moving',
  Unknown = 'unknown',
  MissingFiles = 'missingFiles',
}

export const QbTorrentSchema = z.object({
  name: z.string(),
  hash: z.string(),
  magnet_uri: z.string(),
  added_on: z.number(),
  size: z.number(),
  progress: z.number(),
  dlspeed: z.number(),
  upspeed: z.number(),
  priority: z.number(),
  num_seeds: z.number(),
  num_complete: z.number(),
  num_leechs: z.number(),
  num_incomplete: z.number(),
  ratio: z.number(),
  eta: z.number(),
  state: z.nativeEnum(QbTorrentState),
  seq_dl: z.boolean(),
  f_l_piece_prio: z.boolean(),
  completion_on: z.number(),
  tracker: z.string(),
  trackers_count: z.number(),
  dl_limit: z.number(),
  up_limit: z.number(),
  downloaded: z.number(),
  uploaded: z.number(),
  downloaded_session: z.number(),
  uploaded_session: z.number(),
  amount_left: z.number(),
  save_path: z.string(),
  completed: z.number(),
  max_ratio: z.number(),
  max_seeding_time: z.number(),
  ratio_limit: z.number(),
  seeding_time_limit: z.number(),
  super_seeding: z.boolean(),
  seen_complete: z.number(),
  last_activity: z.number(),
  total_size: z.number(),
  time_active: z.number(),
  category: z.string(),
  tags: z.string(),
});
export type QbTorrent = z.infer<typeof QbTorrentSchema>;

export const QbTorrentArraySchema = z.array(QbTorrentSchema);
