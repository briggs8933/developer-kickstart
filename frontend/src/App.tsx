import { useEffect, useState } from 'react';
import './App.css';

interface ApiData {
  status: string;
  message: string;
}

function App() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from your local FastAPI backend
    fetch('http://127.0.0.1:8000/')
      .then((res) => {
        if (!res.ok) throw new Error('Network response failed');
        return res.json();
      })
      .then((data: ApiData) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Full-Stack Developer Kickstart</h1>
      <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Backend Status:</h2>
        {loading && <p>Connecting to FastAPI...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {data && (
          <div>
            <p><strong>Status:</strong> {data.status}</p>
            <p><strong>Message:</strong> {data.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;