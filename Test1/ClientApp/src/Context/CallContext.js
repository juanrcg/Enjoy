import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import AccountContext from './AccountContext';

const CallContext = createContext();

export const CallContextProvider = ({ children }) => {

    const { getSession } = useContext(AccountContext); // Get session context
    const [peer, setPeer] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    useEffect(() => {
        // Initialize PeerJS
        const initializePeer = async () => {
            try {
                const session = await getSession();
                const peerId = session.sub; // Use session.sub as the Peer ID
                const newPeer = new Peer(peerId);

                setPeer(newPeer);

                newPeer.on('call', (call) => {
                    window.open('/video', '_blank'); 
                    // Answer incoming call
                    call.answer(localStream);
                    call.on('stream', (stream) => {
                        setRemoteStream(stream);
                    });
                });

                newPeer.on('open', (id) => {
                    console.log('My peer ID is: ' + id);
                    // Use this ID for signaling
                });

            } catch (error) {
                console.error('Failed to get session or initialize PeerJS.', error);
            }
        };

        initializePeer();

        return () => {
            if (peer) {
                peer.destroy();
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);


    // Initialize local stream
    const initLocalStream = async () => {

        if (!localStream) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
            } catch (error) {
                console.error('Error accessing media devices.', error);
            }
        }
    };


    const startCall = async (senderName) => {

        window.open('/video', '_blank');

        console.log(senderName);

        if (!senderName) {
            console.error('Sender name is not defined');
            return;
        }

        await initLocalStream();

        if (peer && localStream) {
            // Start call to the specified sender
            const call = peer.call(senderName, localStream);
            call.on('stream', (stream) => {
                setRemoteStream(stream);
            });
        } else { console.log("error"); }
    };

    const endCall = () => {

        if (peer) {
            peer.destroy();
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
    }

    const contextValue = {

        startCall,
        initLocalStream,
        localStream,
        remoteStream,
        endCall

    };

    return (
        <CallContext.Provider value={contextValue}>
            {children}
        </CallContext.Provider>
    );

};
export const useCall = () => useContext(CallContext);

