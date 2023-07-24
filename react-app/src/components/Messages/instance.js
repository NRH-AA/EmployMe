import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './instance.css';

let socket;

const MessageInstance = ({ room }) => {
    const user = useSelector(state => state.session.user);
    
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    
    useEffect(() => {
        socket = io();

        socket.on("chat", (chat) => setMessages(messages => [...messages, chat]));
        
        return (() => socket.disconnect());
    }, []);
    
    const handleSubmit = () => {
        socket.emit("chat", { user: user.username, msg: chatInput });
        setChatInput("");
    };
    
    return (
        <div id='message-instance-container'>
            
            <div>
                {room?.messages?.map((message, i) => <p key={i}>{message.owner.first_name}: {message.text}</p>)}
            </div>
            
            {messages.map((message, ind) => (
                <div key={ind}>{`${message.user}: ${message.msg}`}</div>
            ))}
            
            <input type='text' 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
            />
            
            <button type='button' onClick={handleSubmit}>Send</button>
        </div>
    );
};

export default MessageInstance;
