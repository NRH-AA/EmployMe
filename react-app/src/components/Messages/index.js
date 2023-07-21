import { useSelector } from 'react-redux';

import MessageInstance from './instance';

import './index.css';

const MessageBox = () => {
    const user = useSelector(state => state.session.user);
    
    return (
        <div id='messagebox-container'>
            
            {user?.rooms && 
                user.rooms.map((room, i) => <MessageInstance key={i} roomId={i}/>)
            }
            
        </div>
    );
};

export default MessageBox;
