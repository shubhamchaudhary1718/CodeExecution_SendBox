
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/PageLayout";
import { ArrowRight } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <PageLayout className="items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 text-center">
        <div className="space-y-4 animate-fade-in">
          {/* Logo section */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-editor-accent/10 flex items-center justify-center animate-pulse-glow">
              <span className="text-4xl font-bold text-editor-accent glow-text">CE</span>
            </div>
          </div>
          
          {/* App name and description */}
          <h1 className="text-3xl font-bold text-white mt-6">Code Editor</h1>
          <p className="text-editor-accent/70 text-lg">
            A modern code editing experience
          </p>
          
          <div className="my-12 border-t border-editor-border"></div>
          
          <p className="text-muted-foreground">
            Create, edit, and share your code in a collaborative environment.
            Experience the future of web development.
          </p>
        </div>
        
        <Button 
          onClick={handleGetStarted} 
          className="mt-8 w-full bg-editor-accent hover:bg-editor-accent/90 text-white group animate-fade-in"
          size="lg"
        >
          Get Started
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </PageLayout>
  );
}
