import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const GlowCameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isStarting, setIsStarting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
      videoRef.current.srcObject = null;
    }

    setIsReady(false);
  };

  useEffect(() => {
  if (!isOpen) {
    stopStream();
    return;
  }

  let cancelled = false;

  const startCamera = async () => {
    try {
      setIsStarting(true);
      setIsReady(false);

      // Stop any old stream before starting a new one
      stopStream();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not available in this browser.");
      }

      let stream;

      try {
        // First try front camera with normal constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });
      } catch (firstError) {
        console.warn("Front camera failed, trying default camera:", firstError);

        // Fallback: use any available camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      const video = videoRef.current;

      if (!video) {
        setIsStarting(false);
        toast.error("Camera element not ready.");
        return;
      }

      video.srcObject = stream;

      await video.play();

      if (!cancelled) {
        setIsReady(true);
      }
    } catch (error) {
      console.error("Camera error:", error);

      if (error?.name === "NotAllowedError") {
        toast.error("Please allow camera access in your browser.");
      } else if (error?.name === "NotFoundError") {
        toast.error("No camera was found on this device.");
      } else if (error?.name === "NotReadableError") {
        toast.error("Camera is busy. Close other apps using the camera, then try again.");
      } else {
        toast.error("Could not access camera.");
      }

      stopStream();
    } finally {
      if (!cancelled) {
        setIsStarting(false);
      }
    }
  };

  startCamera();

  return () => {
    cancelled = true;
    stopStream();
  };
}, [isOpen]);

  if (!isOpen) return null;

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !isReady) {
      toast.error("Camera is not ready yet.");
      return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);

    stopStream();
    onCapture(imageDataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-black uppercase tracking-widest text-gray-900">
            Camera
          </h3>
          <button
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="text-gray-400 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
  <video
    ref={videoRef}
    autoPlay
    playsInline
    muted
    className="w-full h-full object-cover"
  />

  {isStarting && !isReady && (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <p className="text-white text-sm font-bold">Starting camera...</p>
    </div>
  )}
</div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                stopStream();
                onClose();
              }}
              className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 font-black uppercase text-[10px] tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={handleTakePhoto}
              disabled={!isReady}
              className="px-6 py-3 rounded-xl bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Take Photo
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default GlowCameraModal;