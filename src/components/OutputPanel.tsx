
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getThemeColors } from "@/types/Editor";

interface OutputPanelProps {
  output: string[];
  className?: string;
}

export function OutputPanel({ output, className }: OutputPanelProps) {
  const colors = getThemeColors();
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-semibold ${colors.text}`}>Output</h2>
      </div>
      <Separator className="mb-2 bg-editor-border" />
      <ScrollArea 
        className={cn(
          "flex-1 p-4 border rounded-lg",
          "bg-editor-bg/50 border-editor-border"
        )}
      >
        {output.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No output yet
          </div>
        ) : (
          <pre className="font-mono text-sm whitespace-pre-wrap">
            {output.map((line, index) => (
              <div
                key={index}
                className={cn(
                  "py-1 animate-fade-in",
                  line.includes("Error") || line.includes("error")
                    ? colors.errorText
                    : colors.successText
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {line}
              </div>
            ))}
          </pre>
        )}
      </ScrollArea>
    </div>
  );
}
