// hooks/useAdFreeTimeTracker.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BATCH_INTERVAL = 30000; // 30 seconds

export function useAdFreeTimeTracker(isPlaying: boolean) {
  const [localAdFreeTime, setLocalAdFreeTime] = useState(0);

  const updateServer = useCallback(async () => {
    if (localAdFreeTime > 0) {
      try {
        await axios.post('/api/update-ad-free-time', { seconds: localAdFreeTime });
        setLocalAdFreeTime(0); // Reset local time after successful update
      } catch (error) {
        console.error('Failed to update ad-free time:', error);
      }
    }
  }, [localAdFreeTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      // Update local time every second
      interval = setInterval(() => {
        setLocalAdFreeTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    // Send update to server every BATCH_INTERVAL
    const serverUpdateInterval = setInterval(updateServer, BATCH_INTERVAL);

    return () => clearInterval(serverUpdateInterval);
  }, [updateServer]);

  // Update server when component unmounts
  useEffect(() => {
    return () => {
      updateServer();
    };
  }, [updateServer]);

  return localAdFreeTime;
}
