
import { useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { useToast } from "@/hooks/use-toast";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  fontSize?: number;
  tabSize?: number;
  wordWrap?: boolean;
}

export function MonacoEditor({
  value,
  onChange,
  language = "javascript",
  theme = "vs-dark",
  fontSize = 14,
  tabSize = 2,
  wordWrap = true,
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // Set custom theme options
    editor.updateOptions({
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: fontSize,
      lineHeight: 1.5,
      minimap: {
        enabled: false,
      },
      scrollBeyondLastLine: false,
      renderLineHighlight: "all",
      roundedSelection: true,
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      automaticLayout: true,
      tabSize: tabSize,
      wordWrap: wordWrap ? "on" : "off",
      // Fixed the type error by using true instead of "on"
      lightbulb: {
        enabled: true
      }
    });
    
    // Focus the editor
    editor.focus();
    
    // Show a welcome toast
    toast({
      title: "Editor ready",
      description: "Start coding with AI-powered assistance",
      variant: "default",
    });
  };

  // Update editor options when props change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: fontSize,
        tabSize: tabSize,
        wordWrap: wordWrap ? "on" : "off",
      });
    }
  }, [fontSize, tabSize, wordWrap]);

  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Editor
      height="100%"
      language={language}
      theme="vs-dark" // Always use dark theme
      value={value}
      onChange={(value) => onChange(value || "")}
      onMount={handleEditorDidMount}
      options={{
        wordWrap: wordWrap ? "on" : "off",
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        formatOnPaste: true,
        formatOnType: true,
      }}
      className="rounded-lg overflow-hidden"
    />
  );
}
