"use client";

import dynamic from "next/dynamic";
import Navbar from "../src/components/shared/Navbar"; 
import Hero from "../src/components/home/Hero"; 
import Features from "../src/components/home/Features"; 
import EMICalculator from "../src/components/home/EMICalculator";
import ExploreLocations from "../src/components/home/ExploreLocations";
import TestimonialSlider from "../src/components/home/TestimonialSlider";
import Included from "../src/components/home/Included"; 
import ArchitecturalStory from "../src/components/home/ArchitecturalStory";
import PricePredictor from "../src/components/home/PricePredictor";
import SpaceReimaginer from "../src/components/home/SpaceReimaginer";
import LiveSupportChat from "../src/components/home/LiveSupportChat";
import BeforeAfterSlider from "../src/components/home/BeforeAfterSlider";
import AIDecorator from "../src/components/home/AIDecorator";
import FAQSection from "../src/components/home/FAQSection";

// --- Dynamic Imports 

const EnvironmentalLayers = dynamic(() => import("../src/components/home/EnvironmentalLayers"), { ssr: false });
const PropertyMap = dynamic(() => import("../src/components/home/PropertyMap"), { ssr: false });
const AeroTopoScanner = dynamic(() => import("../src/components/home/AeroTopoScanner"), { ssr: false });
const Property3D = dynamic(() => import("../src/components/home/Property3D"), { ssr: false });
const SwipeDeck = dynamic(() => import("../src/components/home/SwipeDeck"), { ssr: false });
const VoiceSearch = dynamic(() => import("../src/components/home/VoiceSearch"), { ssr: false });

export default function Home() {
  return (
    <main>
  <Navbar />
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
  );
}