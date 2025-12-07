import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;


const socket = io(CLIENT_URL);

const Chat = ({ taskId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.emit('joinTask', { taskId });

    socket.on('chatMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit('leaveTask', { taskId });
    };
  }, [taskId]);

  const handleSendMessage = () => {
    socket.emit('chatMessage', { taskId, message: newMessage });
    setNewMessage('');
  };

  return (

    <>

      <div className="chat-inner-section">
        <div className="chat-logo">
          <h3 style={{margin:"0px"}}>Chat</h3>
        </div>

        <div className="chat-body">
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>

        <div className="chat-footer">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>




    </>
  );
};

export default Chat;



