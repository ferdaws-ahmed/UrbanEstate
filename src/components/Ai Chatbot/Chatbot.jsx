"use client";

import React, { useState, useEffect, useRef } from "react";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [aiMode, setAiMode] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Get current user from localStorage or session
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message handler
  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMsg = message;

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: userMsg,
        isAdmin: false,
        createdAt: new Date(),
      },
    ]);

    if (aiMode) {
      setAiLoading(true);

      try {
        const res = await fetch("/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg }),
        });
        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            message: data?.data?.message || "No response from AI",
            isAdmin: true,
            createdAt: new Date(),
            products: data?.data?.relatedProducts || [],
          },
        ]);
      } catch (error) {
        console.error("AI error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            message: "AI error. Switch to human support.",
            isAdmin: true,
            createdAt: new Date(),
          },
        ]);
      }
      setAiLoading(false);
    } else {
      // Human support mode - implement API call here
      try {
        // await apiCall('/api/chat/messages', {
        //   method: 'POST',
        //   body: JSON.stringify({ message: userMsg })
        // });
        console.log("Human support message sent:", userMsg);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Toggle AI/Human mode
  const toggleMode = () => {
    setAiMode(!aiMode);
    setMessages([]); // Clear messages when switching modes
  };

  if (!user) return null;

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <ChatWindow
          messages={messages}
          aiMode={aiMode}
          aiLoading={aiLoading}
          onSendMessage={sendMessage}
          onToggleMode={toggleMode}
          onClose={() => setIsOpen(false)}
          messagesEndRef={messagesEndRef}
        />
      )}
    </>
  );
};

export default Chatbot;
