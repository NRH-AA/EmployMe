import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import MessageInstance from './instance';

import { changeTheme } from "../../store/session";

import './index.css';

//user.rooms.map((room, i) => <MessageInstance key={i} roomId={i}/>)

const MessageBox = () => {
    const dispatch = useDispatch();
    
    const user = useSelector(state => state.session.user);
    const [theme, setTheme] = useState(user?.theme);
    const [showMessages, setShowMessages] = useState(false);
    
    const [bottomOffset, setBottomOffset] = useState(0);
    
    const messageBoxClassName = user?.rooms ? 'messagebox-container' : 'hidden';
    
    useEffect(() => {
        if (user) dispatch(changeTheme(theme));
    }, [dispatch, theme, user]);
    
    useEffect(() => {
        if (theme !== user?.theme) setTheme(user?.theme);
    }, [user, theme]);
    
    if (!user) return null;
    
    const handleClickMessageBox = (e) => {
        e.preventDefault();
        
        if (!showMessages) {
            setBottomOffset(user?.rooms?.length);
            setShowMessages(true);
        } else {
            setBottomOffset(0);
            setShowMessages(false);
        }
    };
    
    const getMessageParticipant = (room) => {
        for (let i = 0; i < room.messages.length; i++) {
            if (room.messages[i].owner.id !== user.id) return room.messages[i].owner;
        }
        
        return false;
    };
    
    return (
        <div id={messageBoxClassName} data-theme={theme}
            style={{
                position: 'sticky',
                left: '100%',
                bottom: `${bottomOffset}px`,
            }}
            onClick={(e) => handleClickMessageBox(e)}
        >
            
            <div id='messagebox-user-data-container'>
                
                <div id='messagebox-user-data'>
                    <div id='messagebox-user-data-left'>
                        <img id='messagebox-user-image'
                            src={user.profile_picture} 
                            alt={user.first_name}
                        />
                        <p>Messaging</p>
                    </div>
                    
                    <div id='messagebox-user-data-right'>
                        <button className='messagebox-user-data-button'
                        
                        ><i className="fa-solid fa-ellipsis messagebox-icon"/></button>
                        
                        <button className='messagebox-user-data-button'
                        
                        ><i className="fa-solid fa-plus messagebox-icon"/></button>
                        
                        
                        {!showMessages ?
                            <button className='messagebox-user-data-button'
                                onClick={(e) => handleClickMessageBox(e)}
                            ><i className="fa-solid fa-angle-up messagebox-icon"/></button>
                        :
                            <button className='messagebox-user-data-button'
                                onClick={(e) => handleClickMessageBox(e)}
                            ><i className="fa-solid fa-angle-down messagebox-icon"/></button>
                        }
                    </div>
                </div>
                
            </div>
            
            
            {showMessages &&
                user?.rooms?.map((room, i) => {
                        const roomParticipant = getMessageParticipant(room);
                        const roomLastMessage = room.messages[room.messages.length - 1];
                    
                        return <div key={i} className='messagebox-instance'>
                            <img className='messagebox-instance-img'
                                src={roomParticipant.profile_picture} 
                                alt={roomParticipant.first_name}
                            />
                            
                            <div className='messagebox-instance-text-div'>
                                <p className='messagebox-instance-name-p'>
                                    {`${roomParticipant.first_name} 
                                    ${roomParticipant.last_name}`}
                                </p>
                                
                                <p className='messagebox-instance-text-p'>
                                    {`${roomLastMessage.text}`}
                                </p>
                            </div>
                            {/* <MessageInstance roomId={i}/> */}
                        </div>
                    }
                )
            }
            
        </div>
    );
};

export default MessageBox;
