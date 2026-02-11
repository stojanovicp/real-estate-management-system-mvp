export default function ApiState({
  loading,
  error,
  empty,
  emptyText = "Nema podataka.",
  children,
}) {
  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div className="error">{error}</div>;
  if (empty) return <div className="card">{emptyText}</div>;
  return children;
}
