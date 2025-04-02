
interface CohereMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface CohereResponse {
  text: string;
  generationId: string;
  message: {
    role: string;
    content: string;
  };
  finishReason: string;
  tools: any[];
  searchQueries: any[];
  searchResults: any[];
  documents: any[];
  citations: any[];
  relatedQuestions: any[];
  meta: {
    apiVersion: {
      version: string;
      httpPath: string;
    };
  };
}

export const validateApiKey = (apiKey: string): boolean => {
  // Basic validation for Cohere API keys (they typically start with specific prefixes)
  return apiKey && apiKey.length >= 10;
};

export const callCohereApi = async (
  messages: CohereMessage[],
  apiKey: string,
  model: string = "command"
): Promise<string> => {
  if (!validateApiKey(apiKey)) {
    throw new Error("Invalid API key format");
  }

  // Ensure all messages have non-empty content and filter them
  const validMessages = messages.filter(msg => msg.content && msg.content.trim().length > 0);
  
  if (validMessages.length === 0) {
    return "No valid messages to send to the API.";
  }

  // Make sure the user message content is not just quotes or very short
  const userMessages = validMessages.filter(msg => msg.role === "user");
  if (userMessages.length > 0) {
    // Get the last user message
    const lastUserMessage = userMessages[userMessages.length - 1];
    
    // Check if it's just quotes or very short
    const content = lastUserMessage.content.trim();
    if (content.startsWith('"') && content.endsWith('"') && content.length > 2) {
      // Remove the quotes
      lastUserMessage.content = content.substring(1, content.length - 1);
    }
    
    // Ensure it's not empty after processing
    if (lastUserMessage.content.trim().length === 0) {
      lastUserMessage.content = "Hello";
    }
  }

  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Cohere-Version": "2023-05-24"
      },
      body: JSON.stringify({
        model: model,
        messages: validMessages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      // Attempt to get error details
      let errorMessage = "";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || response.statusText;
        
        // Handle specific error cases
        if (errorMessage.includes("message must be at least 1 token long")) {
          throw new Error("Message is too short or empty. Please provide more detailed input.");
        }
      } catch (e) {
        errorMessage = response.statusText;
      }
      
      throw new Error(`Cohere API error: ${response.status} ${errorMessage}`);
    }

    const data: CohereResponse = await response.json();
    return data.message?.content || "No response from AI";
  } catch (error) {
    console.error("Error calling Cohere API:", error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};

// Export the CohereMessage type so it can be imported in other files
export type { CohereMessage };
