// components/mentorship/chat-message.tsx
"use client";

import { motion } from "framer-motion";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/lib/utils"; // Import cn if you haven't already

interface ChatMessageProps {
  message: {
    id: number | string;
    role: "assistant" | "user";
    content: string;
    timestamp: string;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAssistant = message.role === "assistant";

  const formattedTimestamp = useMemo(() => {
    try {
        return formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
    } catch (e) {
        console.error("Failed to format timestamp:", message.timestamp, e);
        return "just now";
    }
  }, [message.timestamp]);

  return (
    <motion.div
      className="flex items-start gap-3 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <div
        className={cn( // Use cn for conditional classes
          "mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isAssistant ? "bg-indigo-600" : "bg-gray-700"
        )}
      >
        {isAssistant ? (
          <Bot className="h-4 w-4 text-white" />
        ) : (
          <User className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message Bubble & Timestamp Container */}
      <div className="flex-1 min-w-0 group">
        <div
          className={cn( // Use cn here too
            "relative rounded-xl px-4 py-3", // Base padding/rounding
             isAssistant
              ? "bg-indigo-950/50 rounded-tl-none text-white" // Assistant bubble style
              : "bg-blue-950/30 rounded-tr-none text-gray-300" // User bubble style
          )}
        >
          {/* --- FIX START --- */}
          {/* Wrap ReactMarkdown in a div and apply prose styles there */}
          {isAssistant ? (
            <div
              className="prose prose-sm prose-invert max-w-none
                         prose-p:before:content-none prose-p:after:content-none prose-p:my-2
                         prose-headings:mt-4 prose-headings:mb-2 prose-headings:font-semibold
                         prose-ul:list-disc prose-ol:list-decimal prose-li:my-1
                         prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:bg-black/30 prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                         prose-blockquote:border-l-blue-500 prose-blockquote:pl-3 prose-blockquote:italic prose-blockquote:my-2
                         prose-a:text-blue-400 hover:prose-a:underline
                         break-words"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
             // Apply prose to user messages too for consistency if desired, or keep simple p
            <div className="prose prose-sm prose-invert max-w-none">
                <p className="whitespace-pre-wrap break-words my-0">{message.content}</p> {/* Ensure no extra margin */}
            </div>
          )}
          {/* --- FIX END --- */}

          {/* Copy Button */}
          {isAssistant && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
              onClick={handleCopy}
              title="Copy text"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>

        {/* Timestamp */}
        <div className={cn(
            "mt-1.5 text-xs text-gray-500",
             isAssistant ? 'text-left' : 'text-right'
             )}>
            {formattedTimestamp}
        </div>
      </div>
    </motion.div>
  );
}