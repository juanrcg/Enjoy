import React, { useState, useRef, useEffect } from 'react';
import { useCall } from '../../Context/CallContext';

function VideoCall() {
    const { localStream, remoteStream, endCall, initLocalStream } = useCall();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        // Initialize local stream if it's not available
        if (!localStream) {
            initLocalStream();
        }
    }, [localStream, initLocalStream]);

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <>
            <div className="video-container">
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                />
                <video
                    ref={remoteVideoRef}
                    autoPlay
                />
            </div>
            <button onClick={endCall}>End Call</button>
        </>
    );
}

export default VideoCall;
