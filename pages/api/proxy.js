export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url');

  const target = decodeURIComponent(url);

  try {
    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    const contentType = response.headers.get('content-type') || 'text/plain';
    const buffer = await response.arrayBuffer();

    // Rewrite HTML to route all links through the proxy
    if (contentType.includes('text/html')) {
      let html = new TextDecoder().decode(buffer);
      const base = new URL(target);

      // Make relative URLs absolute
      html = html.replace(/(href|src|action)="(?!http|\/\/|#|mailto|javascript)([^"]+)"/g, (_, attr, path) => {
        const abs = new URL(path, base).href;
        return `${attr}="/api/proxy?url=${encodeURIComponent(abs)}"`;
      });

      // Rewrite absolute links too
      html = html.replace(/(href|src|action)="(https?:\/\/[^"]+)"/g, (_, attr, absUrl) => {
        return `${attr}="/api/proxy?url=${encodeURIComponent(absUrl)}"`;
      });

      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }

    res.setHeader('Content-Type', contentType);
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send(`Error fetching ${target}: ${e.message}`);
  }
}
