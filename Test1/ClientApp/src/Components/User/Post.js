import React, { useState } from "react";
import { useWebSocket } from '../../Context/WebSocketContext';

const Post = ({ data, userPhoto, userName }) => {
  const { socket } = useWebSocket();

  const {
    id = "",
    content = "",
    fontFamily = "Arial, sans-serif",
    fontStyle = {},
    fontColor = "#fff",
    selectedProduct = {},
    files = [],
    likes = [], // Likes as an array
    comments = [],
  } = data || {};

  const parsedFiles = Array.isArray(files) ? files : [];
  const imageFiles = parsedFiles.filter(
    (file) => file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg")
  );

  const [showProductDescription, setShowProductDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likesCount, setLikesCount] = useState(likes.length);
  const [likedByUser, setLikedByUser] = useState(likes.includes("admin")); // Assuming "admin" is the current user

  const handleLikeToggle = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const action = likedByUser ? "removelike" : "addlike";

      const body = {
        action,
        id: id,
        author: "admin", // Replace with the actual current user
      };

      socket.send(JSON.stringify(body));
      console.log(`Sent "${action}" action to WebSocket`, id);

      // Update local state for likes
      setLikedByUser(!likedByUser);
      setLikesCount((prevCount) => (likedByUser ? prevCount - 1 : prevCount + 1));
    }
  };

  const addComment = () => {
    if (newComment.trim()) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const body = {
          action: "addcomment",
          id: id,
          content: newComment,
          author: "admin"
        };
        socket.send(JSON.stringify(body));
        console.log('Sent "addComment" action to WebSocket', id, newComment);
        setNewComment("");
      }
    }
  };

  const contentStyle = {
    fontFamily,
    fontWeight: fontStyle.bold ? "bold" : "normal",
    fontStyle: fontStyle.italic ? "italic" : "normal",
    textDecoration: fontStyle.underline ? "underline" : "none",
    color: fontColor,
    fontSize: fontStyle.size || "16px",
    marginTop: "20px",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "20px",
        backgroundColor: "#1A1A1A",
        position: "relative",
      }}
    >
      {/* User Section */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <img
          src={userPhoto}
          alt={`${userName}'s photo`}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "5px",
          }}
        />
        <p
          style={{
            marginBottom: "0",
            fontWeight: "bold",
            color: "white",
            fontSize: "14px",
          }}
        >
          {userName}
        </p>
      </div>

      {/* Image Files Section */}
      {imageFiles.length > 0 && (
        <div
          style={{
            marginTop: "15px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "100%",
            borderRadius: "8px",
          }}
        >
          <img
            src={imageFiles[0]}
            alt="Post Image"
            style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
          />
        </div>
      )}

      {/* Content Section */}
      <div style={contentStyle}>{content}</div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "10px",
          backgroundColor: "#000000",
          padding: "10px 0",
          position: "sticky",
          bottom: "0",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={handleLikeToggle}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: likedByUser ? "#ffcc00" : "white",
              fontSize: "24px",
            }}
          >
            <i className="fas fa-martini-glass-citrus" />
            {likesCount > 0 && (
              <span style={{ marginLeft: "5px", color: "white" }}>{likesCount}</span>
            )}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontSize: "24px",
            }}
          >
            <i className="fas fa-comment-dots" />
          </button>
        </div>

        <button
          onClick={() => setShowProductDescription(!showProductDescription)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontSize: "24px",
          }}
        >
          {showProductDescription ? (
            <i className="fas fa-chevron-down" />
          ) : (
            <i className="fas fa-chevron-right" />
          )}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #ddd",
            paddingTop: "15px",
            maxHeight: "20px",
            overflowY: "auto",
          }}
        >
          {Array.isArray(comments) && comments.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {comments.map((comment, index) => (
                <li key={index} style={{ marginBottom: "10px", color: "white" }}>
                  {comment.author} : {comment.content}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "white" }}>No comments</p>
          )}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                outline: "none",
              }}
            />
            <button
              onClick={addComment}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Product Section */}
      {showProductDescription && selectedProduct && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#222",
            borderRadius: "8px",
            color: "white",
            textAlign: "right",
            marginTop: "10px",
            position: "absolute",
            bottom: "50px",
            right: "10px",
            zIndex: 10,
            minWidth: "200px",
          }}
        >
          <p style={{ marginBottom: "10px" }}>{selectedProduct.description}</p>
          <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
            Price: ${selectedProduct.price}
          </p>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;
