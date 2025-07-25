import http from 'http';

export async function checkAppiumStatus(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/wd/hub/status',
      method: 'GET',
      timeout: 2000,
    };

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json?.value?.ready === true);
        } catch {
          resolve(false);
        }
      });
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}
