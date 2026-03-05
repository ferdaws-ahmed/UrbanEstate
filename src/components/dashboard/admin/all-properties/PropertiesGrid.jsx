import PropertyCard from "./PropertyCard";

export default function PropertiesGrid() {
  const properties = Array.from({ length: 8 });

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {properties.map((_, i) => (
        <PropertyCard key={i} />
      ))}
    </div>
  );
}