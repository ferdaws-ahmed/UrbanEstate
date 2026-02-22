export default function PropertyDetailPage({ params }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Property Detail: {params.id}</h1>
      <p className="mb-4">Detailed information about the property.</p>
    </div>
  );
}
