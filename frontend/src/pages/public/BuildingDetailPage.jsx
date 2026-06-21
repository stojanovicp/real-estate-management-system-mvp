import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { api } from '../../api/apiClient';
import ApiState from '../../components/ApiState';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow });

function statusBadgeClass(status) {
  if (status === 'AVAILABLE') return 'badge badge--ok';
  if (status === 'RESERVED')  return 'badge badge--warn';
  if (status === 'SOLD')      return 'badge badge--bad';
  return 'badge';
}

function statusLabel(status) {
  if (status === 'AVAILABLE') return 'Dostupan';
  if (status === 'RESERVED')  return 'Rezervisan';
  if (status === 'SOLD')      return 'Prodat';
  return status || '—';
}

export default function BuildingDetailPage() {
  const { id } = useParams();

  const [building, setBuilding] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    Promise.all([
      api.get(`/buildings/${id}`),
      api.get(`/buildings/${id}/apartments`)
    ])
      .then(([bld, apts]) => {
        setBuilding(bld);
        setApartments(Array.isArray(apts) ? apts : []);
      })
      .catch((err) => {
        const details = err?.status ? ` (HTTP ${err.status})` : '';
        setError((err?.message || 'Greška pri učitavanju zgrade') + details);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const hasCoords =
    building?.latitude != null && building?.longitude != null;

  return (
    <ApiState
      loading={loading}
      error={error}
      empty={!building}
      emptyText="Zgrada nije pronađena."
    >
      <div>
        <div className="page-head">
          <div>
            <h2 className="page-title">{building?.name || `Zgrada #${id}`}</h2>
            <p className="page-sub">
              {building?.city ? `${building.city} — ` : ''}
              {building?.address || ''}
            </p>
          </div>
          <div>
            <Link className="link" to="/">
              ← Sve zgrade
            </Link>
          </div>
        </div>

        {building?.imageUrl && (
          <div style={{ marginBottom: 20 }}>
            <img
              src={building.imageUrl}
              alt={building.name}
              style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 8, objectFit: 'cover' }}
            />
          </div>
        )}

        {building?.description && (
          <div className="card" style={{ marginBottom: 20 }}>
            <p style={{ margin: 0 }}>{building.description}</p>
          </div>
        )}

        {hasCoords ? (
          <div style={{ height: 360, borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
            <MapContainer
              center={[building.latitude, building.longitude]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[building.latitude, building.longitude]}>
                <Popup>
                  <strong>{building.name}</strong>
                  {building.address && <><br />{building.address}</>}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          building?.address && (
            <div className="card" style={{ marginBottom: 24 }}>
              <span className="muted">Lokacija: </span>{building.address}
              {building.city ? `, ${building.city}` : ''}
            </div>
          )
        )}

        <h3 style={{ marginBottom: 12 }}>Stanovi u zgradi</h3>

        {apartments.length === 0 ? (
          <div className="card">Nema stanova u ovoj zgradi.</div>
        ) : (
          <div className="grid grid-2">
            {apartments.map((a) => (
              <div className="card" key={a.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 4 }}>
                      Stan #{a.number ?? a.id}
                    </div>
                    <div className="muted">
                      {a.rooms != null ? `${a.rooms} soba` : 'Sobe: -'} • Sprat:{' '}
                      {a.floor ?? '-'} •{' '}
                      {a.area ? `${a.area} m²` : 'Površina: -'}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      <span className={statusBadgeClass(a.status)}>
                        {statusLabel(a.status)}
                      </span>
                      <span className="badge">
                        {a.priceOnRequest
                          ? 'Cena na upit'
                          : a.price != null
                          ? `${a.price} €`
                          : 'Cena: -'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Link className="link" to={`/apartments/${a.id}`}>
                      Detalj →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ApiState>
  );
}
