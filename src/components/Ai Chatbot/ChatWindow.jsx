"use client";

import React, { useState } from "react";

const ChatWindow = ({
  messages,
  aiMode,
  aiLoading,
  onSendMessage,
  onToggleMode,
  onClose,
  messagesEndRef,
}) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    onSendMessage(inputMessage);
    setInputMessage("");
  };

  const handleProductClick = (productId) => {
    window.open(`/property/${productId}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Customer Support</h3>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-200 transition-colors"
            aria-label="Close chat"
          >
            &times;
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={onToggleMode}
            className={`px-3 py-1.5 rounded transition-all ${
              aiMode
                ? "bg-white text-blue-600 font-medium"
                : "bg-blue-500 hover:bg-blue-400"
            }`}
          >
            {aiMode ? "🤖 AI Assistant" : "👤 Human Support"}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p className="text-sm">
              {aiMode
                ? "👋 Hi! I'm your AI assistant. How can I help you today?"
                : "👋 Connected to human support. How can we assist you?"}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.isAdmin
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  : "bg-blue-600 text-white"
              }`}
            >
              <p className="text-sm">{msg.message}</p>

              {msg.products?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {msg.products.map((p) => (
                    <div
                      key={p.id}
                      className="text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => handleProductClick(p.id)}
                    >
                      <p className="font-medium">{p.name}</p>
                      <p className="text-blue-600 dark:text-blue-400">
                        BDT {p.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {aiLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                AI is thinking...
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={aiLoading || !inputMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
