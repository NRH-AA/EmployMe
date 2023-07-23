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
    
    const messageBoxClassName = user?.rooms ? 'messagebox-container' : 'hidden';
    
    
    useEffect(() => {
        if (user) dispatch(changeTheme(theme));
    }, [dispatch, theme, user]);
    
    return (
        <div id={messageBoxClassName} data-theme={theme}>
            
            <div id='messagebox-user-data'>
                <div id='messagebox-user-data-left'>
                    <img id='messagebox-user-image'
                        src={user.profile_picture} 
                        alt={user.first_name}
                    />
                    <p>Messaging</p>
                </div>
                
                <div id='messagebox-user-data-right'>
                    <button>B1</button>
                    <button>B2</button>
                    <button>B3</button>
                </div>
            </div>
            
            {false === true &&
                user?.rooms?.map((room, i) => 
                    <div className='messagebox-instance'>
                        
                    </div>
                )
            }
            
        </div>
    );
};

export default MessageBox;
