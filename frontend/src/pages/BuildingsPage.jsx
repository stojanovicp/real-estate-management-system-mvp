import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { api } from '../api/apiClient';

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
  api
    .get('/buildings')
    .then((data) => setBuildings(data))
    .catch(() => setError('Greška pri učitavanju zgrada'));
}, []);

  if (error) return <p>{error}</p>;

  return (
  <Layout title="Zgrade">
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
      {buildings.map((b) => (
        <li key={b.id}>
            <Card>
                <Link to={`/buildings/${b.id}`} style={{ textDecoration: 'none', color: '#111827', fontWeight: 600 }}>
                    {b.name}
                </Link>
                <div style={{ color: '#6b7280', marginTop: 4 }}>{b.address}</div>
            </Card>
        </li>
      ))}
    </ul>
  </Layout>
);
}