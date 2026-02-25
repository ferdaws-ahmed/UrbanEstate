"use client";

import dynamic from "next/dynamic";
import Navbar from "../components/shared/Navbar"; 
import Hero from "../components/home/Hero"; 
import Features from "../components/home/Features"; 
import EMICalculator from "../components/home/EMICalculator";
import ExploreLocations from "../components/home/ExploreLocations";
import TestimonialSlider from "../components/home/TestimonialSlider";
import Included from "../components/home/Included"; 
import ArchitecturalStory from "../components/home/ArchitecturalStory";
import PricePredictor from "../components/home/PricePredictor";
import SpaceReimaginer from "../components/home/SpaceReimaginer";
import LiveSupportChat from "../components/home/LiveSupportChat";
import BeforeAfterSlider from "../components/home/BeforeAfterSlider";
import AIDecorator from "../components/home/AIDecorator";
import FAQSection from "../components/home/FAQSection";

// --- Dynamic Imports 

const EnvironmentalLayers = dynamic(() => import("../components/home/EnvironmentalLayers"), { ssr: false });
const PropertyMap = dynamic(() => import("../components/home/PropertyMap"), { ssr: false });
const AeroTopoScanner = dynamic(() => import("../../src/components/home/AeroTopoScanner"), { ssr: false });
const Property3D = dynamic(() => import("../components/home/Property3D"), { ssr: false });
const SwipeDeck = dynamic(() => import("../components/home/SwipeDeck"), { ssr: false });
const VoiceSearch = dynamic(() => import("../components/home/VoiceSearch"), { ssr: false });

export default function Home() {
  return (
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
  );
}