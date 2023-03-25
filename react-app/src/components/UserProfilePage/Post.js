import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateImages, updatePost } from "../../store/session";
import { deletePost } from "../../store/session";


const Post = ({post, user}) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [isUpdating, setIsUpdating] = useState(false);
    const newPictureObjects = [{...post.images[0]}, {...post.images[1]}, {...post.images[2]}];
    const [pictures, setPictures] = useState(newPictureObjects || []);
    const [imageLoading, setImageLoading] = useState(false);
    const [title, setTitle] = useState(post.post_title || '');
    const [text, setText] = useState(post.post_text || '');
    const [errors, setErrors] = useState([]);
    
    if (!user) return null;
    
    const default_image = 'https://www.computerhope.com/jargon/g/guest-user.png';
    
    const updateImageFile = (e, index) => {
        const file = e.target.files[0];
        handleImageUpload(file, index);
    }
    
    const handleImageUpload = async (file, index) => {
        const formData = new FormData();
        formData.append("image", file);
    
        setImageLoading(true);
        const res = await fetch('/api/users/upload', {
          method: "POST",
          body: formData,
        });
    
        if (res.ok) {
          const data = await res.json();
          const imageUrl = data.url
    
          if (!imageUrl) return setErrors(["Failed to upload image. Please try again."])
          
          const newPictures = [...pictures];
          newPictures[index].url = imageUrl;
          setPictures(newPictures);
          console.log(pictures)
          console.log(post.images)
          
          setImageLoading(false);
        };
    };
    
    const removePicture = (index) => {
        const newPictures = [...pictures];
        newPictures[index] = {id: newPictures[index].id, url: ''};
        setPictures(newPictures)
    }
    
    const handleSubmitEdit = async () => {
        const updateData = [];

        for (let i = 0; i < pictures.length; i++) {
            const picture = pictures[i]
            if (picture.url && picture.url !== post.images[i].url && picture.url !== '') {
                updateData.push({id: picture.id, url: picture.url})
            }
        }
            
        if (updateData.length > 0) {
            await dispatch(updateImages(sessionUser.id, updateData))
        } else {
            setPictures(post.images);
        }
        
        if (title === post.post_title && text === post.post_text) return setIsUpdating(!isUpdating);
        
        const postData = {}
        if (title !== post.post_title) postData.postTitle = title;
        if (text !== post.post_text) postData.postText = text;
        
        await dispatch(updatePost(post.id, sessionUser.id, postData));

        setIsUpdating(!isUpdating)
    }
    
    const handlePostDelete = async () => {
        dispatch(deletePost(post.id, sessionUser.id))
    }
    
    const showUpdateButton = () => {
        return (
            (user?.active && user?.id === sessionUser?.id && !isUpdating) ? <div>
            <button className="user-profile-button-small post-edit-button"
                onClick={() => setIsUpdating(!isUpdating)}
            >Edit</button>
            
            <button className="user-profile-button-small post-edit-button"
                onClick={() => handlePostDelete()}
            >Delete</button> </div>
            : user?.active &&
            <button className="user-profile-button-small post-edit-button"
                onClick={() => handleSubmitEdit()}
             >Submit</button>
        );
    };
    
    const showTitle = () => {
        return <div>
            {!isUpdating ?
            <h2 className="profile-post-h2">{post.post_title}</h2>
            :
            <input className="profile-post-title-input" 
                type="text" 
                placeholder="Title"
                maxLength={50}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
            />
            }
        </div>
    };
    
    const showText = () => {
        return (<>
            {!isUpdating ?
            <p>{post?.post_text}</p>
            :
            <textarea className="profile-post-text-input"
                type="text" 
                placeholder="What would you like to say?"
                maxLength={200}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            }
        </>);
    };
    
    const showPostImages = () => {
        return (
            <div className="profile-post-img-container">
            {post?.images?.map((img, i) => 
            <div key={img.id || i}>
                {(pictures[i] && pictures[i].url && pictures[i].url !== default_image) ?
                <img className="profile-post-img"
                    src={pictures[i].url} 
                    alt="PostImage"
                />
                : (isUpdating && pictures[i].url === default_image) &&
                <div id="upload-image-container">
                    <input
                        className="upload-post-img-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateImageFile(e, i)}
                    />
                </div>
                }
                        
                {(isUpdating && pictures[i].url && pictures[i].url !== default_image) &&
                    <button className="post-remove-image-button"
                        onClick={() => removePicture(i)}
                >X</button>
                }
                
            </div>)}
            </div>
        );
    };
    
    return (
        <div className="profile-post-div-container">
            
            <div className="post-title-bar-div">
                {showTitle()}
                {showUpdateButton()}
            </div>

            {showPostImages()}
            
            <div className="profile-post-text-container">
                {showText()}
            </div>
            
        </div>
    );
};

export default Post;
