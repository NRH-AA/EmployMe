
const Post = ({post}) => {
    
    return (
        <div key={post.id} 
            className="profile-post-div-container"
        >
                                    
            <h2 className="profile-post-h2">{post.post_title}</h2>
            <div className="profile-post-img-container">
            {post.images?.map((img) => <img
                className="profile-post-img"
                key={img.id} src={img.url} 
                alt="PostImage"/>
            )}
            </div>
            
            <div className="profile-post-text-container">
                <p>{post.post_text}</p>
            </div>
        </div>
    );
};

export default Post;
