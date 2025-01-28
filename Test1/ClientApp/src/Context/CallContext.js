import React, { createContext, useContext, useState, useEffect } from 'react';
import Peer from 'peerjs';
import AccountContext from './AccountContext';
import { useNavigate } from 'react-router-dom';

const CallContext = createContext();

export const CallContextProvider = ({ children }) => {
    const { getSession } = useContext(AccountContext);
    const [peer, setPeer] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [currentCall, setCurrentCall] = useState(null);
    const navigate = useNavigate();

    // Initialize the PeerJS instance and handle events
    useEffect(() => {
        const initializePeer = async () => {
            try {
                const session = await getSession();
                const peerId = session.sub;

                const newPeer = new Peer(peerId, {
                    debug: 2,
                    config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
                });

                setPeer(newPeer);

                newPeer.on('open', (id) => {
                    console.log('Peer connected with ID:', id);
                });

                newPeer.on('call', async (call) => {
                    console.log('Incoming call');
                    navigate('/video','_blank'); // Navigate to Video component
                    const stream = await initLocalStream(); // Initialize the local stream
                    call.answer(stream); // Answer the call with local stream
                    setCurrentCall(call);

                    call.on('stream', (remoteStream) => {
                        console.log('Receiving remote stream');
                        setRemoteStream(remoteStream);
                    });

                    call.on('close', () => {
                        console.log('Call ended');
                        cleanupStreams();
                    });
                });
            } catch (error) {
                console.error('Error initializing PeerJS:', error);
            }
        };

        initializePeer();

        return () => {
            if (peer) peer.destroy();
            cleanupStreams();
        };
    }, []);

    // Initialize local video/audio stream
    const initLocalStream = async () => {
        if (!localStream) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                return stream;
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        }
        return localStream;
    };

    // Start an outgoing call
    const startCall = async (receiverId) => {
        if (!receiverId) {
            console.error('Receiver ID is not defined');
            return;
        }

        console.log('Starting call with receiver ID:', receiverId);
        navigate('/video','_blank'); // Open the Video component

        try {
            const stream = await initLocalStream(); // Ensure local stream is initialized
            if (peer && peer.open) {
                const call = peer.call(receiverId, stream); // Call with local stream
                setCurrentCall(call);

                call.on('stream', (remoteStream) => {
                    console.log('Receiving remote stream');
                    setRemoteStream(remoteStream);
                });

                call.on('close', () => {
                    console.log('Call ended');
                    cleanupStreams();
                });
            } else {
                console.error('Peer is not open or initialized');
            }
        } catch (error) {
            console.error('Error starting call:', error);
        }
    };

    // End the current call and clean up streams
    const endCall = () => {
        if (currentCall) currentCall.close();
        cleanupStreams();
    };

    // Clean up local and remote streams
    const cleanupStreams = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
        }
        setRemoteStream(null);
        setCurrentCall(null);
    };

    const contextValue = {
        initLocalStream,
        startCall,
        endCall,
        localStream,
        remoteStream,
    };

    return <CallContext.Provider value={contextValue}>{children}</CallContext.Provider>;
};

export const useCall = () => useContext(CallContext);
