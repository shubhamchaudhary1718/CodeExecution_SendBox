import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Send, Sparkles, Bot, Code, User, X, Key, AlertCircle, Terminal, Zap, Search, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { callCohereApi, validateApiKey, type CohereMessage } from "@/utils/cohereApi";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CohereModelType, COHERE_API_MODELS, DEFAULT_COHERE_MODEL } from "@/types/Editor";
import { useToast } from "@/hooks/use-toast";
import { snippets } from "@/utils/codeSnippets";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface AiChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCode: string;
  onInsertCode: (code: string) => void;
}

export function AiChat({ open, onOpenChange, currentCode, onInsertCode }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your AI coding assistant. Ask me for help with JavaScript/TypeScript or request code snippets like \"add two numbers\", \"factorial\", \"fibonacci\", or \"bubble sort\".",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("cohere_api_key") || "3SmyVyYN6m6iEDDgfX1xG39U4oqOwEThnF5eT3mB";
  });
  const [model, setModel] = useState<CohereModelType>(() => {
    return (localStorage.getItem("cohere_model") as CohereModelType) || DEFAULT_COHERE_MODEL;
  });
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("cohere_api_key", apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("cohere_model", model);
  }, [model]);

  useEffect(() => {
    if (!apiKey) {
      setShowApiInput(true);
    } else {
      setShowApiInput(false);
      setApiError(null);
    }
  }, [apiKey]);

  // Enhanced snippet matcher with more robust matching capabilities
  const findMatchingSnippet = (query: string) => {
    const searchTerm = query.toLowerCase().trim();
    
    // Common variations of requests
    const commonPhrases = [
      'how to', 'code for', 'show me', 'give me', 
      'example of', 'implement', 'function for', 
      'create', 'write', 'generate', 'can you'
    ];
    
    // Clean the search term by removing common phrases
    let cleanedSearchTerm = searchTerm;
    commonPhrases.forEach(phrase => {
      cleanedSearchTerm = cleanedSearchTerm.replace(phrase, '').trim();
    });
    
    // Additional patterns to match
    const patternMap = {
      'add': ['addition', 'sum', 'plus', 'add together', 'add up', 'adding', 'adds'],
      'multiply': ['multiplication', 'product', 'times', 'multiplying', 'multiplies'],
      'subtract': ['subtraction', 'minus', 'difference', 'subtracting', 'subtracts'],
      'divide': ['division', 'quotient', 'dividing', 'divides'],
      'factorial': ['fact', 'n!', 'calculate factorial'],
      'fibonacci': ['fib', 'fibonacci sequence', 'fibonacci series', 'fibonacci numbers'],
      'palindrome': ['check palindrome', 'is palindrome', 'palindrome check'],
      'prime': ['is prime', 'check prime', 'prime check', 'prime number'],
      'sort': ['sorting', 'ordered', 'arrange', 'sorted'],
      'reverse': ['reverse string', 'string reversal', 'backwards'],
      'gcd': ['greatest common divisor', 'greatest common factor', 'hcf'],
      'lcm': ['least common multiple', 'lowest common multiple'],
      'even': ['is even', 'check even', 'even number'],
      'odd': ['is odd', 'check odd', 'odd number'],
      'vowel': ['count vowels', 'vowel count'],
      'duplicate': ['remove duplicates', 'unique', 'deduplicate'],
      'swap': ['swap variables', 'exchange variables'],
      'array equal': ['compare arrays', 'arrays equal', 'array comparison'],
      'intersection': ['array intersection', 'common elements'],
      'empty': ['is empty', 'check empty', 'empty object'],
      'flatten': ['flatten array', 'flat array'],
      'random': ['random number', 'generate random', 'random integer']
    };
    
    // Try direct matching first with common variations
    const directMatches = snippets.filter(snippet => {
      const lowerName = snippet.name.toLowerCase();
      const lowerDesc = snippet.description.toLowerCase();
      
      // Check if query directly contains the snippet name
      return lowerName.includes(cleanedSearchTerm) || 
             cleanedSearchTerm.includes(lowerName) ||
             lowerDesc.includes(cleanedSearchTerm);
    });
    
    if (directMatches.length > 0) {
      // Sort by relevance - exact name matches first
      return directMatches.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase() === cleanedSearchTerm;
        const bNameMatch = b.name.toLowerCase() === cleanedSearchTerm;
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
      })[0];
    }
    
    // Try pattern matching with the cleaned search term
    for (const [key, patterns] of Object.entries(patternMap)) {
      for (const pattern of patterns) {
        if (cleanedSearchTerm.includes(pattern)) {
          const patternMatches = snippets.filter(snippet => 
            snippet.name.toLowerCase().includes(key) || 
            snippet.description.toLowerCase().includes(key)
          );
          
          if (patternMatches.length > 0) {
            return patternMatches[0];
          }
        }
      }
    }
    
    // If no direct or pattern matches, try fuzzy matching with the original search term
    const words = searchTerm.split(/\s+/);
    
    for (const snippet of snippets) {
      const snippetName = snippet.name.toLowerCase();
      const snippetDesc = snippet.description.toLowerCase();
      
      // Check if at least half of the words in the query match the snippet
      const matchCount = words.filter(word => 
        snippetName.includes(word) || snippetDesc.includes(word)
      ).length;
      
      if (matchCount >= Math.ceil(words.length / 3)) {
        return snippet;
      }
    }
    
    // If nothing matches directly, check if it's asking for a fundamental operation
    if (searchTerm.includes('add') && searchTerm.includes('number')) {
      return snippets.find(s => s.name.toLowerCase() === 'add two numbers');
    }
    if (searchTerm.includes('multiply') && searchTerm.includes('number')) {
      return snippets.find(s => s.name.toLowerCase() === 'multiply two numbers');
    }
    if (searchTerm.includes('subtract') && searchTerm.includes('number')) {
      return snippets.find(s => s.name.toLowerCase() === 'subtract two numbers');
    }
    if (searchTerm.includes('divide') && searchTerm.includes('number')) {
      return snippets.find(s => s.name.toLowerCase() === 'divide two numbers');
    }
    
    return null;
  };

  // When we detect the query is for code but no matching snippet exists
  const generateAICodeSnippet = async (query: string) => {
    if (!apiKey) {
      setShowApiInput(true);
      return null;
    }

    const promptTemplate = `
      Generate a clean, well-commented JavaScript/TypeScript code snippet for: "${query}"
      
      The code should:
      - Be easy to understand
      - Include helpful comments
      - Follow best practices
      - Be properly formatted with proper indentation
      - Be ready to run in a browser JavaScript environment
      
      Return ONLY the code with no additional text or explanation.
    `;

    const apiMessages: CohereMessage[] = [
      {
        role: "system",
        content: "You are a helpful JavaScript/TypeScript coding assistant. Provide clean, concise, well-commented code examples with no added text. Do not include explanations or conversations - ONLY output the code."
      },
      {
        role: "user",
        content: promptTemplate,
      },
    ];

    try {
      const aiResponse = await callCohereApi(apiMessages, apiKey, model);
      
      // Extract code if it's wrapped in markdown code blocks
      let code = aiResponse;
      const codeBlockRegex = /```(?:\w*\n)?([\s\S]*?)```/g;
      const match = codeBlockRegex.exec(aiResponse);
      if (match && match[1]) {
        code = match[1];
      }
      
      return code;
    } catch (error) {
      console.error("Failed to generate code snippet:", error);
      return null;
    }
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || !apiKey) return;

    setApiError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedInput,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Check if the input matches any code snippets
    const matchingSnippet = findMatchingSnippet(trimmedInput);
    
    if (matchingSnippet) {
      const snippetResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Here's the ${matchingSnippet.name} code:\n\n\`\`\`javascript\n${matchingSnippet.code}\n\`\`\``,
        timestamp: Date.now(),
      };
      
      setTimeout(() => {
        setMessages((prev) => [...prev, snippetResponse]);
        setIsLoading(false);
        
        // Automatically insert the code into the editor
        onInsertCode(matchingSnippet.code);
        
        toast({
          title: "Code inserted",
          description: `${matchingSnippet.name} code has been added to the editor`,
          variant: "default",
        });
      }, 500);
      
      return;
    }
    
    // If it looks like a code snippet request but we don't have it in our library,
    // generate it with AI
    const codeKeywords = [
      'code', 'function', 'algorithm', 'implementation', 'example', 
      'write', 'script', 'program', 'generate', 'create', 'javascript', 
      'typescript', 'js', 'ts'
    ];
    
    const isLikelyCodeRequest = codeKeywords.some(keyword => 
      trimmedInput.toLowerCase().includes(keyword)
    );
    
    if (isLikelyCodeRequest) {
      try {
        const generatedCode = await generateAICodeSnippet(trimmedInput);
        
        if (generatedCode) {
          const aiGeneratedResponse: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: `Here's the code for "${trimmedInput}":\n\n\`\`\`javascript\n${generatedCode}\n\`\`\``,
            timestamp: Date.now(),
          };
          
          setMessages((prev) => [...prev, aiGeneratedResponse]);
          setIsLoading(false);
          
          // Insert the generated code into the editor
          onInsertCode(generatedCode);
          
          toast({
            title: "AI-generated code inserted",
            description: "The requested code has been added to the editor",
            variant: "default",
          });
          
          return;
        }
      } catch (error) {
        console.error("Error generating code:", error);
        // If code generation fails, fall back to regular chat
      }
    }

    const apiMessages: CohereMessage[] = [
      {
        role: "system",
        content: "You are a helpful AI coding assistant. Provide clear, concise responses to help with coding issues. If you include code examples, format them using markdown code blocks. If the user asks for code examples, provide practical JavaScript/TypeScript implementations."
      },
      ...messages
        .filter((msg) => msg.id !== "welcome")
        .map((msg) => ({
          role: msg.role === "user" ? "user" as const : "assistant" as const,
          content: msg.content,
        })),
      {
        role: "user" as const,
        content: trimmedInput,
      },
    ];

    try {
      const aiResponse = await callCohereApi(apiMessages, apiKey, model);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Automatically extract and insert code if it contains a code block
      const codeBlockRegex = /```(?:\w*\n)?([\s\S]*?)```/g;
      let match;
      let extractedCode = "";
      
      while ((match = codeBlockRegex.exec(aiResponse)) !== null) {
        extractedCode = match[1];
      }
      
      if (extractedCode) {
        onInsertCode(extractedCode);
        toast({
          title: "Code inserted",
          description: "Code from the response has been added to the editor",
          variant: "default",
        });
      }
      
      if (aiResponse.startsWith("Error:")) {
        toast({
          title: "Error",
          description: aiResponse.substring(7),
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("Invalid API key") || errorMessage.includes("401")) {
        setApiError("Invalid API key. Please update your API key.");
        setShowApiInput(true);
        toast({
          title: "API Key Error",
          description: "Your API key seems to be invalid. Please update it.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "API Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      const errorResponseMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Error: Failed to get response from Cohere API. ${errorMessage}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractCode = (message: Message) => {
    const codeBlockRegex = /```(?:\w*\n)?([\s\S]*?)```/g;
    let match;
    let extractedCode = "";
    
    while ((match = codeBlockRegex.exec(message.content)) !== null) {
      extractedCode = match[1];
    }
    
    if (extractedCode) {
      onInsertCode(extractedCode);
      toast({
        title: "Code inserted",
        description: "Code from the message has been inserted into the editor",
        variant: "default",
      });
    } else {
      toast({
        title: "No code found",
        description: "No code block was found in this message",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAnalyzeCode = async () => {
    if (!apiKey) {
      setShowApiInput(true);
      return;
    }

    setApiError(null);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: "Please analyze my current code and suggest improvements:\n\n```\n" + currentCode + "\n```",
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    const apiMessages: CohereMessage[] = [
      {
        role: "system",
        content: "You are a helpful AI coding assistant. Analyze the provided code and suggest improvements for readability, performance, and best practices. Be specific and provide examples where helpful."
      },
      {
        role: "user",
        content: "Please analyze this code and suggest improvements:\n\n```\n" + currentCode + "\n```",
      },
    ];

    try {
      const aiResponse = await callCohereApi(apiMessages, apiKey, model);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      if (aiResponse.startsWith("Error:")) {
        toast({
          title: "Error",
          description: aiResponse.substring(7),
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("Invalid API key") || errorMessage.includes("401")) {
        setApiError("Invalid API key. Please update your API key.");
        setShowApiInput(true);
      }
      
      const errorResponseMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Error: Failed to get response from Cohere API. ${errorMessage}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateAndSaveApiKey = (key: string) => {
    if (validateApiKey(key)) {
      setApiKey(key);
      setShowApiInput(false);
      setApiError(null);
      toast({
        title: "API Key Saved",
        description: "Your Cohere API key has been saved.",
        variant: "default",
      });
    } else {
      setApiError("Please enter a valid API key. Cohere API keys are typically longer than 10 characters.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] md:max-w-[700px] lg:max-w-[800px] h-[80vh] flex flex-col p-0 gap-0 bg-editor-bg border-editor-border shadow-2xl rounded-xl overflow-hidden">
        <DialogHeader className="p-4 border-b border-editor-border bg-gradient-to-r from-editor-accent/5 via-editor-border/10 to-editor-bg relative backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-white">
              <Sparkles size={18} className="text-editor-accent animate-pulse" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Code Assistant</span>
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full bg-editor-border/30 hover:bg-editor-border/50 transition-colors"
            >
              <X size={16} className="text-white/80" />
            </Button>
          </div>
          <DialogDescription className="text-sm text-gray-400">
            Ask for code snippets like "add two numbers", "fibonacci", "bubble sort", or get help with your code.
          </DialogDescription>
        </DialogHeader>

        {showApiInput && (
          <div className="p-4 border-b border-editor-border bg-editor-border/30">
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-white flex items-center gap-2">
                <Key size={14} className="text-editor-accent" />
                Enter your Cohere API key to enable the AI assistant
              </label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter Cohere API key..."
                  className="flex-1 bg-editor-bg border-editor-border focus-visible:ring-editor-accent"
                />
                <Button 
                  onClick={() => validateAndSaveApiKey(apiKey)}
                  variant="outline"
                  className="bg-editor-bg border-editor-border hover:bg-editor-border"
                >
                  Save
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white flex items-center gap-2">
                  <Code size={14} className="text-editor-accent" />
                  Select Cohere model
                </label>
                <Select value={model} onValueChange={(value) => setModel(value as CohereModelType)}>
                  <SelectTrigger className="bg-editor-bg border-editor-border focus-visible:ring-editor-accent">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className="bg-editor-bg border-editor-border">
                    {COHERE_API_MODELS.map((modelOption) => (
                      <SelectItem key={modelOption} value={modelOption}>
                        {modelOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {apiError && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {apiError}
                  </AlertDescription>
                </Alert>
              )}
              
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-b from-editor-bg to-editor-bg/95">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-fade-in",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-editor-accent/20 flex items-center justify-center">
                      <Bot size={16} className="text-editor-accent" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] group p-3 rounded-xl",
                      message.role === "user"
                        ? "bg-editor-accent text-white rounded-tr-none"
                        : "bg-editor-border/70 text-white rounded-tl-none"
                    )}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.content.split("```").map((part, i) => {
                        if (i % 2 === 0) {
                          return <p key={i} className="mb-2">{part}</p>;
                        } else {
                          return (
                            <div key={i} className="relative">
                              <pre className="bg-black/30 p-3 rounded-md font-mono text-sm mb-2 overflow-x-auto">
                                {part}
                              </pre>
                              {message.role === "assistant" && (
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      navigator.clipboard.writeText(part);
                                      toast({
                                        title: "Copied to clipboard",
                                        variant: "default",
                                      });
                                    }}
                                    className="h-7 bg-black/50 hover:bg-black/70 text-white text-xs"
                                  >
                                    <Copy size={12} className="mr-1" /> Copy
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleExtractCode(message)}
                                    className="h-7 bg-editor-accent/70 hover:bg-editor-accent text-white text-xs"
                                  >
                                    <Zap size={12} className="mr-1" /> Insert
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-editor-accent/20 flex items-center justify-center">
                      <User size={16} className="text-editor-accent" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-editor-accent/20 flex items-center justify-center">
                    <Bot size={16} className="text-editor-accent" />
                  </div>
                  <div className="bg-editor-border/70 text-white p-3 rounded-xl rounded-tl-none max-w-[85%]">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-editor-accent/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 bg-editor-accent/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="h-2 w-2 bg-editor-accent/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-editor-border bg-editor-border/10 backdrop-blur-sm">
            {!apiKey ? (
              <div className="flex flex-col items-center justify-center p-4 gap-2">
                <Key size={24} className="text-editor-accent mb-2" />
                <p className="text-center text-muted-foreground mb-2">
                  Please enter your Cohere API key to enable the AI assistant
                </p>
                <Button 
                  onClick={() => setShowApiInput(true)}
                  variant="outline"
                  className="bg-editor-bg border-editor-border hover:bg-editor-border"
                >
                  Enter API Key
                </Button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask for code snippets, help with errors, or coding questions..."
                    className="min-h-[60px] max-h-[200px] bg-editor-bg/80 border-editor-border focus-visible:ring-editor-accent backdrop-blur-sm"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="h-auto bg-editor-accent hover:bg-editor-accent/90 transition-colors shadow-lg shadow-editor-accent/20"
                  >
                    <Send size={16} />
                  </Button>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-2 gap-2">
                  <div className="text-xs text-muted-foreground">
                    <span>Try "add two numbers", "fibonacci", "sorting algorithm"</span>
                  </div>
                  <div className="flex gap-2 flex-wrap md:flex-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 bg-editor-bg/80 hover:bg-editor-border transition-colors backdrop-blur-sm"
                      onClick={() => setShowApiInput(true)}
                    >
                      <Key size={14} className="mr-1" /> API Key
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 bg-editor-bg/80 hover:bg-editor-border transition-colors backdrop-blur-sm"
                      onClick={handleAnalyzeCode}
                      disabled={isLoading}
                    >
                      <Terminal size={14} className="mr-1" /> Analyze Code
                    </Button>
                    <a 
                      href="https://docs.cohere.com/docs/getting-started" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 bg-editor-bg/80 hover:bg-editor-border transition-colors backdrop-blur-sm"
                      >
                        <ExternalLink size={14} className="mr-1" /> Get Cohere API
                      </Button>
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
