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
    
    const handleUpArrowClick = () => {
        setBottomOffset(user?.rooms?.length * 40);
        setShowMessages(true);
    };
    
    const handleDownArrowClick = () => {
        setBottomOffset(0);
        setShowMessages(false);
    };
    
    return (
        <div id={messageBoxClassName} data-theme={theme}
            style={{
                position: 'sticky',
                left: '100%',
                bottom: `${bottomOffset}px`,
            }}
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
                                onClick={() => handleUpArrowClick()}
                            ><i className="fa-solid fa-angle-up messagebox-icon"/></button>
                        :
                            <button className='messagebox-user-data-button'
                                onClick={() => handleDownArrowClick()}
                            ><i className="fa-solid fa-angle-down messagebox-icon"/></button>
                        }
                    </div>
                </div>
                
                
                
            </div>
            
            
            {showMessages &&
                user?.rooms?.map((room, i) => 
                    <div key={i} className='messagebox-instance'>
                        <MessageInstance roomId={i}/>
                    </div>
                )
            }
            
        </div>
    );
};

export default MessageBox;
