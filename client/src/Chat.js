import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = () => {
    if (currentMessage.trim() !== "") { // Ensure message is not empty or just whitespace
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Format time as HH:mm
      };

      socket.emit("send_message", messageData); // Emit the message data to the server
      setMessageList([...messageList, messageData]); // Add message to local message list
      setCurrentMessage(""); // Clear current message input
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]); // Update message list when a new message is received
    });

    return () => {
      socket.off("receive_message"); // Clean up event listener on component unmount
    };
  }, [socket, messageList]); // Listen for changes in socket and messageList

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className={`message ${username === messageContent.author ? "you" : "other"}`}
            >
              <div className="message-content">
                <p>{messageContent.message}</p>
              </div>
              <div className="message-meta">
                <p id="time">{messageContent.time}</p>
                <p id="author">{messageContent.author}</p>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
