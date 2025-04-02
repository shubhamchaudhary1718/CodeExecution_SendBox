
interface DeepseekMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface DeepseekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: DeepseekMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const callDeepseekApi = async (
  messages: DeepseekMessage[],
  apiKey: string
): Promise<string> => {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-coder",
        messages,
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `DeepSeek API error: ${response.status} ${
          errorData.error?.message || response.statusText
        }`
      );
    }

    const data: DeepseekResponse = await response.json();
    return data.choices[0]?.message?.content || "No response from AI";
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};

// Export the DeepseekMessage type so it can be imported in other files
export type { DeepseekMessage };
