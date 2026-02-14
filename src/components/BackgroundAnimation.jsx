import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

// Real-time hand tracking - no state locking
const useHandTracking = () => {
    const handsDataRef = useRef({
        hands: [],
        isDetected: false,
        handCount: 0,
        bothHandsActive: false,
        singleHandActive: false,
        handsDistance: 0.5,
        normalizedDistance: 0.5,
        gesture: 'idle',
        velocity: { x: 0, y: 0 },
        bothFingersClosed: false,
        avgFingerSpread: 0.5,
        rotationAngle: 0,
        handRotationX: 0,
        handRotationY: 0,
        // 360 degree rotation tracking
        cumulativeRotationY: 0,
        cumulativeRotationX: 0,
        lastHandX: 0.5,
        lastHandY: 0.5,
        // Scroll tracking for single hand
        scrollDirection: 0,
        isScrolling: false
    });

    useEffect(() => {
        const videoElement = document.getElementById('input_video');
        const canvasElement = document.getElementById('output_canvas');
        
        if (!videoElement || !canvasElement) return;

        // Start camera using getUserMedia directly for better control
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { width: 640, height: 480 } 
                });
                videoElement.srcObject = stream;
                await videoElement.play();
                
                // Now initialize MediaPipe hands
                initializeHands();
            } catch (err) {
                console.error('Failed to acquire camera feed:', err);
            }
        };

        const hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 0,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.3
        });

        let lastPos = { x: 0.5, y: 0.5 };
        let lastTime = Date.now();

        const isFingerExtended = (landmarks, fingerIndices) => {
            const wrist = landmarks[0];
            const mcp = landmarks[fingerIndices[0]];
            const tip = landmarks[fingerIndices[fingerIndices.length - 1]];
            const mcpDist = Math.sqrt(Math.pow(mcp.x - wrist.x, 2) + Math.pow(mcp.y - wrist.y, 2));
            const tipDist = Math.sqrt(Math.pow(tip.x - wrist.x, 2) + Math.pow(tip.y - wrist.y, 2));
            return tipDist > mcpDist * 1.1;
        };

        hands.onResults((results) => {
            const data = handsDataRef.current;
            const canvasCtx = canvasElement.getContext('2d');
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                const hands = [];
                let avgX = 0, avgY = 0;
                let totalFingersOpen = 0;
                let rotationAngle = 0;
                
                results.multiHandLandmarks.forEach((landmarks, idx) => {
                    const palmLandmarks = [0, 5, 9, 13, 17];
                    let sumX = 0, sumY = 0;
                    palmLandmarks.forEach(i => { sumX += landmarks[i].x; sumY += landmarks[i].y; });
                    
                    const fingerMap = { thumb: [1,2,3,4], index: [5,6,7,8], middle: [9,10,11,12], ring: [13,14,15,16], pinky: [17,18,19,20] };
                    const fingersExtended = [0,1,2,3,4].map(i => isFingerExtended(landmarks, fingerMap[Object.keys(fingerMap)[i]]));
                    const openCount = fingersExtended.filter(Boolean).length;
                    totalFingersOpen += openCount;
                    
                    const palmX = sumX / palmLandmarks.length;
                    const palmY = sumY / palmLandmarks.length;
                    avgX += palmX;
                    avgY += palmY;
                    
                    // Calculate hand rotation from wrist to middle finger
                    const wrist = landmarks[0];
                    const middleMcp = landmarks[9];
                    const angle = Math.atan2(middleMcp.y - wrist.y, middleMcp.x - wrist.x);
                    rotationAngle += angle;
                    
                    hands.push({
                        id: idx,
                        x: -(palmX * 2 - 1),
                        y: -(palmY * 2 - 1),
                        rawX: palmX,
                        rawY: palmY,
                        isOpen: openCount >= 3,
                        fingerSpread: openCount / 5,
                        isClosed: openCount <= 1,
                        openFingers: openCount,
                        // Store specific finger states for navigation
                        indexExtended: fingersExtended[1],
                        middleExtended: fingersExtended[2],
                        ringExtended: fingersExtended[3],
                        pinkyExtended: fingersExtended[4]
                    });
                });

                avgX /= hands.length;
                avgY /= hands.length;
                
                const now = Date.now();
                const dt = Math.max((now - lastTime) / 1000, 0.001);
                lastTime = now;
                
                data.velocity = { x: (avgX - lastPos.x) / dt, y: (avgY - lastPos.y) / dt };
                lastPos = { x: avgX, y: avgY };

                data.hands = hands;
                data.isDetected = true;
                data.handCount = hands.length;
                
                // Only react when BOTH hands are active
                data.bothHandsActive = hands.length === 2;
                
                if (data.bothHandsActive) {
                    data.avgFingerSpread = totalFingersOpen / (hands.length * 5);
                    data.bothFingersClosed = hands[0].isClosed && hands[1].isClosed;
                    
                    // 360-degree rotation based on hand position (not cumulative)
                    // Map hand X position to Y-axis rotation (0-2PI)
                    // Map hand Y position to X-axis rotation (0-2PI)
                    data.cumulativeRotationY = (1 - avgX) * Math.PI * 2; // Left to right = full rotation
                    data.cumulativeRotationX = avgY * Math.PI * 2; // Top to bottom = full rotation
                    
                    const dx = hands[0].rawX - hands[1].rawX;
                    const dy = hands[0].rawY - hands[1].rawY;
                    data.handsDistance = Math.sqrt(dx * dx + dy * dy);
                    data.normalizedDistance = Math.min(1, Math.max(0, data.handsDistance / 0.5));
                    
                    if (data.bothFingersClosed) data.gesture = 'fist';
                    else if (data.normalizedDistance < 0.3) data.gesture = 'close';
                    else if (data.normalizedDistance > 0.7) data.gesture = 'spread';
                    else data.gesture = 'approach';
                } else {
                    // Single hand - gesture-based navigation
                    // 0 fingers (fist) = Home
                    // Index finger only (1st finger) = Projects  
                    // Index + middle fingers (2nd finger) = Skills
                    // Index + middle + ring fingers (3rd finger) = Contact
                    // Other combinations = no action
                    data.singleHandActive = true;
                    
                    const hand = hands[0];
                    
                    // Get specific finger states from hand object
                    const indexExtended = hand.indexExtended;
                    const middleExtended = hand.middleExtended;
                    const ringExtended = hand.ringExtended;
                    const pinkyExtended = hand.pinkyExtended;
                    
                    // Check for fist (all fingers closed)
                    const isFist = !indexExtended && !middleExtended && !ringExtended && !pinkyExtended;
                    
                    if (isFist || hand.openFingers === 0) {
                        // Scroll to hero (home)
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
                        // Only index finger extended - 1st finger
                        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
                        // Index + middle fingers extended - 2nd finger
                        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (indexExtended && middleExtended && ringExtended && !pinkyExtended) {
                        // Index + middle + ring fingers extended - 3rd finger
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }
                    // Other combinations = no action
                    
                    data.lastHandX = avgX;
                    data.lastHandY = avgY;
                    
                    // No reaction on sphere for single hand
                    data.gesture = 'idle';
                    data.handsDistance = 0.5;
                    data.normalizedDistance = 0.5;
                    data.bothFingersClosed = false;
                    data.avgFingerSpread = 0.5;
                }

                results.multiHandLandmarks.forEach((landmarks, idx) => {
                    const color = idx === 0 ? '#00FFFF' : '#FF00FF';
                    HAND_CONNECTIONS.forEach(([i, j]) => {
                        const s = landmarks[i], e = landmarks[j];
                        canvasCtx.strokeStyle = color; canvasCtx.lineWidth = 2;
                        canvasCtx.beginPath(); canvasCtx.moveTo(s.x*640, s.y*480); canvasCtx.lineTo(e.x*640, e.y*480); canvasCtx.stroke();
                    });
                });
            } else {
                data.hands = [];
                data.isDetected = false;
                data.handCount = 0;
                data.bothHandsActive = false;
                data.singleHandActive = false;
                data.gesture = 'idle';
                data.velocity = { x: 0, y: 0 };
                data.bothFingersClosed = false;
                data.avgFingerSpread = 0.5;
                data.handsDistance = 0.5;
                data.normalizedDistance = 0.5;
                data.rotationAngle = 0;
            }
            canvasCtx.restore();
        });

        const camera = new Camera(videoElement, {
            onFrame: async () => { if (videoElement.readyState === 4) await hands.send({ image: videoElement }); },
            width: 640, height: 480
        });
        camera.start();

        return () => { camera.stop(); hands.close(); };
    }, []);

    return handsDataRef;
};


