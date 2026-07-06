"use client";

import PropertyGrid from "@/src/components/AllProperty/PropertyGrid";
import PropertyHero from "@/src/components/AllProperty/PropertyHero";
import SidebarFilters from "@/src/components/AllProperty/SidebarFilters";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function AllPropertiesPage() {
  const { status } = useSession();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest First");
  const [activeFilters, setActiveFilters] = useState({
    location: [],
    category: [],
    propertyType: [],
    bedrooms: [],
    amenities: [],
    priceRange: [],
  });

  // সেশন স্ট্যাটাস চেঞ্জ হলে ডাটা আবার ফেচ করা হবে
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/seller-property");
        const data = await res.json();
        const propertyList = Array.isArray(data) ? data : [];
        setProperties(propertyList);
        setFilteredProperties(propertyList);
      } catch (err) {
        console.error(err);
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [status]); // status এড করা হলো যাতে লগইন/আউট হলে ফেভারিট স্টেট আপডেট হয়

  // কনসোলিডেটেড ফিল্টার এবং সর্টিং লজিক
  useEffect(() => {
    let tempProperties = [...properties];

    // ১. সার্চ কুয়েরি (Title, Address, District)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tempProperties = tempProperties.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q) ||
          p.district?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.propertyType?.toLowerCase().includes(q)
      );
    }

    // ২. লোকেশন ফিল্টার (Division/District)
    if (activeFilters.location.length > 0) {
      tempProperties = tempProperties.filter((p) =>
        activeFilters.location.some((loc) =>
          p.address?.toLowerCase().includes(loc.toLowerCase()) ||
          p.district?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    // ৩. ক্যাটাগরি ফিল্টার (Residential, Commercial, etc.)
    if (activeFilters.category.length > 0) {
      tempProperties = tempProperties.filter((p) =>
        activeFilters.category.some(cat => 
          p.category?.toLowerCase() === cat.toLowerCase()
        )
      );
    }

    // ৪. প্রপার্টি টাইপ ফিল্টার (Apartment, Villa, etc.)
    if (activeFilters.propertyType.length > 0) {
      tempProperties = tempProperties.filter((p) =>
        activeFilters.propertyType.some(type => 
          p.propertyType?.toLowerCase() === type.toLowerCase()
        )
      );
    }

    // ৫. বেডরুম ফিল্টার
    if (activeFilters.bedrooms.length > 0) {
      tempProperties = tempProperties.filter((p) =>
        activeFilters.bedrooms.includes(p.bedrooms?.toString())
      );
    }

    // ৬. প্রাইস রেঞ্জ ফিল্টার
    if (activeFilters.priceRange.length > 0) {
      tempProperties = tempProperties.filter((p) => {
        return activeFilters.priceRange.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return p.price >= min && p.price <= max;
        });
      });
    }

    // ৭. অ্যামেনিটিস ফিল্টার
    if (activeFilters.amenities.length > 0) {
      tempProperties = tempProperties.filter((p) =>
        activeFilters.amenities.every((amenity) =>
          p.amenities?.includes(amenity)
        )
      );
    }

    // ৮. সর্টিং লজিক
    switch (sortBy) {
      case "Price Low → High":
        tempProperties.sort((a, b) => a.price - b.price);
        break;
      case "Price High → Low":
        tempProperties.sort((a, b) => b.price - a.price);
        break;
      case "Newest First":
      default:
        tempProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProperties(tempProperties);
  }, [properties, searchQuery, activeFilters, sortBy]);

  const handleFilterChange = (selectedFilters) => {
    setActiveFilters(selectedFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PropertyHero onSearch={handleSearch} />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Sticky */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-[88px]">
              <SidebarFilters onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Property Section */}
          <div className="flex-1">
            {/* Sticky Header */}
            <div className="sticky top-[88px] z-[10] py-4 -mx-4 -mt-12 mb-12 px-4 md:px-8" style={{backgroundColor: "var(--background)"}}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold">
                    Available <span className="text-[var(--primary)]">Listings</span>
                  </h2>
                  <p className="text-[var(--muted-foreground)] mt-1">
                    Showing {filteredProperties.length} results{" "}
                    {searchQuery && `for "${searchQuery}"`}
                  </p>
                </div>

                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[var(--card)] border border-[var(--border)] px-4 py-2 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--ring)] cursor-pointer"
                >
                  <option>Newest First</option>
                  <option>Price Low → High</option>
                  <option>Price High → Low</option>
                </select>
              </div>
            </div>

            {/* Property Grid */}
            <PropertyGrid properties={filteredProperties} loading={loading} />
          </div>
        </div>
      </div>
    </main>
  );
}
