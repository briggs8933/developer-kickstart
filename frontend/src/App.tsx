import { useEffect, useState, type FormEvent } from 'react';
import './App.css';

interface Item {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/items');
        if (!response.ok) throw new Error('Failed to fetch items');
        const data: Item[] = await response.json();
        setItems(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchItems();
  }, []);

  // 2. Add a new item to SQLite via FastAPI POST
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) throw new Error('Failed to create item');

      const createdItem: Item = await response.json();
      setItems((prevItems) => [...prevItems, createdItem]);
      setNewTitle('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create item');
      }
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Full-Stack Task Tracker</h1>
      <p style={{ color: '#666' }}>Connected to Python FastAPI + SQLite Database</p>

      {/* Form to add items */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter a new task..."
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Add Item
        </button>
      </form>

      {/* Error & Loading Indicators */}
      {loading && <p>Loading items from database...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Item List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              padding: '0.75rem',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{item.title}</span>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>ID: {item.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;