//         <canvas id="preview_canvas" className="w-full h-full object-cover transform scale-x-[-1]" />
//         <div className="absolute bottom-2 left-2 text-xs font-mono" style={{ color: data.bothFingersClosed ? '#FF00FF' : data.gesture === 'spread' ? '#00FF00' : '#FFFF00' }}>
//             {data.bothFingersClosed ? 'FIST' : data.gesture === 'close' ? 'CLOSE' : data.gesture === 'spread' ? 'OPEN' : data.gesture === 'idle' ? 'NONE' : '...'}
//         </div>
// );

const ArcReactorSphere = ({ dataRef }) => {
    const pointsRef = useRef();
    const state = useRef({ scale: 1, targetScale: 1, rotation: 0, targetRotation: 0, rotationX: 0, targetRotationX: 0, glow: 0, baseRotation: 0 });
    
    const particles = useMemo(() => {
        const count = 6000, radius = 3;
        const positions = new Float32Array(count * 3);
        const original = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            positions.set([x,y,z], i*3); original.set([x,y,z], i*3);
            const c = new THREE.Color().setHSL(0.55 + (i/count)*0.1, 1, 0.5);
            colors.set([c.r,c.g,c.b], i*3);
        }
        return { positions, original, colors, count };
    }, []);

    useFrame((frameState) => {
        if (!pointsRef.current) return;
        const data = dataRef.current;
        const s = state.current;
        const time = frameState.clock.elapsedTime;

        // Only react when BOTH hands are active - ignore single hand
        if (data.isDetected && data.bothHandsActive) {
            // 360-degree rotation based on hand position
            s.targetRotation = data.cumulativeRotationY;
            s.targetRotationX = data.cumulativeRotationX;
            
            // Also react to gestures (open/close fingers)
            if (data.bothFingersClosed) { 
                s.targetScale = 0.3; 
                s.targetGlow = 1.5; 
            }
            else if (data.gesture === 'close') { 
                s.targetScale = 0.4; 
                s.targetGlow = 1.2; 
            }
            else if (data.gesture === 'spread') { 
                s.targetScale = 2.2; 
                s.targetGlow = 0.3; 
            }
            else { 
                s.targetScale = 1; 
                s.targetGlow = 0; 
            }
        } else if (!data.isDetected) {
            // Idle animation when NO hands detected - slow rotation
            s.targetScale = 1;
            s.targetGlow = 0;
            s.targetRotation = time * 0.3;
            s.targetRotationX = 0;
        } else if (data.singleHandActive) {
            // Completely frozen when single hand - no rotation, no movement at all
            s.targetScale = 1;
            s.targetGlow = 0;
            s.targetRotation = 0;
            s.targetRotationX = 0;
            // Force immediate stop - no interpolation
            s.scale = 1;
            s.glow = 0;
            s.rotation = 0;
            s.rotationX = 0;
        }

        // Smooth but fast interpolation
        s.scale += (s.targetScale - s.scale) * 0.15;
        s.glow += (s.targetGlow - s.glow) * 0.2;
        s.rotation += (s.targetRotation - s.rotation) * 0.1;
        s.rotationX += (s.targetRotationX - s.rotationX) * 0.1;

        const { position, color } = pointsRef.current.geometry.attributes;
        const sc = s.scale;
        const gl = s.glow;
        
        // Determine wave multiplier based on hand detection - only active with both hands
        const waveMultiplier = (data.isDetected && data.bothHandsActive) ? 0.2 : 0;

        for (let i = 0; i < particles.count; i++) {
            const i3 = i * 3;
            const ox = particles.original[i3] * sc;
            const oy = particles.original[i3+1] * sc;
            const oz = particles.original[i3+2] * sc;
            
            const wave = Math.sin(time * 0.5 + i * 0.003) * 0.01 * waveMultiplier;
            position.array[i3] = THREE.MathUtils.lerp(position.array[i3], ox + wave, 0.15);
            position.array[i3+1] = THREE.MathUtils.lerp(position.array[i3+1], oy + wave, 0.15);
            position.array[i3+2] = THREE.MathUtils.lerp(position.array[i3+2], oz, 0.15);
            
            color.array[i3] = THREE.MathUtils.lerp(color.array[i3], 0.1 + gl * 0.7, 0.15);
            color.array[i3+1] = THREE.MathUtils.lerp(color.array[i3+1], 0.4 + gl * 0.6, 0.15);
            color.array[i3+2] = THREE.MathUtils.lerp(color.array[i3+2], 0.8 + gl * 0.2, 0.15);
        }

        position.needsUpdate = true;
        color.needsUpdate = true;
        pointsRef.current.rotation.y = s.rotation;
        pointsRef.current.rotation.x = s.rotationX;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particles.count} array={particles.positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={particles.count} array={particles.colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.04} vertexColors transparent opacity={0.95} blending={THREE.AdditiveBlending} sizeAttenuation />
        </points>
    );
};

