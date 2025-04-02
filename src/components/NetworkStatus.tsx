
// Update the NetworkStatus component to fix the connection property errors
// We'll replace the problematic connection checks with a more compatible approach

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Wifi, WifiOff } from 'lucide-react';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'unknown'>('unknown');
  const { toast } = useToast();

  useEffect(() => {
    // Check connection quality using a ping test
    const checkConnectionQuality = async () => {
      if (!navigator.onLine) {
        setConnectionQuality('unknown');
        return;
      }

      try {
        const startTime = Date.now();
        const response = await fetch('/ping', { method: 'HEAD', cache: 'no-store' });
        if (!response.ok) throw new Error('Network ping failed');
        
        const pingTime = Date.now() - startTime;
        setConnectionQuality(pingTime < 300 ? 'good' : 'poor');
      } catch (error) {
        // Fallback to basic online/offline detection
        setConnectionQuality(navigator.onLine ? 'unknown' : 'poor');
      }
    };

    // Initial connection check
    checkConnectionQuality();

    // Event handlers for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      checkConnectionQuality();
      toast({
        title: "You're back online",
        description: "Connection has been restored.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionQuality('unknown');
      toast({
        title: "You're offline",
        description: "Check your internet connection.",
        variant: "destructive",
      });
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set up a periodic check
    const intervalId = setInterval(checkConnectionQuality, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [toast]);

  // Only show when offline for a cleaner UI
  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
      <WifiOff size={16} />
      <span>Offline</span>
    </div>
  );
}
