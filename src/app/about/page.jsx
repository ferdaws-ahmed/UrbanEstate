"use client";

import React from "react";
import Link from "next/link";
import {
  HiHome,
  HiLocationMarker,
  HiUsers,
  HiStar,
  HiPhone,
  HiMail,
  HiArrowRight,
} from "react-icons/hi";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0f2e28] to-[#1a4a42] text-white py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <svg
                width="80"
                height="80"
                viewBox="0 0 200 200"
                fill="none"
                className="h-20 w-auto"
              >
                <g transform="translate(0, 10)">
                  <path d="M95 50 L135 40 L135 140 L95 140 Z" fill="#94a894" />
                  <path
                    d="M40 130 L100 80 L145 130 H190"
                    stroke="#cddfa0"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="140"
                    y="80"
                    width="35"
                    height="60"
                    fill="#cddfa0"
                    opacity="0.9"
                  />
                </g>
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Urban<span className="text-[#cddfa0]">Estate</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Your Trusted Partner in Finding the Perfect Property
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl font-bold text-[#0f2e28] dark:text-white mb-6">
                  Building Dreams, One Home at a Time
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-4">
                  Founded in 2020, UrbanEstate has emerged as a pioneering force
                  in Bangladesh's real estate market. We started with a simple
                  yet powerful mission: to make finding and buying properties
                  seamless, transparent, and enjoyable for everyone.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  Today, we're proud to connect thousands of buyers with their
                  dream properties across Dhaka and beyond. Our platform
                  combines cutting-edge technology with deep local market
                  expertise to deliver an unmatched real estate experience.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <HiHome className="w-12 h-12 text-[#0f2e28] dark:text-[#cddfa0] mx-auto mb-3" />
                  <p className="text-3xl font-bold text-[#0f2e28] dark:text-white">
                    500+
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Properties Listed
                  </p>
                </div>
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <HiUsers className="w-12 h-12 text-[#0f2e28] dark:text-[#cddfa0] mx-auto mb-3" />
                  <p className="text-3xl font-bold text-[#0f2e28] dark:text-white">
                    1000+
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Happy Clients
                  </p>
                </div>
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <HiLocationMarker className="w-12 h-12 text-[#0f2e28] dark:text-[#cddfa0] mx-auto mb-3" />
                  <p className="text-3xl font-bold text-[#0f2e28] dark:text-white">
                    15+
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Areas Covered
                  </p>
                </div>
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <HiStar className="w-12 h-12 text-[#0f2e28] dark:text-[#cddfa0] mx-auto mb-3" />
                  <p className="text-3xl font-bold text-[#0f2e28] dark:text-white">
                    4.9
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Customer Rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="p-8 bg-gradient-to-br from-[#0f2e28] to-[#1a4a42] text-white rounded-3xl shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-[#cddfa0]">
                  Our Mission
                </h2>
                <p className="text-gray-200 leading-relaxed text-lg">
                  To revolutionize the real estate experience by providing a
                  transparent, efficient, and customer-centric platform that
                  empowers people to find, buy, and sell properties with
                  confidence. We're committed to leveraging technology and local
                  expertise to make every property journey successful.
                </p>
              </div>
              <div className="p-8 bg-gradient-to-br from-[#cddfa0] to-[#94a894] text-[#0f2e28] rounded-3xl shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-white">
                  Our Vision
                </h2>
                <p className="text-white/90 leading-relaxed text-lg">
                  To become Bangladesh's most trusted and innovative real estate
                  partner, recognized for exceptional service, market integrity,
                  and transformative solutions. We envision a future where
                  everyone can easily access their dream property through
                  intelligent technology and personalized support.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-16">
              <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                <h3 className="text-2xl font-bold text-[#0f2e28] dark:text-white mb-4">
                  Innovation First
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We continuously evolve our platform with AI-powered features,
                  virtual tours, and smart search to enhance your property
                  discovery experience.
                </p>
              </div>
              <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                <h3 className="text-2xl font-bold text-[#0f2e28] dark:text-white mb-4">
                  Customer Obsession
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Every decision we make starts with our customers. Your
                  success, satisfaction, and trust are the foundations of
                  everything we do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#0f2e28] dark:text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                Have questions or need assistance? Our dedicated team is here to
                help you every step of the way.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <HiPhone className="w-12 h-12 text-[#0f2e28] dark:text-[#cddfa0] mb-4" />
                <h3 className="text-xl font-bold text-[#0f2e28] dark:text-white mb-3">
                  Phone
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  +880 1234 567 890
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  +880 9876 543 210
                </p>
              </div>

              <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <HiMail className="w-12 h-12 text-[#0f2e28] dark:text-[#cddfa0] mb-4" />
                <h3 className="text-xl font-bold text-[#0f2e28] dark:text-white mb-3">
                  Email
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  info@urbanestate.com
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  support@urbanestate.com
                </p>
              </div>

              <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <HiLocationMarker className="w-12 h-12 text-[#0f2e28] dark:text-[#cddfa0] mb-4" />
                <h3 className="text-xl font-bold text-[#0f2e28] dark:text-white mb-3">
                  Office
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  House #123, Road #45
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Gulshan-2, Dhaka-1212
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#0f2e28] to-[#1a4a42] text-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Business Hours
              </h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <p className="font-semibold text-[#cddfa0] mb-2">
                    Sunday - Thursday
                  </p>
                  <p className="text-xl">9:00 AM - 8:00 PM</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <p className="font-semibold text-[#cddfa0] mb-2">
                    Friday - Saturday
                  </p>
                  <p className="text-xl">10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#0f2e28] dark:text-white mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
              Start your journey with UrbanEstate today and discover the perfect
              property for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/all-properties"
                className="inline-flex items-center justify-center bg-[#0f2e28] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#1a4a42] transition shadow-lg"
              >
                Browse Properties
                <HiArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center bg-[#cddfa0] text-[#0f2e28] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#b8cc89] transition shadow-lg"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
