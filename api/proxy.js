export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  if (!path || (!path.startsWith('get/') && !path.startsWith('set/'))) {
    return res.status(404).json({ error: 'Not found' });
  }

  const upstashUrl = process.env.UPSTASH_URL;
  const upstashToken = process.env.UPSTASH_TOKEN;
  const targetUrl = `${upstashUrl}/${path}`;

  let fetchOptions = {
    method: req.method,
    headers: {
      'Authorization': `Bearer ${upstashToken}`
    }
  };

  if (req.method === 'POST') {
    fetchOptions.body = JSON.stringify(req.body);
    fetchOptions.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();
    return res.status(response.status).send(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
