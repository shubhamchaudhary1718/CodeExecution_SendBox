
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings as SettingsIcon, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Settings, getThemeColors } from "@/types/Editor";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
  currentCode: string;
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onUpdateSettings,
  currentCode,
}: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const { toast } = useToast();
  const colors = getThemeColors();

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setLocalSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      onUpdateSettings(newSettings);
      return newSettings;
    });
  };

  const handleDownloadCode = () => {
    const fileExtension = localSettings.language === "javascript" ? "js" : "ts";
    const fileName = `code.${fileExtension}`;
    const blob = new Blob([currentCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code downloaded",
      description: `Saved as ${fileName}`,
      variant: "default",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[500px] ${colors.bg} ${colors.text} border ${colors.border} rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm`}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon size={18} className="text-editor-accent" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Editor Settings</span>
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full bg-editor-border/30 hover:bg-editor-border/50 transition-colors"
          >
            <X size={16} className="text-white/80" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/90">Appearance</h3>
            <Separator className="bg-editor-border" />
            
            <div className="space-y-2">
              <Label htmlFor="language" className="text-white/80">Language</Label>
              <Select
                value={localSettings.language}
                onValueChange={(value) => handleChange("language", value as Settings["language"])}
              >
                <SelectTrigger id="language" className={`${colors.bg} border ${colors.border} focus-visible:ring-editor-accent`}>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className={`${colors.bg} border ${colors.border}`}>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="fontSize" className="text-white/80">Font Size: {localSettings.fontSize}px</Label>
              </div>
              <Slider
                id="fontSize"
                min={10}
                max={24}
                step={1}
                value={[localSettings.fontSize]}
                onValueChange={(value) => handleChange("fontSize", value[0])}
                className="py-4"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/90">Editor Behavior</h3>
            <Separator className="bg-editor-border" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="wordWrap" className="text-white/80">Word Wrap</Label>
                <p className={`text-xs ${colors.muted}`}>
                  Wrap text to the next line when it reaches the edge
                </p>
              </div>
              <Switch
                id="wordWrap"
                checked={localSettings.wordWrap}
                onCheckedChange={(checked) => handleChange("wordWrap", checked)}
                className="data-[state=checked]:bg-editor-accent"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoSave" className="text-white/80">Auto Save</Label>
                <p className={`text-xs ${colors.muted}`}>
                  Automatically save your code while typing
                </p>
              </div>
              <Switch
                id="autoSave"
                checked={localSettings.autoSave}
                onCheckedChange={(checked) => handleChange("autoSave", checked)}
                className="data-[state=checked]:bg-editor-accent"
              />
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleDownloadCode}
                variant="outline" 
                className={`w-full ${colors.bg} border ${colors.border} ${colors.hover} hover:bg-editor-border/50 transition-colors`}
              >
                <Download size={16} className="mr-2" />
                Download Code to Computer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
