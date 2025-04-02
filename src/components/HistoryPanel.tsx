
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { HistoryItem } from "@/types/Editor";
import { Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  className?: string;
}

export function HistoryPanel({ history, onSelect, onClear, className }: HistoryPanelProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock size={18} className="text-editor-accent" />
          Execution History
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={history.length === 0}
          className="text-xs bg-editor-bg/80 hover:bg-editor-border"
        >
          <Trash2 size={14} className="mr-1" /> Clear
        </Button>
      </div>
      <Separator className="mb-2 bg-editor-border" />
      <ScrollArea className="flex-1">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground p-4">
            No execution history
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left p-3 h-auto bg-editor-bg/30 hover:bg-editor-border border border-editor-border rounded-lg animate-fade-in"
                onClick={() => onSelect(item)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      item.status === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm truncate">
                    {item.code.substring(0, 40)}
                    {item.code.length > 40 ? "..." : ""}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
