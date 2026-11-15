// src/hooks/useCamera.js
import { useState, useEffect, useRef, useCallback } from 'react';

export function useCamera() {
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState('off'); // off, requesting, on, error
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  
  const streamRef = useRef(null);
  const isRequestingRef = useRef(false);
  const shouldStopRef = useRef(false);

  // 1. Enumerate available camera devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = list.filter(d => d.kind === 'videoinput');
        setDevices(videoDevices);
        
        if (videoDevices.length === 0) {
          setStatus('error');
          setError('No camera devices available.');
        } else if (!selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (err) {
        setError('Failed to read camera devices.');
        setStatus('error');
      }
    };
    getDevices();
  }, [selectedDeviceId]);

  // 2. Start Camera
  const startCamera = useCallback(async (deviceId) => {
    if (isRequestingRef.current || status === 'on') return;
    
    isRequestingRef.current = true;
    shouldStopRef.current = false;
    setStatus('requesting');
    setError(null);

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // If user hit stop while permission prompt was open, kill the new stream
      if (shouldStopRef.current) {
        newStream.getTracks().forEach(t => t.stop());
        setStatus('off');
      } else {
        streamRef.current = newStream;
        setStream(newStream);
        setStatus('on');
      }
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access in your browser.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is busy. Another application is using it.');
      } else {
        setError('An unexpected camera error occurred: ' + err.message);
      }
      setStatus('error');
    } finally {
      isRequestingRef.current = false;
    }
  }, [status]);

  // 3. Stop Camera
  const stopCamera = useCallback(() => {
    shouldStopRef.current = true; // tell any pending request to abort
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setStream(null);
    setStatus('off');
    setError(null);
  }, []);

  // 4. Switch Device (Restart with new device)
  const switchDevice = useCallback((deviceId) => {
    setSelectedDeviceId(deviceId);
    if (status === 'on') {
      stopCamera();
      // small timeout to allow tracks to fully release before restarting
      setTimeout(() => startCamera(deviceId), 200);
    }
  }, [status, startCamera, stopCamera]);

  // 5. Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return { 
    stream, 
    status, 
    error, 
    devices, 
    selectedDeviceId, 
    startCamera, 
    stopCamera, 
    switchDevice 
  };
}