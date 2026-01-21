import React, { useState, useEffect } from 'react';
import { Send, Phone, Video, Search, MoreVertical, Check, CheckCheck } from 'lucide-react';

function Messages() {
  const [conversations, setConversations] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-[#0F1014] text-white pt-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <div className="flex gap-3">
            <button className="p-2 rounded-full bg-[#1B1C24] hover:bg-[#2B2D38] transition">
              <Search size={20} />
            </button>
            <button className="p-2 rounded-full bg-[#1B1C24] hover:bg-[#2B2D38] transition">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1B1C24] border border-white/10 rounded-xl py-3 px-4 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#875124]"
          />
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" 
          />
        </div>
        
        {/* Conversations List */}
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <div 
              key={conversation.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-[#1B1C24] hover:bg-[#2B2D38] transition cursor-pointer"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {conversation.avatar}
                </div>
                {conversation.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#875124] text-white text-xs rounded-full flex items-center justify-center">
                    {conversation.unread}
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold truncate">{conversation.name}</h3>
                  <span className="text-xs text-white/50 whitespace-nowrap">{conversation.time}</span>
                </div>
                <p className="text-sm text-white/70 truncate">{conversation.lastMessage}</p>
              </div>
              
              {/* Status indicator */}
              <div className="flex flex-col items-end">
                <CheckCheck size={16} className="text-white/50" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty state */}
        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">✉️</div>
            <h3 className="text-xl font-semibold mb-2">No messages found</h3>
            <p className="text-white/60">Try adjusting your search or start a new conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;