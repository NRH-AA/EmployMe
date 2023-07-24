import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useModal } from "../../context/Modal";

import { changeTheme } from "../../store/session";

import './instance.css';

let socket;

const MessageInstance = ({ room }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const user = useSelector(state => state.session.user);
    
    const [theme, setTheme] = useState(user?.theme);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    
    useEffect(() => {
        if (user) dispatch(changeTheme(theme));
    }, [dispatch, theme, user]);
    
    useEffect(() => {
        if (theme !== user?.theme) setTheme(user?.theme);
    }, [user, theme]);
    
    
    useEffect(() => {
        socket = io();

        socket.on("chat", (chat) => setMessages(messages => [...messages, chat]));
        
        return (() => socket.disconnect());
    }, []);
    
    const handleSubmit = () => {
        socket.emit("chat", { user: user.username, msg: chatInput });
        setChatInput("");
    };
    
    if (!user) return null;
    
    return (
        <div id='message-instance-container' data-theme={theme}>
            
            <div id='message-instance-previous-messages-div'>
                {room?.messages?.map((message, i) => <p key={i}>{message.owner.first_name}: {message.text}</p>)}
                {messages.map((message, ind) => (
                    <p key={ind}>{`${message.user}: ${message.msg}`}</p>
                ))}
            </div>
            
            <div id='message-instance-input-div'>
                <textarea id='message-instance-input'
                    type='text'
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)}
                />
                
                <button type='button' onClick={handleSubmit}>Send</button>
            </div>
        </div>
    );
};

export default MessageInstance;
