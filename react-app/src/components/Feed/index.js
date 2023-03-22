import { useSelector } from "react-redux";
import './Feed.css';

const Feed = () => {
    const sessionUser = useSelector((state) => state.session.user);
    
    if (!sessionUser) return null;
    
    return (
        <div id="feed-container">
            <div id="feed-content-container">
            
            <div id="feed-content-div">
                
                <h2>Feed</h2>
            </div>
            
            
            </div>
        </div>
    );
};

export default Feed;
