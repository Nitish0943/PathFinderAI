"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, Paperclip, Mic, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "./chat-message";
import { ChatSuggestion } from "./chat-suggestion";
import { ChatSidebar } from "./chat-sidebar";

// Keep mock suggested questions
const suggestedQuestions = [
  "What skills are in demand for IT jobs in Bengaluru?",
  "How can I transition from BPO to a tech career?",
  "What are the highest paying jobs in India for freshers?",
  "How do I prepare for campus placements?",
  "Which certifications are valued by Indian employers?",
];

// Define message type explicitly
interface Message {
  id: number | string; // Use string for timestamp-based IDs
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

export function AICareerChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-1", // Use string ID
      role: "assistant",
      content:
        "👋 Namaste! I'm your AI Career Advisor for the Indian job market. Ask me anything about careers, skills, or job searching in India!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for API errors
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // To prevent SSR issues with window

  // Ensure component is mounted on client before accessing window
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageToServer = useCallback(async (messageContent: string, currentMessages: Message[]) => {
    setIsTyping(true);
    setError(null);

    // Prepare history for API (limit context if needed)
    const historyToSend = currentMessages // Use the passed current messages
      .slice(-10) // Send last 10 messages for context
      .map(msg => ({ role: msg.role, content: msg.content }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: historyToSend,
          message: messageContent, // Use the provided message content
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { error: `HTTP error! status: ${response.status}` };
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.text) {
        const aiResponse: Message = {
          id: Date.now().toString() + '-ai', // Ensure unique string ID
          role: "assistant",
          content: data.text,
          timestamp: new Date().toISOString(),
        };
        // Use functional update to avoid stale state issues
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error("Received empty response from AI.");
      }

    } catch (err: any) {
      console.error("Failed to send message:", err);
      const errorMessage = err.message || "Failed to connect to the AI service. Please try again.";
      setError(errorMessage);
      const errorResponse: Message = {
         id: Date.now().toString() + '-error',
         role: "assistant",
         content: `😥 Sorry, I encountered an error: ${errorMessage}`,
         timestamp: new Date().toISOString(),
       };
       setMessages((prev) => [...prev, errorResponse]);

    } finally {
      setIsTyping(false);
    }
  }, []); // No dependencies needed here if we pass currentMessages

  const handleSendMessage = useCallback(() => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user', // Use timestamp string for potentially better unique ID
      role: "user",
      content: trimmedInput,
      timestamp: new Date().toISOString(),
    };

    // Update messages state first
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");

    // Then send to server with the updated messages array
    sendMessageToServer(trimmedInput, updatedMessages);

  }, [inputValue, isTyping, messages, sendMessageToServer]); // Add dependencies


  const handleSuggestionClick = useCallback((question: string) => {
     if (isTyping) return; // Prevent clicking while AI is responding

    const userMessage: Message = {
        id: Date.now().toString() + '-suggestion',
        role: "user",
        content: question,
        timestamp: new Date().toISOString(),
    };

    // Update messages state first
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue(''); // Clear input field

    // Then send to server
    sendMessageToServer(question, updatedMessages);

  }, [isTyping, messages, sendMessageToServer]); // Add dependencies


  return (
    <div className="container px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-240px)] min-h-[500px]"> {/* Adjusted height */}
        {/* Mobile sidebar toggle */}
        {isClient && ( // Render only on client
            <div className="lg:hidden flex justify-end mb-4">
                <Button
                    variant="outline"
                    className="border-blue-800/50 bg-blue-950/30 text-white hover:bg-blue-900/30"
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    aria-label={isMobileSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                >
                    {isMobileSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        )}

        {/* Sidebar */}
        <AnimatePresence>
          {isClient && (isMobileSidebarOpen || window.innerWidth >= 1024) && (
            <motion.div
              className={`lg:col-span-1 ${isMobileSidebarOpen ? 'fixed inset-0 z-50' : 'hidden'} lg:relative lg:z-0 lg:block`}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileSidebarOpen && <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />}
              <div className="relative h-full w-3/4 max-w-xs lg:w-full bg-blue-950/90 backdrop-blur-lg lg:bg-blue-950/20 lg:backdrop-blur-none border-r border-blue-800/30 p-4 overflow-auto shadow-lg lg:shadow-none">
                <ChatSidebar onClose={() => setIsMobileSidebarOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat area */}
        <div className="lg:col-span-3 flex flex-col rounded-xl border border-blue-800/30 bg-blue-950/20 overflow-hidden shadow-lg">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4"> {/* Adjusted spacing */}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Typing indicator */}
            {isTyping && (
                 <div className="flex items-start gap-3 w-full">
                     <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                         <Bot className="h-4 w-4 text-white" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="bg-indigo-950/50 rounded-xl rounded-tl-none px-4 py-3 text-white">
                             <div className="flex space-x-1.5 items-center h-5"> {/* Ensure consistent height */}
                                 <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                                 <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "200ms" }} />
                                 <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "400ms" }} />
                             </div>
                         </div>
                     </div>
                 </div>
            )}
             {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-0" />
          </div>

          {/* Suggested questions (only show if no messages besides initial one and not typing) */}
          {messages.length <= 1 && !isTyping && !error && (
            <div className="p-4 border-t border-blue-800/30">
              <p className="text-sm text-gray-400 mb-3">Or try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <ChatSuggestion key={index} question={question} onClick={() => handleSuggestionClick(question)} />
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="p-4 border-t border-blue-800/30 bg-blue-950/10">
             {/* Error Display */}
            {error && (
                <div className="mb-3 p-3 text-sm text-red-300 bg-red-950/60 border border-red-700/50 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0"/>
                    <span className="flex-1">{error}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-300 hover:bg-red-900/30" onClick={() => setError(null)}>
                         <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}
            {/* Input Row */}
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask me anything about careers in India..."
                  className="min-h-[52px] max-h-[180px] pr-20 bg-blue-950/40 border-blue-700/50 text-white placeholder:text-gray-500 resize-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" // Adjusted styles
                  disabled={isTyping}
                  rows={1} // Start with 1 row, auto-expands
                />
                {/* Action buttons inside Textarea wrapper */}
                <div className="absolute right-2 bottom-2 flex gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-blue-900/40 disabled:opacity-50"
                    disabled={isTyping}
                    title="Attach file (Not implemented)"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-blue-900/40 disabled:opacity-50"
                    disabled={isTyping}
                     title="Use microphone (Not implemented)"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="h-[52px] bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0 px-4" // Ensure consistent height & padding
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
             {/* Footer text */}
            <div className="flex items-center justify-center mt-3">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-blue-400" />
                 Powered by Gemini - Advice tailored for the Indian job market. May produce inaccurate information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}