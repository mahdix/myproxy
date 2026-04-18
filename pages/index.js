import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');

  const go = () => {
    let url = input.trim();
    if (!url.startsWith('http')) url = 'https://' + url;
    window.location.href = '/api/proxy?url=' + encodeURIComponent(url);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 40 }}>
      <h2>Web Proxy</h2>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && go()}
        placeholder="Enter a URL e.g. bbc.com"
        style={{ width: 400, padding: 8, fontSize: 16 }}
      />
      <button onClick={go} style={{ padding: '8px 16px', marginLeft: 8 }}>Go</button>
    </div>
  );
}
