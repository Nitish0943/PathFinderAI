// app/api/chat/route.ts
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    Content, // Content type for stricter history typing
  } from "@google/generative-ai";
  import { NextRequest, NextResponse } from "next/server";
  
  const MODEL_NAME = "gemini-1.5-flash-latest"; // Using flash for speed, consider 'gemini-pro' if needed
  
  export async function POST(req: NextRequest) {
    // --- 1. Check API Key ---
    const apiKey = process.env.GEMINI_API_KEY;
  
    if (!apiKey) {
      console.error(
        "API Route Error: GEMINI_API_KEY environment variable is not set."
      );
      return NextResponse.json(
        { error: "Server configuration error: API key not found." },
        { status: 500 } // Use 500 for server config issues
      );
    }
  
    const genAI = new GoogleGenerativeAI(apiKey);
  
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      // Give the AI context and encourage structured output
      systemInstruction:
        "You are an expert AI Career Advisor specializing in the Indian job market. Provide helpful, concise, and relevant guidance based on user queries about careers, skills, job searching, and education in India. Use Markdown formatting (like lists, headings, bold) when it improves clarity. Be encouraging and professional.",
    });
  
    // --- Safety & Generation Config ---
    const generationConfig = {
      temperature: 0.8,
      topK: 1,
      topP: 0.95,
      maxOutputTokens: 800, // Increased slightly for potentially longer structured answers
    };
  
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];
    // --- End Config ---
  
    try {
      // --- 2. Parse Request ---
      const { history, message } = await req.json();
  
      if (!message || typeof message !== 'string' || message.trim() === '') {
        return NextResponse.json(
          { error: "Valid message content is required." },
          { status: 400 }
        );
      }
  
      // --- 3. Format History ---
      const formattedHistory: Content[] = (history || [])
        .map((msg: { role: string; content: string }) => {
          // Basic validation of message structure
          if (!msg || typeof msg.role !== 'string' || typeof msg.content !== 'string') {
              console.warn("API Route Warning: Invalid message structure in history:", msg);
              return null; // Skip invalid messages
          }
          return {
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          };
        })
        .filter((msg): msg is Content => msg !== null); // Type assertion after filtering nulls
  
      // --- 4. Validate History Start Role ---
      let validHistory = formattedHistory;
      if (validHistory.length > 0 && validHistory[0].role === "model") {
        // If the history starts with 'model', remove it for the startChat call.
        console.log(
          "API Route Info: Filtering out initial model message from history for Gemini."
        );
        validHistory = validHistory.slice(1);
      }
  
      // --- 5. Start Chat & Send Message ---
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: validHistory, // Use the potentially filtered history
      });
  
      console.log(`API Route Info: Attempting chat.sendMessage to ${MODEL_NAME}...`);
  
      let result;
      try {
        // This is the network call
        result = await chat.sendMessage(message);
        console.log("API Route Info: Successfully received result from Gemini.");
      } catch (sendMessageError: any) {
        console.error("API Route Error: chat.sendMessage failed.", sendMessageError);
        if (sendMessageError.cause) {
          console.error("API Route Error Cause:", sendMessageError.cause);
        }
        throw sendMessageError; // Re-throw to be caught by the outer try-catch
      }
  
      const response = result.response;
  
      // --- 6. Process and Return Response ---
      if (!response) {
        console.error("Gemini API Error: No response object received after sending message.");
        // Check for safety feedback which might block the response
        if (result?.response?.promptFeedback?.blockReason) {
           console.error("Gemini Safety Block Reason:", result.response.promptFeedback.blockReason);
           return NextResponse.json(
               { error: `Response blocked due to safety reasons: ${result.response.promptFeedback.blockReason}. Please rephrase your request.` },
               { status: 400 } // Bad Request due to content potentially
           );
        }
        return NextResponse.json(
          { error: "Failed to get response from AI service." },
          { status: 500 }
        );
      }
  
      const text = response.text();
      return NextResponse.json({ text });
  
    } catch (error: any) {
      // --- 7. Handle Errors ---
      console.error("API Route Error: Processing failed in /api/chat.", error);
      if (error.cause) {
        console.error("API Route Error Cause (outer catch):", error.cause);
      }
  
      if (error.message?.toLowerCase().includes('fetch failed') || error.cause) {
        console.error("API Route Diagnosis: Fetch failure detected. Likely network issue (connectivity, firewall, proxy, DNS).");
        return NextResponse.json(
          { error: "Network error: Unable to connect to the AI service. Please check server network configuration and internet access." },
          { status: 503 } // 503 Service Unavailable
        );
      }
  
      if (error.message && (error.message.includes("API_KEY_INVALID") || error.status === 400)) {
          console.error("API Route Diagnosis: Invalid API Key or Bad Request detected.");
          return NextResponse.json(
            { error: "Authentication error or invalid request. Please check server configuration (API Key) or the request format." },
            { status: 400 } // 400 Bad Request
          );
      }
  
      // Generic fallback error
      return NextResponse.json(
          { error: "An unexpected error occurred while processing your chat request." },
          { status: 500 }
      );
    }
  }