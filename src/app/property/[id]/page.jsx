"use client";

import React, { useState } from "react";
import properties from "../../../src/data/properties";
import { useParams } from "next/navigation";

export default function PropertyPage() {
  const params = useParams();
  const propertyId = Number(params.id);
  const property = properties.find((p) => p.id === propertyId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingModal, setBookingModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, the property you're looking for doesn't exist.</p>
          <a href="/" className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Enhanced property data for display
  const propertyDetails = {
    ...property,
    description: "Experience the pinnacle of luxury living in this exquisite property. Featuring modern architecture, premium finishes, and a spacious layout, this home is perfect for those who seek comfort and elegance.",
    amenities: [
      { icon: "⚙", label: "Smart Home System" },
      { icon: "🏊", label: "Private Swimming Pool" },
      { icon: "🔒", label: "24/7 Security" },
      { icon: "💪", label: "Gym & Spa" },
      { icon: "🌿", label: "Garden Access" },
      { icon: "🚗", label: "Garage" },
      { icon: "🎬", label: "Theater Room" },
      { icon: "☕", label: "Luxury Kitchen" },
    ],
    highlights: [
      "Modern architectural design",
      "Premium quality finishes",
      "Energy-efficient systems",
      "Smart home automation",
      "Scenic views",
      "Master bedroom suite",
    ],
    gallery: [property.image, property.image, property.image, property.image],
  };

  const similarProperties = properties
    .filter((p) => p.id !== propertyId && Math.abs(p.price - property.price) < 500000)
    .slice(0, 3);

  return (
    <main className="w-full bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-emerald-600">
            RealEstate
          </a>
          <div className="flex items-center gap-4">
            <button onClick={() => setSaved(!saved)} className={`px-4 py-2 rounded-lg font-medium transition-all ${saved ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {saved ? "❤ Saved" : "🤍 Save"}
            </button>
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Back to Listings
            </a>
          </div>
        </div>
      </nav>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3">
            <div className="relative rounded-xl overflow-hidden bg-gray-200 h-96 md:h-[500px]">
              <img
                src={propertyDetails.gallery[selectedImage]}
                alt={`Property view ${selectedImage + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 px-4 py-2 bg-emerald-500 text-white rounded-full font-semibold text-sm">
                Featured Property
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
            {propertyDetails.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`min-w-24 md:min-w-0 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === idx ? "border-emerald-500 shadow-lg" : "border-gray-300"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Price & Title */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{propertyDetails.title}</h1>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-emerald-600">${propertyDetails.price.toLocaleString()}</div>
                <div className="text-gray-500 flex items-center gap-2">
                  📍 {property.lat.toFixed(4)}, {property.lng.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Key Features - Large Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">{propertyDetails.beds}</div>
                <div className="text-sm text-gray-600 mt-1">Bedrooms</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">{propertyDetails.baths}</div>
                <div className="text-sm text-gray-600 mt-1">Bathrooms</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <div className="text-3xl font-bold text-purple-600">{propertyDetails.size}</div>
                <div className="text-sm text-gray-600 mt-1">Area</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Property</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">{propertyDetails.description}</p>
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
                <p className="text-emerald-900 font-medium">💡 Pro Tip: Schedule a virtual tour or arrange an in-person viewing to experience this property firsthand.</p>
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Highlights</h2>
              <ul className="grid grid-cols-2 gap-3">
                {propertyDetails.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Amenities & Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {propertyDetails.amenities.map((amenity, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-emerald-500 transition-all text-center">
                    <div className="text-3xl mb-2">{amenity.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{amenity.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Table */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50 w-1/3">Property Type</td>
                      <td className="py-3 px-4 text-gray-600">Luxury Villa</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">Year Built</td>
                      <td className="py-3 px-4 text-gray-600">2023</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">Parking</td>
                      <td className="py-3 px-4 text-gray-600">2-Car Garage</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">Heating</td>
                      <td className="py-3 px-4 text-gray-600">Central HVAC</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">Utilities</td>
                      <td className="py-3 px-4 text-gray-600">Smart Metering</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h3>

              {/* Contact Agent Card */}
              <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 mb-3"></div>
                <div className="font-semibold text-gray-900">Emma Johnson</div>
                <div className="text-sm text-gray-600">Senior Agent</div>
                <div className="text-sm text-emerald-600 font-medium mt-2">📞 +1 (555) 123-4567</div>
              </div>

              {/* CTA Buttons */}
              <button
                onClick={() => setBookingModal(true)}
                className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg mb-3 transition-colors flex items-center justify-center gap-2"
              >
                📅 Schedule Tour
              </button>

              <button
                onClick={() => setContactModal(true)}
                className="w-full px-4 py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 mb-3"
              >
                💬 Send Message
              </button>

              <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                📞 Call Agent
              </button>

              {/* Property Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price/sqft</span>
                  <span className="font-semibold text-gray-900">${Math.round(propertyDetails.price / 500)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Est. Monthly</span>
                  <span className="font-semibold text-gray-900">${Math.round(propertyDetails.price / 360)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <section className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <a
                  key={prop.id}
                  href={`/property/${prop.id}`}
                  className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all group"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600">{prop.title}</h3>
                    <div className="text-emerald-600 font-bold text-xl mt-2">{prop.priceLabel}</div>
                    <div className="text-sm text-gray-500 mt-2">
                      {prop.beds} bed • {prop.baths} bath • {prop.size}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Schedule a Tour</h2>
              <button onClick={() => setBookingModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <button type="submit" className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                Confirm Tour
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Send Message</h2>
              <button onClick={() => setContactModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <textarea placeholder="Your Message" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
              <button type="submit" className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
