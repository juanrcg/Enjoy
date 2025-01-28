import React, { useEffect, useContext } from 'react';
import Feed_Header from './feed_header';
import Footer from '../footer';
import Bar from './Bar';
import Post from './Post';
import defaultUserPhoto from '../Chat/default_image.png'; // Replace with path to a default icon
import { useWebSocket } from '../../Context/WebSocketContext';
import AccountContext from '../../Context/AccountContext';

function Feed() {
    const { socket, receivedPosts } = useWebSocket(); // Get receivedPosts from WebSocketContext
    const { getSession } = useContext(AccountContext);
    let owner = 'admin';

    useEffect(() => {
        // Send the "getposts" action only once when the component mounts and socket is open
        if (socket && socket.readyState === WebSocket.OPEN) {
            let body = {
                action: 'getposts',
            };
            socket.send(JSON.stringify(body));
            console.log('Sent "getposts" action to WebSocket');

            getSession()
                .then(session => {
                    owner = session.sub; // Establecer el sender después de obtener la sesión
                    body = {
                        action: 'getproducts',
                        owner: owner,
                    };
                    socket.send(JSON.stringify(body));
                    console.log(`Sent "getproducts" action to WebSocket ${owner}`)
                
                })
                .catch(err => {
                    console.log(err);
                });

           ;




        }
    }, [socket]); // Only re-run if `socket` changes

    return (
        <>
            <Feed_Header />
            <Bar />
            <div className="posts-container">
                {receivedPosts.length > 0 ? (
                    receivedPosts.map((post, index) => (
                        <Post
                            key={index}
                            data={{
                                id: post.id,
                                content: post.content,
                                fontFamily: post.fontFamily,
                                fontStyle: post.fontStyle,
                                fontColor: post.fontColor,
                                selectedProduct: JSON.parse(post.selectedProduct),
                                author: post.author,
                                files: post.files,
                                comments: post.comments,
                                likes: post.likes,
                            }}
                            userPhoto={defaultUserPhoto} // Replace with user-specific photo if available
                            userName={post.ownername} // Use the author's name
                        />
                    ))
                ) : (
                    <p>No posts available yet.</p>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Feed;
