import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MonacoEditor } from "@/components/MonacoEditor";
import { OutputPanel } from "@/components/OutputPanel";
import { HistoryPanel } from "@/components/HistoryPanel";
import { AiChat } from "@/components/AiChat";
import { SettingsDialog } from "@/components/SettingsDialog";
import { HistoryItem, Settings } from "@/types/Editor";
import { useToast } from "@/hooks/use-toast";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { saveHistoryItem, getHistoryItems, clearHistoryItems } from "@/utils/localHistoryStorage";
import { Play, MessageSquare, Download, Settings as SettingsIcon, PanelLeft, PanelRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const DEFAULT_CODE = `// Write your JavaScript/TypeScript code here
console.log("Hello, World!");

// Try creating a function
function calculateSum(a, b) {
  return a + b;
}

// Log the result
console.log("Sum:", calculateSum(5, 10));`;

const DEFAULT_SETTINGS: Settings = {
  theme: "vs-dark",
  fontSize: 14,
  tabSize: 2,
  language: "javascript",
  autoSave: true,
  wordWrap: true,
};

export default function Index() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>(
    () => {
      const savedSettings = localStorage.getItem("code-editor-settings");
      return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
    }
  );
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const savedCode = localStorage.getItem("code-editor-code");
        if (savedCode) {
          setCode(savedCode);
        }
        
        const historyItems = getHistoryItems();
        setHistory(historyItems);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast({
          title: "Failed to load data",
          description: "Could not load your saved code and history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [toast]);

  useEffect(() => {
    localStorage.setItem("code-editor-settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (settings.autoSave) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem("code-editor-code", code);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [code, settings.autoSave]);

  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const executeCode = useCallback(async () => {
    setOutput([]);
    const newOutput: string[] = [];
    
    try {
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.log = (...args) => {
        originalLog(...args);
        newOutput.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
        setOutput([...newOutput]);
      };
      
      console.error = (...args) => {
        originalError(...args);
        newOutput.push(`Error: ${args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')}`);
        setOutput([...newOutput]);
      };
      
      console.warn = (...args) => {
        originalWarn(...args);
        newOutput.push(`Warning: ${args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')}`);
        setOutput([...newOutput]);
      };
      
      new Function(code)();
      
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        code,
        output: [...newOutput],
        timestamp: Date.now(),
        status: "success",
      };
      
      await saveHistoryItem(historyItem);
      setHistory(prev => [historyItem, ...prev]);
      
      toast({
        title: "Code executed successfully",
        variant: "default",
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      newOutput.push(`Error: ${errorMessage}`);
      setOutput([...newOutput]);
      
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        code,
        output: [...newOutput],
        timestamp: Date.now(),
        status: "error",
      };
      
      await saveHistoryItem(historyItem);
      setHistory(prev => [historyItem, ...prev]);
      
      toast({
        title: "Execution failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [code, toast]);

  const handleSaveCode = () => {
    localStorage.setItem("code-editor-code", code);
    toast({
      title: "Code saved",
      description: "Your code has been saved locally",
      variant: "default",
    });
  };

  const handleDownloadCode = () => {
    const fileExtension = settings.language === "javascript" ? "js" : "ts";
    const fileName = `code.${fileExtension}`;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code downloaded",
      description: `Saved as ${fileName}`,
      variant: "default",
    });
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setCode(item.code);
    setOutput(item.output);
    
    toast({
      title: "Code restored",
      description: "Code loaded from history",
      variant: "default",
    });
  };

  const handleHistoryClear = async () => {
    await clearHistoryItems();
    setHistory([]);
    toast({
      title: "History cleared",
      description: "Execution history has been cleared",
      variant: "default",
    });
  };

  const handleInsertCode = (snippetCode: string) => {
    setCode(snippetCode);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-editor-bg">
        <LoadingSpinner size={48} text="Loading editor..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-editor-bg text-foreground transition-colors duration-300">
      <header className="flex items-center justify-between p-4 border-b border-editor-border bg-gradient-to-r from-editor-bg via-editor-border/20 to-editor-bg">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-editor-accent to-editor-secondary flex items-center justify-center animate-pulse-glow">
            <span className="font-mono text-white">{"{ }"}</span>
          </div>
          Code Editor
        </h1>
        
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="bg-editor-bg border-editor-border hover:bg-editor-border"
            >
              {showSidebar ? <PanelRight size={16} /> : <PanelLeft size={16} />}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCode}
            className="bg-editor-bg border-editor-border hover:bg-editor-border"
          >
            <Download size={16} className="mr-2" />
            Download
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="bg-editor-bg border-editor-border hover:bg-editor-border"
          >
            <SettingsIcon size={16} className="mr-2" />
            Settings
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsChatOpen(true)}
            className="bg-editor-accent/20 border-editor-accent/50 hover:bg-editor-accent/40 text-editor-accent"
          >
            <MessageSquare size={16} className="mr-2" />
            Chat
          </Button>
          
          <Button
            onClick={executeCode}
            size="sm"
            className="gap-2 bg-editor-accent hover:bg-editor-accent/90"
          >
            <Play size={16} />
            Run Code
          </Button>
          
          <div className="ml-2">
            <UserProfileMenu />
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 h-[70vh] md:h-auto rounded-lg overflow-hidden border border-editor-border shadow-lg shadow-black/20 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-editor-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <MonacoEditor
            value={code}
            onChange={handleCodeChange}
            language={settings.language}
            theme={settings.theme}
            fontSize={settings.fontSize}
            tabSize={settings.tabSize}
            wordWrap={settings.wordWrap}
          />
        </div>
        
        {showSidebar && (
          <div className="w-full md:w-96 h-[60vh] md:h-auto flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-4 h-full">
              <OutputPanel 
                output={output} 
                className="flex-1"
              />
              
              <HistoryPanel
                history={history}
                onSelect={handleHistorySelect}
                onClear={handleHistoryClear}
                className="flex-1"
              />
            </div>
          </div>
        )}
      </main>
      
      <AiChat
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
        currentCode={code}
        onInsertCode={handleInsertCode}
      />
      
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onUpdateSettings={setSettings}
        currentCode={code}
      />
    </div>
  );
}
