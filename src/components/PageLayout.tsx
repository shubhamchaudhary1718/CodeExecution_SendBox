
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export function PageLayout({ 
  children, 
  className = "", 
  fullHeight = true 
}: PageLayoutProps) {
  return (
    <div className={`
      ${fullHeight ? 'min-h-screen' : ''} 
      bg-editor-bg flex flex-col 
      ${className}
    `}>
      {children}
    </div>
  );
}
