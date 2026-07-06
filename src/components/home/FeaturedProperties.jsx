"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '../Theme/ThemeContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import PropertyCard from '../AllProperty/PropertyCard';
import CompareBar from './CompareBar';
import CompareModal from './CompareModal';
import { Manrope } from 'next/font/google';
import Link from 'next/link';

const manrope = Manrope({ subsets: ['latin'] });

export default function FeaturedProperties() {
  const { isDark } = useTheme();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState(new Set());
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/featured-properties');
        if (response.ok) {
          const data = await response.json();
          setFeaturedProperties(data);
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const toggleCompare = (property) => {
    setSelectedForCompare(prev => {
      const newSet = new Set(prev);
      if (newSet.has(property._id)) {
        newSet.delete(property._id);
      } else {
        if (newSet.size >= 3) {
          alert('You can compare up to 3 properties at a time!');
          return newSet;
        }
        newSet.add(property._id);
      }
      return newSet;
    });
  };

  const clearCompare = () => {
    setSelectedForCompare(new Set());
  };

  const getSelectedProperties = () => {
    return featuredProperties.filter(p => selectedForCompare.has(p._id)).map(p => ({
      ...p,
      bedrooms: p.beds,
      bathrooms: p.baths
    }));
  };

  if (isLoading) {
    return (
      <section className={`w-full py-20 px-6 ${manrope.className}`} style={{ backgroundColor: isDark ? 'var(--background)' : '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-2xl bg-gray-200 dark:bg-white/10 animate-pulse" />
            <div className="h-8 w-64 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[500px] bg-gray-200 dark:bg-white/10 rounded-[2.2rem] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProperties.length === 0) {
    return null;
  }

  return (
    <>
      <section className={`w-full py-24 px-6 lg:px-12 ${manrope.className}`} style={{ backgroundColor: isDark ? 'var(--background)' : '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--primary)' }}>
                <Sparkles size={24} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h2 className={`text-3xl lg:text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Featured Properties
                </h2>
                <p className={`text-sm font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Handpicked selections just for you
                </p>
              </div>
            </div>
            <Link href="/all-properties" className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95`} style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={{
                  ...property,
                  bedrooms: property.beds,
                  bathrooms: property.baths
                }}
                onToggleCompare={toggleCompare}
                isSelected={selectedForCompare.has(property._id)}
              />
            ))}
          </div>
        </div>
      </section>
      <CompareBar
        count={selectedForCompare.size}
        onOpen={() => setCompareModalOpen(true)}
        onClear={clearCompare}
      />
      <CompareModal
        open={compareModalOpen}
        items={getSelectedProperties()}
        onClose={() => setCompareModalOpen(false)}
      />
    </>
  );
}
