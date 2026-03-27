"use client";

import React from "react";

const ChatButton = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 ${
        isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-label="Open chat support"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">💬</span>
        <span className="font-semibold hidden sm:inline">Support</span>
      </div>
    </button>
  );
};

export default ChatButton;