const BackgroundAnimation = () => {
    const dataRef = useHandTracking();
    const [renderKey, setRenderKey] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setRenderKey(k => k + 1), 16);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <video 
                id="input_video" 
                className="absolute w-[320px] h-[240px] bottom-4 right-4 opacity-50 rounded-lg" 
                style={{ transform: 'scaleX(-1)' }}
                playsInline 
                autoPlay 
                muted 
            />
            <canvas id="output_canvas" className="absolute w-[320px] h-[240px] bottom-4 right-4 opacity-50 rounded-lg transform scale-x-[-1]" />
            <canvas id="preview_canvas" className="w-full h-full object-cover transform scale-x-[-1]" />
            <div className="absolute bottom-2 left-2 text-xs font-mono" style={{ color: dataRef.current.bothFingersClosed ? '#FF00FF' : dataRef.current.gesture === 'spread' ? '#00FF00' : '#FFFF00' }}>
                {dataRef.current.bothFingersClosed ? 'FIST' : dataRef.current.gesture === 'close' ? 'CLOSE' : dataRef.current.gesture === 'spread' ? 'OPEN' : dataRef.current.gesture === 'idle' ? 'NONE' : '...'}
            </div>
            <div className="fixed inset-0 bg-[#010103]">
                <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
                    <ArcReactorSphere dataRef={dataRef} />
                </Canvas>
            </div>
        </>
    );
};

export default BackgroundAnimation;
