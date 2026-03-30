"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Image as ImageIcon, 
  Smile, 
  CheckCheck,
  ArrowLeft,
  Loader2,
  Inbox,
  MessageCircle,
  Plus,
  X
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import { useChat } from "@/src/context/ChatContext";
import toast from "react-hot-toast";

export default function AdminChat() {
  const { data: session } = useSession();
  const { isDark } = useTheme();
  const { fetchChatCount } = useChat();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const scrollRef = useRef(null);

  // New Chat Modal State
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState("");
  const [newChatMessage, setNewChatMessage] = useState("");
  const [newChatLoading, setNewChatLoading] = useState(false);

  // 1. Fetch All Conversations for Admin
  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/admin/chat");
      const data = await res.json();
      if (res.ok) setConversations(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // 2. Fetch Messages for Active Chat
  const fetchMessages = async (contactId) => {
    if (!contactId) return;
    try {
      const res = await fetch(`/api/admin/chat?userId=${contactId}`);
      const data = await res.json();
      if (res.ok) setMessages(data);
    } catch (e) { console.error(e); }
  };

  // Initial Load
  useEffect(() => {
    if (session) fetchConversations();
  }, [session]);

  // Polling for new messages and conversations
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      fetchConversations();
      if (activeChat) fetchMessages(activeChat.id);
    }, 3000);
    return () => clearInterval(interval);
  }, [session, activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Send Message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const msgText = newMessage;
    setNewMessage("");

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          receiverId: activeChat.id, 
          text: msgText,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, data]);
        fetchConversations(); // Update last message in sidebar
      }
    } catch (e) { console.error(e); }
  };

  const handleSelectChat = (contact) => {
    setActiveChat(contact);
    setMsgLoading(true);
    fetchMessages(contact.id).then(() => {
      setMsgLoading(false);
      fetchChatCount(); // Refresh total count after marking messages as read
    });
  };

  const handleCreateNewChat = async (e) => {
    e.preventDefault();
    if (!newChatEmail.trim() || !newChatMessage.trim()) return;

    setNewChatLoading(true);
    try {
      // First, find the user by email using the new search API
      const userRes = await fetch(`/api/users/search?email=${encodeURIComponent(newChatEmail)}`);
      const userData = await userRes.json();

      if (!userRes.ok || !userData) {
        toast.error(userData.error || "User not found with this email.");
        setNewChatLoading(false);
        return;
      }

      const targetUser = userData;

      // Send the first message
      const sendRes = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          receiverId: targetUser.id || targetUser.uid || targetUser._id, 
          text: newChatMessage,
        }),
      });

      if (!sendRes.ok) {
        toast.error("Failed to send initial message.");
        setNewChatLoading(false);
        return;
      }

      // Check if conversation already exists in our local list
      const existingChat = conversations.find(c => String(c.id) === String(targetUser.id || targetUser.uid || targetUser._id));
      
      if (existingChat) {
        handleSelectChat(existingChat);
      } else {
        // Create a new conversation object locally
        const newContact = {
          id: String(targetUser.id || targetUser.uid || targetUser._id),
          name: targetUser.name || targetUser.email,
          email: targetUser.email,
          role: targetUser.role,
          image: targetUser.image,
          unreadCount: 0,
          lastMessage: newChatMessage,
          lastMessageTime: new Date().toISOString()
        };
        
        setConversations([newContact, ...conversations]);
        handleSelectChat(newContact);
      }
      
      setIsNewChatModalOpen(false);
      setNewChatEmail("");
      setNewChatMessage("");
      toast.success("Message sent and chat started!");
      fetchConversations();
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error("Failed to start new chat.");
    } finally {
      setNewChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className={`flex h-[calc(100vh-120px)] rounded-[2.5rem] overflow-hidden border transition-all ${
      isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-2xl"
    }`}>
      {/* Sidebar: Conversations */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r transition-all ${
        activeChat ? "hidden md:flex" : "flex"
      } ${isDark ? "border-[#1a4a40]/40" : "border-slate-100"}`}>
        <div className="p-6 border-b border-inherit">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>All Conversations</h2>
            <button 
              onClick={() => setIsNewChatModalOpen(true)}
              className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
              title="Create New Chat"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
            isDark ? "bg-white/5 border border-white/5" : "bg-slate-50 border border-slate-100"
          }`}>
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users or sellers..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {conversations.length > 0 ? (
            conversations.map((contact, idx) => (
              <button
                key={contact.id || `chat-${idx}`}
                onClick={() => handleSelectChat(contact)}
                className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all mb-1 ${
                  String(activeChat?.id) === String(contact.id)
                    ? isDark ? "bg-emerald-600/20 text-emerald-400 shadow-inner" : "bg-emerald-50 text-emerald-600"
                    : isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10">
                    <img src={contact.image || `https://ui-avatars.com/api/?name=${contact.name}&background=random`} className="w-full h-full object-cover" alt="" />
                  </div>
                  {contact.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0b1f1a]">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>{contact.name}</h4>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                      {contact.lastMessageTime ? new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                  </div>
                  <p className={`text-[10px] font-bold text-emerald-600 truncate mb-0.5 uppercase tracking-wider`}>
                    {contact.role}
                  </p>
                  <p className={`text-[11px] truncate ${contact.unreadCount > 0 ? "font-black text-emerald-500" : "text-slate-500"}`}>
                    {contact.lastMessage || "No messages yet..."}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-30 p-10 text-center">
              <Inbox size={48} className="mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeChat ? "hidden md:flex items-center justify-center bg-slate-50/30 dark:bg-black/10" : "flex"}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 md:p-6 border-b flex items-center justify-between transition-all ${
              isDark ? "border-[#1a4a40]/40 bg-white/5" : "border-slate-100 bg-white"
            }`}>
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border-2 border-emerald-600/20">
                  <img src={activeChat.image || `https://ui-avatars.com/api/?name=${activeChat.name}&background=random`} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className={`text-sm md:text-base font-black ${isDark ? "text-white" : "text-slate-900"}`}>{activeChat.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activeChat.role}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <button className={`p-2 md:p-3 rounded-xl transition-all ${isDark ? "hover:bg-white/5 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                  <Phone size={18} />
                </button>
                <button className={`p-2 md:p-3 rounded-xl transition-all ${isDark ? "hover:bg-white/5 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                  <Video size={18} />
                </button>
                <button className={`p-2 md:p-3 rounded-xl transition-all ${isDark ? "hover:bg-white/5 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {msgLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin text-emerald-600" />
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.senderId === session.user.id;
                  return (
                    <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] md:max-w-[70%] group`}>
                        <div className={`p-4 rounded-[1.5rem] text-sm font-medium transition-all ${
                          isMe 
                            ? "bg-emerald-600 text-white rounded-br-none shadow-lg shadow-emerald-600/20" 
                            : isDark ? "bg-white/5 text-white rounded-bl-none border border-white/5" : "bg-slate-100 text-slate-900 rounded-bl-none"
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-2 mt-1.5 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && <CheckCheck size={12} className={msg.seen ? "text-emerald-500" : "text-slate-300"} />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className={`p-6 transition-all ${isDark ? "bg-[#0b1f1a]" : "bg-white"}`}>
              <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button type="button" className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                    <ImageIcon size={20} />
                  </button>
                  <button type="button" className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                    <Smile size={20} />
                  </button>
                </div>
                <div className={`flex-1 flex items-center px-6 py-3 rounded-2xl border transition-all ${
                  isDark ? "bg-white/5 border-white/5 focus-within:border-emerald-600/50" : "bg-slate-50 border-slate-100 focus-within:border-emerald-600/50"
                }`}>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="bg-transparent border-none outline-none text-sm w-full font-medium"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center p-10">
            <div className="w-24 h-24 bg-emerald-600/10 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={40} />
            </div>
            <h3 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Admin Messenger</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">Select a conversation to start chatting with users or sellers.</p>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-[2rem] p-6 shadow-2xl ${isDark ? 'bg-[#0b1f1a] border border-[#1a4a40]' : 'bg-white border border-slate-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Start New Chat</h3>
              <button 
                onClick={() => setIsNewChatModalOpen(false)}
                className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateNewChat}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    User Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    value={newChatEmail}
                    onChange={(e) => setNewChatEmail(e.target.value)}
                    placeholder="Enter email to search..." 
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                      isDark 
                        ? 'bg-white/5 border-white/10 focus:border-emerald-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-emerald-500 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Your Message
                  </label>
                  <textarea 
                    required
                    rows={3}
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder="Type your first message..." 
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none ${
                      isDark 
                        ? 'bg-white/5 border-white/10 focus:border-emerald-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-emerald-500 text-slate-900'
                    }`}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={newChatLoading || !newChatEmail.trim() || !newChatMessage.trim()}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {newChatLoading ? <Loader2 className="animate-spin" size={20} /> : <MessageCircle size={20} />}
                Send & Start Chat
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
