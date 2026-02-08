import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../api/apiClient';

export default function ApartmentDetailsPage() {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const submitInquiry = async (e) => {
  e.preventDefault();
  setStatusMsg('');

 try {
  await api.post('/inquiries', {
    apartmentId: Number(id),
    name,
    email,
    message,
  });

  setName('');
  setEmail('');
  setMessage('');
  setStatusMsg('Upit je uspešno poslat.');
} catch (err) {
  setStatusMsg(err.message || 'Greška pri slanju upita');
}
};

  useEffect(() => {
  api
    .get(`/apartments/${id}`)
    .then((data) => setApartment(data))
    .catch(() => setError('Greška pri učitavanju stana'));
}, [id]);

  
  if (error) return <p>{error}</p>;
  if (!apartment) return <p>Učitavanje…</p>;

  return (
  <Layout title={`Stan ${apartment.number}`}>
    <div style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
      <p><strong>Površina:</strong> {apartment.area} m²</p>
      <p><strong>Sobe:</strong> {apartment.rooms}</p>
      <p><strong>Cena:</strong> {apartment.price} €</p>
      <p><strong>Status:</strong> {apartment.status}</p>
    </div>
    <div style={{ marginTop: 16, background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
        <h2>Pošalji upit</h2>

        <form onSubmit={submitInquiry} style={{ display: 'grid', gap: 10 }}>
            <input
            placeholder="Ime"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
            placeholder="Poruka"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            />
            <button type="submit">Pošalji</button>
        </form>

        {statusMsg && <p style={{ marginTop: 10 }}>{statusMsg}</p>}
    </div>
  </Layout>
  
);
}
