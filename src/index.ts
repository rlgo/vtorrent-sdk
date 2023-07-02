import { QbClient } from './qbittorrent/client.js';

(async () => {
  const qbit = new QbClient({
    url: 'http://localhost:7722',
    username: 'admin',
    password: 'adminadmin',
    syncInterval: 1000,
  });

  await qbit.getAllTorrents().then((torrents) => {
    console.log(torrents.filter((t) => t.status === 'Downloading'));
  });
})();
