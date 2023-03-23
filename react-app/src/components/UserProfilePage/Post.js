import { useSelector } from "react-redux";

const Post = ({post, user}) => {
    const sessionUser = useSelector((state) => state.session.user);
    
    if (!user) return null;
    
    return (
        <div className="profile-post-div-container">
             
             <div className="post-title-bar-div">
                <h2 className="profile-post-h2">{post.post_title}</h2>
                
                {user?.id === sessionUser?.id &&
                    <button className="user-profile-button-small post-edit-button">Edit</button>
                }
            </div>

            <div className="profile-post-img-container">
                {post?.images?.map((img, i) => {
                    if (i < 3) return <img
                    className="profile-post-img"
                    key={img.id} src={img.url} 
                    alt="PostImage"/>
                    return ""
                }
                )}
            </div>
            
            <div className="profile-post-text-container">
                <p>{post?.post_text}</p>
            </div>
        </div>
    );
};

export default Post;
