"use client";

import React from 'react';
import dynamic from 'next/dynamic'; // <-- নতুন অ্যাড করা হয়েছে
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

// Home Sections Imports
import Hero from './home/Hero';
import Features from './home/Features';
import VoiceSearch from './home/VoiceSearch';
import ExploreLocations from './home/ExploreLocations';
import SwipeDeck from './home/SwipeDeck';
import PropertyMap from './home/PropertyMap';
import Property3D from './home/Property3D';
import BeforeAfterSlider from './home/BeforeAfterSlider';
import SpaceReimaginer from './home/SpaceReimaginer';
import AeroTopoScanner from './home/AeroTopoScanner';
import PricePredictor from './home/PricePredictor';
import EMICalculator from './home/EMICalculator';

import AIDecorator from './home/AIDecorator';
import Included from './home/Included';
import ArchitecturalStory from './home/ArchitecturalStory';
import TestimonialSlider from './home/TestimonialSlider';
import FAQSection from './home/FAQSection';
import LiveSupportChat from './home/LiveSupportChat';


const EnvironmentalLayers = dynamic(
  () => import('./home/EnvironmentalLayers'),
  { 
    ssr: false, 
    loading: () => <div className="py-20 text-center text-white/50 animate-pulse">Loading Environmental Map...</div> 
  }
);

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>

        <Hero />
        <Features />
        <VoiceSearch />

        <ExploreLocations />
        <SwipeDeck />
        <PropertyMap />

      
        <Property3D />
        <BeforeAfterSlider />
        <SpaceReimaginer />
        <AeroTopoScanner />

  
        <PricePredictor />
        <EMICalculator />
        <EnvironmentalLayers />

      
        <AIDecorator />
        <Included />
        <ArchitecturalStory />

  
        <TestimonialSlider />
        <FAQSection />
        <LiveSupportChat />
      </main>
      <Footer />
    </div>
  );
}