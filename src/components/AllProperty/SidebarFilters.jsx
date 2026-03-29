"use client";

import { useState } from "react";

export default function SidebarFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    location: [],
    category: [],
    propertyType: [],
    bedrooms: [],
    amenities: [],
    priceRange: [],
  });

  const locations = [
    "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur",
    "Gulshan", "Banani", "Dhanmondi", "Uttara", "Mirpur", "Bashundhara"
  ];

  const categories = ["Residential", "Commercial", "Industrial", "Land"];
  const propertyTypes = ["Apartment", "Villa", "House", "Office", "Studio", "Land"];

  // চেক বক্স হ্যান্ডলার
  const handleCheckbox = (category, value) => {
    const isExist = filters[category].includes(value);
    const updatedCategory = isExist
      ? filters[category].filter((v) => v !== value)
      : [...filters[category], value];

    const newFilters = { ...filters, [category]: updatedCategory };
    
    // ১. নিজের স্টেট আপডেট করা
    setFilters(newFilters);
    
    // ২. সরাসরি প্যারেন্টকে আপডেট পাঠানো (useEffect এর দরকার নেই)
    if (typeof onFilterChange === "function") {
      onFilterChange(newFilters);
    }
  };

  const handleClear = () => {
    const reset = {
      location: [],
      category: [],
      propertyType: [],
      bedrooms: [],
      amenities: [],
      priceRange: [],
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  // UI Components
  const Section = ({ title, children }) => (
    <div className="space-y-3 pb-5 border-b border-[var(--ue-border)] last:border-0 last:pb-0">
      <h4 className="text-[12px] font-bold text-[var(--ue-foreground)] uppercase tracking-wider opacity-60">
        {title}
      </h4>
      <div className="space-y-2.5">{children}</div>
    </div>
  );

  const Checkbox = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-[var(--ue-border)] bg-transparent transition-all checked:bg-[var(--ue-primary)] checked:border-[var(--ue-primary)]"
        />
        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[10px]">
          ✓
        </span>
      </div>
      <span className="text-sm text-[var(--ue-foreground)] group-hover:text-[var(--ue-primary)] transition-colors capitalize">
        {label}
      </span>
    </label>
  );

  return (
    <div className="w-full max-w-xs">
      <div className="bg-[var(--ue-card)] border border-[var(--ue-border)] p-6 rounded-2xl shadow-sm flex flex-col max-h-[82vh]">
        <div className="flex items-center justify-between pb-5 border-b border-[var(--ue-border)] mb-5 shrink-0">
          <h3 className="text-xl font-bold text-[var(--ue-foreground)]">Filters</h3>
          <button onClick={handleClear} className="text-xs font-semibold text-red-500 hover:underline">
            Reset
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          <Section title="Location">
            {locations.map((d) => (
              <Checkbox key={d} label={d} checked={filters.location.includes(d)} onChange={() => handleCheckbox("location", d)} />
            ))}
          </Section>

          <Section title="Category">
            {categories.map((c) => (
              <Checkbox key={c} label={c} checked={filters.category.includes(c)} onChange={() => handleCheckbox("category", c)} />
            ))}
          </Section>

          <Section title="Property Type">
            {propertyTypes.map((t) => (
              <Checkbox key={t} label={t} checked={filters.propertyType.includes(t)} onChange={() => handleCheckbox("propertyType", t)} />
            ))}
          </Section>

          <Section title="Bedrooms">
            {[1, 2, 3, 4, 5].map((n) => (
              <Checkbox key={n} label={`${n} BR`} checked={filters.bedrooms.includes(n.toString())} onChange={() => handleCheckbox("bedrooms", n.toString())} />
            ))}
          </Section>

          <Section title="Price Range">
            {[
              { label: "Under 1M", value: "0-1000000" },
              { label: "1M - 5M", value: "1000000-5000000" },
              { label: "5M+", value: "5000000-999999999" },
            ].map((r) => (
              <Checkbox key={r.value} label={r.label} checked={filters.priceRange.includes(r.value)} onChange={() => handleCheckbox("priceRange", r.value)} />
            ))}
          </Section>

          <Section title="Amenities">
            {["wifi", "pool", "gym", "parking", "ac"].map((a) => (
              <Checkbox key={a} label={a} checked={filters.amenities.includes(a)} onChange={() => handleCheckbox("amenities", a)} />
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}