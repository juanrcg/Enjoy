import React, { useState, useRef, useEffect } from 'react';
import { useCall } from '../../Context/CallContext';

function VideoCall() {
    const { localStream, remoteStream, endCall } = useCall();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    // Initialize local stream if not available
    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Attach remote stream to the video element
    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // Handle video play on user interaction (click to start)
    const handlePlayVideo = () => {
        if (localVideoRef.current) {
            localVideoRef.current.play().then(() => {
                setIsVideoPlaying(true);
            }).catch((error) => {
                console.error('Error starting video:', error);
            });
        }
    };

    return (
        <div>
            <div className="video-container" style={{ display: 'flex', gap: '10px' }}>
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    style={{ width: '45%', border: '1px solid black' }}
                    onClick={handlePlayVideo}  // Start video playback on user click
                />
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    style={{ width: '45%', border: '1px solid black' }}
                />
            </div>

            <button onClick={endCall} style={{ marginTop: '10px' }}>End Call</button>
        </div>
    );
}

export default VideoCall;
