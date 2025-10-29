import React, { useRef, useEffect, useState } from 'react';
// Note: react-router-dom is intentionally not imported here to avoid a hard dependency.
// A lightweight navigate fallback is used inside the component so the file works
// even if react-router isn't installed in the project.

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Camera, Eye, ArrowLeft, ArrowRight, Smile, CheckCircle, XCircle, AlertTriangle, User } from 'lucide-react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

interface LivenessCheckProps {
  // onSuccess receives an optional base64 face image captured at completion
  onSuccess: (finalFaceImage?: string | null) => void;
  onCancel: () => void;
  userName: string;
}

type Challenge = 'BLINK' | 'LOOK_LEFT' | 'LOOK_RIGHT' | 'MOUTH_OPEN';
type VerificationStep = 'face_match' | 'liveness_detection';

interface ChallengeConfig {
  type: Challenge;
  instruction: string;
  icon: React.ReactNode;
  threshold: number;
  requiredFrames: number;
}

// Face storage / comparison removed from LivenessCheck.
// Face registration and persistent storage are handled in `VotingSignup`.

export function LivenessCheck({ onSuccess, onCancel, userName }: LivenessCheckProps) {
  // Lightweight navigate fallback so we don't require react-router-dom.
  const navigate = (path: string, opts?: { state?: any; replace?: boolean }) => {
    try {
      if (opts?.replace) {
        window.history.replaceState(opts?.state ?? {}, '', path);
      } else {
        window.history.pushState(opts?.state ?? {}, '', path);
      }
      // Dispatch popstate so any Router listening will react
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (e) {
      if (opts?.replace) window.location.replace(path);
      else window.location.href = path;
    }
  };
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const consecutiveFramesRef = useRef<number>(0);
  const advanceInProgressRef = useRef<boolean>(false);
  const lastVideoTimeRef = useRef<number>(-1);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);

  const [currentStep, setCurrentStep] = useState<VerificationStep>('liveness_detection');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const currentChallengeIndexRef = useRef<number>(0);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const onSuccessCalledRef = useRef<boolean>(false);
  const [failureReason, setFailureReason] = useState<string>('');
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(true);
  const [permissionState, setPermissionState] = useState<'prompt' | 'checking' | 'denied' | 'granted'>('prompt');
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });
  // Face-match state removed; face registration/verification is handled in VotingSignup

  // Adjusted thresholds for better detection
  const CHALLENGE_TIME_LIMIT = 15;
  const EYE_AR_THRESH = 0.25;
  const EYE_AR_CONSEC_FRAMES = 2;
  const MOUTH_AR_THRESH = 0.45;
  const LOOK_HOLD_FRAMES = 6;
  const LOOK_LEFT_THRESH = 0.03;
  const LOOK_RIGHT_THRESH = -0.03;

  const challenges: ChallengeConfig[] = [
    {
      type: 'BLINK',
      instruction: 'Blink your eyes naturally',
      icon: <Eye className="h-6 w-6" />,
      threshold: EYE_AR_THRESH,
      requiredFrames: EYE_AR_CONSEC_FRAMES
    },
    {
      type: 'LOOK_LEFT',
      instruction: 'Look to your left',
      icon: <ArrowLeft className="h-6 w-6" />,
      threshold: LOOK_LEFT_THRESH,
      requiredFrames: LOOK_HOLD_FRAMES
    },
    {
      type: 'LOOK_RIGHT',
      instruction: 'Look to your right',
      icon: <ArrowRight className="h-6 w-6" />,
      threshold: LOOK_RIGHT_THRESH,
      requiredFrames: LOOK_HOLD_FRAMES
    },
    {
      type: 'MOUTH_OPEN',
      instruction: 'Open your mouth wide',
      icon: <Smile className="h-6 w-6" />,
      threshold: MOUTH_AR_THRESH,
      requiredFrames: LOOK_HOLD_FRAMES
    }
  ];

  // Shuffle challenges once
  const shuffledChallenges = useRef(
    [...challenges].sort(() => Math.random() - 0.5)
  ).current;

  const currentChallenge = shuffledChallenges[currentChallengeIndex] ?? shuffledChallenges[0];


  // keep ref synced with state
  useEffect(() => {
    currentChallengeIndexRef.current = currentChallengeIndex;
  }, [currentChallengeIndex]);

  // Calculate Eye Aspect Ratio
  const calculateEAR = (eyePoints: number[][]): number => {
    const distance = (p1: number[], p2: number[]) => {
      return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    };

    const A = distance(eyePoints[1], eyePoints[5]);
    const B = distance(eyePoints[2], eyePoints[4]);
    const C = distance(eyePoints[0], eyePoints[3]);

    return (A + B) / (2.0 * C);
  };

  // Calculate Mouth Aspect Ratio
  const calculateMAR = (landmarks: any[]): number => {
    const upperLip = landmarks[13];
    const lowerLip = landmarks[14];
    const leftCorner = landmarks[78];
    const rightCorner = landmarks[308];

    const vertical = Math.abs(upperLip.y - lowerLip.y);
    const horizontal = Math.abs(leftCorner.x - rightCorner.x);

    return vertical / horizontal;
  };

  // Calculate nose offset for left/right detection
  const calculateNoseOffset = (landmarks: any[]): number => {
    const nose = landmarks[1];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];

    const leftEyeCenter = leftEye.x;
    const rightEyeCenter = rightEye.x;
    const eyeCenter = (leftEyeCenter + rightEyeCenter) / 2;
    const offset = (nose.x - eyeCenter) / (rightEyeCenter - leftEyeCenter);

    return offset;
  };

  // Capture face image for matching
  const captureFaceImage = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  };


  // Update canvas size based on container
  const updateCanvasSize = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const height = Math.min((containerWidth * 3) / 4, 480);
      const width = (height * 4) / 3;
      
      setCanvasSize({ width, height });
      
      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    }
  };

  // Initialize MediaPipe Face Landmarker
  const initializeFaceLandmarker = async () => {
    try {
      console.log('Initializing Face Landmarker...');
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );

      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU"
        },
        outputFaceBlendshapes: false,
        runningMode: "VIDEO",
        numFaces: 1
      });

      faceLandmarkerRef.current = faceLandmarker;
      setIsModelReady(true);
      console.log('Face Landmarker initialized successfully');
    } catch (err) {
      console.error('Error initializing Face Landmarker:', err);
      setError('Failed to initialize face detection. Please refresh and try again.');
      setIsInitializing(false);
    }
  };

  // Check camera permissions
  const checkCameraPermission = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log('Camera permission status:', result.state);
        return result.state;
      }
      return 'prompt';
    } catch (err) {
      console.log('Permissions API not available, will request directly');
      return 'prompt';
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      setPermissionState('checking');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      console.log('Camera access granted');
      setPermissionState('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        await new Promise<void>((resolve, reject) => {
          if (videoRef.current) {
            const timeout = setTimeout(() => {
              reject(new Error('Video loading timeout'));
            }, 10000);
            
            videoRef.current.onloadedmetadata = () => {
              console.log('Video metadata loaded');
              clearTimeout(timeout);
              videoRef.current?.play().then(() => {
                console.log('Video playing');
                setIsCameraReady(true);
                resolve();
              }).catch(reject);
            };
          }
        });
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setPermissionState('denied');
      
      let errorMessage = 'Unable to access camera. ';
      let errorDetails = '';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission was denied.';
        errorDetails = 'Please click the camera icon in your browser\'s address bar and select "Allow", then click "Try Again" below.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found on your device.';
        errorDetails = 'Please ensure you have a working camera connected and try again.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use.';
        errorDetails = 'Please close other applications using the camera and try again.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not meet requirements.';
        errorDetails = 'Please try with a different camera.';
      } else {
        errorMessage = 'Unable to access camera.';
        errorDetails = 'Please check your device and browser settings, then try again.';
      }
      
      setError(errorMessage + ' ' + errorDetails);
      setIsInitializing(false);
    }
  };

  // Move to next challenge in liveness detection
  const moveToNextChallenge = () => {
    if (advanceInProgressRef.current) return;
    advanceInProgressRef.current = true;

    console.log('🎉 CHALLENGE COMPLETED! Moving from:', currentChallenge?.type ?? 'unknown');
    console.log('Current index:', currentChallengeIndex, 'Total challenges:', shuffledChallenges.length);

    consecutiveFramesRef.current = 0;
    setDetectionProgress(0);
    setChallengeProgress(0);
    setTimeRemaining(CHALLENGE_TIME_LIMIT);

    const maxIndex = shuffledChallenges.length - 1;
    const currentRefIndex = typeof currentChallengeIndexRef.current === 'number' ? currentChallengeIndexRef.current : currentChallengeIndex;

    if (currentRefIndex < maxIndex) {
      const newIndex = Math.min(currentRefIndex + 1, maxIndex);
      currentChallengeIndexRef.current = newIndex;
      setCurrentChallengeIndex(newIndex);

      setTimeout(() => {
        advanceInProgressRef.current = false;
      }, 300);
    } else {
      console.log('🎊 ALL CHALLENGES COMPLETED!');
      setIsComplete(true);
      stopCamera();
    }
  };

  // Process video frame for liveness detection
  const processFrame = () => {
    if (currentStep !== 'liveness_detection' || isComplete || hasFailed || !isCameraReady || !isModelReady) {
      return;
    }

    if (!videoRef.current || !canvasRef.current || !faceLandmarkerRef.current) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const currentTime = video.currentTime;
    
    if (currentTime === lastVideoTimeRef.current) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }
    
    lastVideoTimeRef.current = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    try {
      const startTimeMs = performance.now();
      const results = faceLandmarkerRef.current.detectForVideo(video, startTimeMs);

      const activeIndex = typeof currentChallengeIndexRef.current === 'number' ? currentChallengeIndexRef.current : currentChallengeIndex;
      const activeChallenge = shuffledChallenges[activeIndex] ?? shuffledChallenges[0];

      if (!activeChallenge) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        setFaceDetected(true);

        // Draw landmarks
        const drawingUtils = new DrawingUtils(ctx);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: '#30C5FF70', lineWidth: 1 }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
          { color: '#FF3030', lineWidth: 2 }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
          { color: '#FF3030', lineWidth: 2 }
        );
        
        ctx.restore();

        let challengeMet = false;
        let currentProgress = 0;

        console.log('Processing challenge:', activeChallenge?.type ?? 'unknown');

        if (activeChallenge.type === 'BLINK') {
          const leftEye = [33, 160, 158, 133, 153, 144].map(i => [landmarks[i].x, landmarks[i].y]);
          const rightEye = [362, 385, 387, 263, 373, 380].map(i => [landmarks[i].x, landmarks[i].y]);

          const leftEAR = calculateEAR(leftEye);
          const rightEAR = calculateEAR(rightEye);
          const avgEAR = (leftEAR + rightEAR) / 2;

          console.log('👁️ Blink - EAR:', avgEAR.toFixed(3), 'Frames:', consecutiveFramesRef.current);

          if (avgEAR < EYE_AR_THRESH) {
            consecutiveFramesRef.current++;
            currentProgress = (consecutiveFramesRef.current / EYE_AR_CONSEC_FRAMES) * 100;
            
            console.log('👁️ Blink in progress - frames:', consecutiveFramesRef.current, 'Progress:', currentProgress);
            
            if (consecutiveFramesRef.current >= EYE_AR_CONSEC_FRAMES) {
              challengeMet = true;
              console.log('✅ BLINK COMPLETED SUCCESSFULLY!');
            }
          } else {
            if (avgEAR > EYE_AR_THRESH + 0.1) {
              consecutiveFramesRef.current = 0;
              currentProgress = 0;
              console.log('👁️ Reset blink counter - eyes open');
            }
          }

        } else if (activeChallenge.type === 'LOOK_LEFT') {
          const offset = calculateNoseOffset(landmarks);
          console.log('👈 Look Left - Offset:', offset.toFixed(3), 'Threshold:', LOOK_LEFT_THRESH);

          if (offset > LOOK_LEFT_THRESH) {
            consecutiveFramesRef.current++;
            currentProgress = (consecutiveFramesRef.current / LOOK_HOLD_FRAMES) * 100;
            console.log('👈 Looking left - frames:', consecutiveFramesRef.current, 'Progress:', currentProgress);
            if (consecutiveFramesRef.current >= LOOK_HOLD_FRAMES) {
              challengeMet = true;
              console.log('✅ LOOK LEFT COMPLETED!');
            }
          } else {
            consecutiveFramesRef.current = 0;
            currentProgress = 0;
          }

        } else if (activeChallenge.type === 'LOOK_RIGHT') {
          const offset = calculateNoseOffset(landmarks);
          console.log('👉 Look Right - Offset:', offset.toFixed(3), 'Threshold:', LOOK_RIGHT_THRESH);

          if (offset < LOOK_RIGHT_THRESH) {
            consecutiveFramesRef.current++;
            currentProgress = (consecutiveFramesRef.current / LOOK_HOLD_FRAMES) * 100;
            console.log('👉 Looking right - frames:', consecutiveFramesRef.current, 'Progress:', currentProgress);
            if (consecutiveFramesRef.current >= LOOK_HOLD_FRAMES) {
              challengeMet = true;
              console.log('✅ LOOK RIGHT COMPLETED!');
            }
          } else {
            consecutiveFramesRef.current = 0;
            currentProgress = 0;
          }

        } else if (activeChallenge.type === 'MOUTH_OPEN') {
          const mar = calculateMAR(landmarks);
          console.log('👄 Mouth Open - MAR:', mar.toFixed(3), 'Threshold:', MOUTH_AR_THRESH);

          if (mar > MOUTH_AR_THRESH) {
            consecutiveFramesRef.current++;
            currentProgress = (consecutiveFramesRef.current / LOOK_HOLD_FRAMES) * 100;
            console.log('👄 Mouth open - frames:', consecutiveFramesRef.current, 'MAR:', mar.toFixed(3), 'Progress:', currentProgress);
            if (consecutiveFramesRef.current >= LOOK_HOLD_FRAMES) {
              challengeMet = true;
              console.log('✅ MOUTH OPEN COMPLETED!');
            }
          } else {
            consecutiveFramesRef.current = 0;
            currentProgress = 0;
          }
        }

        setDetectionProgress(currentProgress);

        if (challengeMet) {
          moveToNextChallenge();
        }
      } else {
        setFaceDetected(false);
        consecutiveFramesRef.current = 0;
        setDetectionProgress(0);
      }
    } catch (err) {
      console.error('Error processing frame:', err);
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsCameraReady(false);
    setIsModelReady(false);
  };

  // Timer effect for liveness detection
  useEffect(() => {
    if (currentStep !== 'liveness_detection' || isInitializing || isComplete || hasFailed || !isCameraReady || !isModelReady) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0.1) {
          setHasFailed(true);
          const typeText = currentChallenge?.type ? currentChallenge.type.replace('_', ' ').toLowerCase() : 'challenge';
          setFailureReason(`Time expired for ${typeText}`);
          stopCamera();
          return 0;
        }
        return prev - 0.1;
      });

      setChallengeProgress(prev => Math.min(prev + (100 / (CHALLENGE_TIME_LIMIT * 10)), 100));
    }, 100);

    return () => clearInterval(timer);
  }, [currentStep, isInitializing, isComplete, hasFailed, currentChallengeIndex, isCameraReady, isModelReady, currentChallenge]);

  // Initialize when permission is granted
  useEffect(() => {
    if (!showPermissionPrompt) {
      console.log('Starting initialization...');
      setIsInitializing(true);
      
      Promise.all([
        initializeFaceLandmarker(),
        startCamera()
      ]).then(() => {
        console.log('Initialization complete');
      }).catch((err) => {
        console.error('Initialization failed:', err);
      });
    }

    return () => {
      stopCamera();
    };
  }, [showPermissionPrompt]);

  // Start processing when both camera and model are ready for liveness detection
  useEffect(() => {
    if (currentStep === 'liveness_detection' && isCameraReady && isModelReady && !animationFrameRef.current && !isComplete && !hasFailed) {
      console.log('Starting liveness detection processing...');
      setIsInitializing(false);
      animationFrameRef.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [currentStep, isCameraReady, isModelReady, isComplete, hasFailed]);

  // When liveness is complete, call onSuccess once and ensure cleanup
  useEffect(() => {
    if (isComplete && !onSuccessCalledRef.current) {
      onSuccessCalledRef.current = true;
      const t = setTimeout(() => {
        try {
          // capture a final frame snapshot to send to parent for comparison
          let finalImage: string | null = null;
          try {
            if (canvasRef.current) {
              finalImage = canvasRef.current.toDataURL('image/jpeg', 0.9);
            }
          } catch (e) {
            console.warn('Failed to capture final image:', e);
            finalImage = null;
          }

          // navigate to voters list with verified flag and allow voting before informing parent
          try {
            navigate('/voters?verified=1&allowVote=1', { state: { verified: true, finalImage }, replace: true });
          } catch (e) {
            console.warn('Navigation to voters failed:', e);
          }

          // ensure camera and processing are stopped
          try { stopCamera(); } catch (e) { /* ignore */ }

          // notify parent (after navigation) so parent code that may mark "voted" doesn't run before UI update
          try {
            onSuccess(finalImage);
          } catch (err) {
            console.error('Error calling onSuccess:', err);
          }
        } catch (err) {
          console.error('Error calling onSuccess or navigating:', err);
        }
      }, 800);

      return () => clearTimeout(t);
    }
    return;
  }, [isComplete, onSuccess, navigate]);

  // Update canvas size on resize and initial load
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Update canvas when camera becomes ready
  useEffect(() => {
    if (isCameraReady) {
      setTimeout(updateCanvasSize, 100);
    }
  }, [isCameraReady]);

  

  // Rest of the component remains the same for permission prompt, error, liveness detection, etc.
  // ... (keep all the existing code for showPermissionPrompt, error, hasFailed, isComplete states)

  if (showPermissionPrompt) {
    return (
      <Card className="border-0 shadow-xl bg-white">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-green-600" />
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
            <Camera className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-lg text-slate-800">Camera access required</CardTitle>
          <CardDescription className="text-sm text-slate-600">
            Allow camera access to complete liveness verification and proceed to voting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
              {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="font-medium text-slate-800">{userName}</p>
              <p className="text-xs text-slate-500">Liveness verification before voting</p>
            </div>
          </div>

          <Alert className="border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              Your camera is used only for verification and processed locally.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              onClick={async () => {
                setShowPermissionPrompt(false);
                setIsInitializing(true);
                const permStatus = await checkCameraPermission();
                setPermissionState(permStatus === 'granted' ? 'granted' : 'checking');
              }}
              className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-green-700 text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 h-12"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-xl shadow-red-500/20 bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="h-2 bg-gradient-to-r from-red-400 to-red-600" />
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4">
            <Camera className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl text-red-800">Camera Access Required</CardTitle>
          <CardDescription className="text-red-700 text-base">{error}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Instructions */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <p className="font-semibold mb-2">How to enable camera access:</p>
              <ul className="space-y-1 text-sm list-disc list-inside">
                <li>Click the camera icon in your browser's address bar</li>
                <li>Select "Allow" for camera permissions</li>
                <li>Refresh the page if needed</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                setError(null);
                setIsInitializing(true);
                setIsCameraReady(false);
                setIsModelReady(false);
                Promise.all([
                  initializeFaceLandmarker(),
                  startCamera()
                ]);
              }}
              className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-green-700 hover:from-orange-700 hover:to-green-800 text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 h-12"
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasFailed) {
    return (
      <Card className="border-0 shadow-xl shadow-orange-500/20 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600" />
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl text-orange-800">Verification Failed</CardTitle>
          <CardDescription className="text-orange-700 text-base">
            {failureReason || 'Failed to complete the verification'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Please try again and follow the instructions carefully. Make sure your face is clearly visible and well-lit.
            </AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setHasFailed(false);
                setFailureReason('');
                setCurrentStep('liveness_detection');
                setCurrentChallengeIndex(0);
                setChallengeProgress(0);
                setTimeRemaining(CHALLENGE_TIME_LIMIT);
                consecutiveFramesRef.current = 0;
                setIsInitializing(true);
                setIsCameraReady(false);
                setIsModelReady(false);
                Promise.all([
                  initializeFaceLandmarker(),
                  startCamera()
                ]);
              }}
              className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-green-700 hover:from-orange-700 hover:to-green-800 text-white"
            >
              Try Again
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 h-12"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card className="border-0 shadow-2xl shadow-green-500/25 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600" />
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl text-green-800">Verification Complete!</CardTitle>
          <CardDescription className="text-green-700 text-base">
            Identity verified successfully. Redirecting to voting...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Liveness Detection Step UI (existing liveness detection UI)
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl shadow-blue-500/10 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-600" />
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-slate-800">Liveness Verification</CardTitle>
          <CardDescription className="text-slate-600 text-base">
            Complete the following challenges to prove you're a real person
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{userName}</p>
                <p className="text-sm text-slate-600">Liveness Detection Required</p>
              </div>
            </div>
          </div>

          {/* Challenge Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">
                  Challenge {currentChallengeIndex + 1} of {shuffledChallenges.length}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-600">
                {timeRemaining.toFixed(1)}s remaining
              </span>
            </div>
            <Progress value={(timeRemaining / CHALLENGE_TIME_LIMIT) * 100} className="h-2" />
          </div>

          {/* Current Challenge */}
          <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-6 border-2 border-orange-200">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white">
                {currentChallenge.icon}
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-orange-800">
                  {currentChallenge.instruction}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  Follow the instruction on screen
                </p>
              </div>
            </div>
            
            {/* Detection Progress Bar */}
            {detectionProgress > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">Detecting...</span>
                  <span className="text-sm font-medium text-green-700">{Math.round(detectionProgress)}%</span>
                </div>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-150"
                    style={{ width: `${detectionProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Video Feed */}
          <div 
            ref={containerRef}
            className="relative bg-black rounded-2xl overflow-hidden shadow-2xl mx-auto"
            style={{ 
              maxWidth: '640px',
              width: '100%',
              aspectRatio: '4/3'
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="hidden"
              width={640}
              height={480}
            />
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="w-full h-full object-contain"
              style={{
                display: isCameraReady ? 'block' : 'none'
              }}
            />
            
            {isInitializing && (
              <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center">
                <div className="text-center text-white max-w-sm px-6">
                  <Camera className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                  <p className="font-semibold text-lg mb-3">Setting up...</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      {isModelReady ? '✓' : '⏳'}
                      <span className={isModelReady ? 'text-green-400' : 'text-slate-300'}>
                        Face detection {isModelReady ? 'ready' : 'loading...'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      {isCameraReady ? '✓' : '⏳'}
                      <span className={isCameraReady ? 'text-green-400' : 'text-slate-300'}>
                        Camera {isCameraReady ? 'ready' : 'starting...'}
                      </span>
                    </div>
                  </div>
                  {permissionState === 'checking' && (
                    <div className="mt-4 bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                      <p className="text-xs text-blue-200">
                        If you see a permission popup, please click "Allow"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Overlay indicators */}
            {!isInitializing && (
              <>
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Secure Verification
                  </div>
                  <div className={`backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm ${
                    faceDetected ? 'bg-green-500/90' : 'bg-orange-500/90'
                  }`}>
                    <div className={`w-2 h-2 bg-white rounded-full inline-block mr-2 ${
                      faceDetected ? 'animate-pulse' : ''
                    }`} />
                    {faceDetected ? 'Face Detected' : 'Looking for face...'}
                  </div>
                </div>
                
                {/* Face not detected warning */}
                {!faceDetected && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-orange-500/90 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-center">
                      <p className="text-sm font-semibold">Position your face in the camera</p>
                      <p className="text-xs mt-1">Make sure your face is visible and well-lit</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Instructions */}
          <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <Camera className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Make sure your face is clearly visible and well-lit. Follow each instruction within the time limit.
            </AlertDescription>
          </Alert>

          {/* Progress Indicators */}
          <div className="grid grid-cols-4 gap-3">
            {shuffledChallenges.map((challenge, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  index < currentChallengeIndex
                    ? 'bg-green-100 border-green-400'
                    : index === currentChallengeIndex
                    ? 'bg-orange-100 border-orange-400 scale-110'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-2xl mb-1">
                  {index < currentChallengeIndex ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                  ) : (
                    challenge.icon
                  )}
                </div>
                  <p className={`text-xs ${
                  index < currentChallengeIndex
                    ? 'text-green-700'
                    : index === currentChallengeIndex
                    ? 'text-orange-700 font-semibold'
                    : 'text-slate-500'
                }`}>
                  {challenge?.type ? challenge.type.replace('_', ' ') : ''}
                </p>
              </div>
            ))}
          </div>

          <Button
            onClick={() => {
              stopCamera();
              onCancel();
            }}
            variant="outline"
            className="w-full h-12"
          >
            Cancel Verification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}