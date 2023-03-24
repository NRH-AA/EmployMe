import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateImage } from "../../store/session";


const Post = ({post, user}) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [isUpdating, setIsUpdating] = useState(false);
    const [pictures, setPictures] = useState(post?.images || []);
    const [imageLoading, setImageLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    
    if (!user) return null;
    
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
          setImageLoading(false);
        };
    };
    
    const removePicture = (index) => {
        const newPictures = [...pictures];
        newPictures[index].url = '';
        setPictures(newPictures)
    }
    
    const handleSubmitEdit = async () => {
        for (const picture of pictures) {
            await dispatch(updateImage(picture.id, picture.url, sessionUser.id))
        }

        setIsUpdating(!isUpdating)
    }
    
    const showUpdateButton = () => {
        return (
            (user?.id === sessionUser?.id && !isUpdating) ?
                <button className="user-profile-button-small post-edit-button"
                    onClick={() => setIsUpdating(!isUpdating)}
                >Edit</button>
                :
                <button className="user-profile-button-small post-edit-button"
                    onClick={() => handleSubmitEdit()}
                >Submit</button>
        );
    };
    
    const showPostImages = () => {
        return (
            <div className="profile-post-img-container">
                {post?.images?.map((img, i) => {
                    return <div key={img.id || i}>
                        {pictures[i] && pictures[i].url ?
                            <img className="profile-post-img"
                                src={pictures[i].url} 
                                alt="PostImage"
                            />
                            :
                            <div id="upload-image-container">
                                <input
                                    className="upload-post-img-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => updateImageFile(e, i)}
                                />
                            </div>
                        }
                        
                        {isUpdating && img.url &&
                            <button className="post-remove-image-button"
                                onClick={() => removePicture(i)}
                            >X</button>
                        }
                    </div>
                })}
            </div>
        );
    };
    
    return (
        <div className="profile-post-div-container">
             
             <div className="post-title-bar-div">
                <h2 className="profile-post-h2">{post.post_title}</h2>
                
                {showUpdateButton()}
            </div>

            {showPostImages()}
            
            <div className="profile-post-text-container">
                <p>{post?.post_text}</p>
            </div>
        </div>
    );
};

export default Post;
