"use client";

import PropertyGrid from "@/src/components/AllProperty/PropertyGrid";
import PropertyHero from "@/src/components/AllProperty/PropertyHero";
import SidebarFilters from "@/src/components/AllProperty/SidebarFilters";
import { useState, useEffect } from "react";

export default function AllPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/seller-property");
        const data = await res.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // ফিল্টার ফাংশন (SidebarFilters থেকে ডাটা রিসিভ করবে)
  const handleFilterChange = (selectedFilters) => {
    let tempProperties = [...properties];

    // ১. লোকেশন ফিল্টার (Division)
    if (selectedFilters.location.length > 0) {
      tempProperties = tempProperties.filter((p) =>
        selectedFilters.location.some((loc) =>
          p.location?.address?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    // ২. প্রপার্টি টাইপ (Category)
    if (selectedFilters.propertyType.length > 0) {
      tempProperties = tempProperties.filter((p) =>
        selectedFilters.propertyType.includes(p.category)
      );
    }

    // ৩. বেডরুম ফিল্টার
    if (selectedFilters.bedrooms.length > 0) {
      tempProperties = tempProperties.filter((p) =>
        selectedFilters.bedrooms.includes(p.bedrooms.toString())
      );
    }

    // ৪. প্রাইস রেঞ্জ ফিল্টার
    if (selectedFilters.priceRange.length > 0) {
      tempProperties = tempProperties.filter((p) => {
        return selectedFilters.priceRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return p.price >= min && p.price <= max;
        });
      });
    }

    // ৫. অ্যামেনিটিস ফিল্টার (সবগুলো সিলেক্ট করা সুবিধা থাকতে হবে)
    if (selectedFilters.amenities.length > 0) {
      tempProperties = tempProperties.filter((p) =>
        selectedFilters.amenities.every((amenity) =>
          p.amenities?.includes(amenity)
        )
      );
    }

    setFilteredProperties(tempProperties);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.location?.address?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PropertyHero onSearch={handleSearch} />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR - এখানে প্রপসটি পাস করা হয়েছে */}
          <aside className="w-full lg:w-80 shrink-0">
            <SidebarFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* CONTENT */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold">
                  Available <span className="text-[var(--primary)]">Listings</span>
                </h2>
                <p className="text-[var(--muted-foreground)] mt-1">
                  Showing {filteredProperties.length} results{" "}
                  {searchQuery && `for "${searchQuery}"`}
                </p>
              </div>

              <select className="bg-[var(--card)] border border-[var(--border)] px-4 py-2 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--ring)]">
                <option>Newest First</option>
                <option>Price Low → High</option>
                <option>Price High → Low</option>
              </select>
            </div>

            <PropertyGrid properties={filteredProperties} loading={loading} />
          </div>
        </div>
      </div>
    </main>
  );
}