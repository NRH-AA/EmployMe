import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { createPost } from "../../store/session";

const CreatePostModal = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const { closeModal } = useModal();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [picture1, setPicture1] = useState('');
    const [picture2, setPicture2] = useState('');
    const [picture3, setPicture3] = useState('');
    const [errors, setErrors] = useState([]);
    
    
    const updateImageFile1 = (e) => {
        const file = e.target.files[0];
        handleImageUpload(file, 1);
    }
    const updateImageFile2 = (e) => {
        const file = e.target.files[0];
        handleImageUpload(file, 2);
    }
    const updateImageFile3 = (e) => {
        const file = e.target.files[0];
        handleImageUpload(file, 3);
    }
    
    const handleFetch = async (formData) => {
        const res = await fetch('/api/users/upload', {
            method: "POST",
            body: formData,
        });
        
        if (res.ok) {
            const data = await res.json();
            const imageUrl = data.url;
    
            if (!imageUrl) return setErrors(["Failed to upload image. Please try again."]);
            return imageUrl;
        }
        return false;
    }
    
    const handleImageUpload = async (file, index) => {
        const formData = new FormData();
        formData.append("image", file);
    
        const url = await handleFetch(formData)
        if (!url) return setErrors(['Failed to get image url']);
        
        if (index === 1) return setPicture1(url);
        if (index === 2) return setPicture2(url);
        if (index === 3) return setPicture3(url);
    };
    
    const removePicture = (index) => {
        if (!index || index < 1 || index > 3) return;
        if (index === 1) return setPicture1('');
        if (index === 2) return setPicture2('');
        if (index === 3) return setPicture3('');
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !text) return setErrors(['Title and text are required.']);
        
        const urls = [];
        
        if (picture1) {
            urls.push(picture1);
        };
        
        if (picture2) {
            urls.push(picture2);
        };
        
        if (picture3) {
            urls.push(picture3);
        };
        
        const postData = {
            userId: sessionUser.id,
            title,
            text,
            urls
        }
        
        await dispatch(createPost(postData));
        return closeModal();
    }
    
    const showPicutes = () => {
        return (
            <div id="create-post-image-div"> 
                {picture1 ? <>
                    <img className="create-post-image"
                        src={picture1} 
                        alt="PostImage1"
                    />
                    
                    <button className="create-post-remove-image-button"
                        onClick={() => removePicture(1)}
                     >X</button>
                </>
                :
                    <input
                        className="create-post-image-input"
                        type="file"
                        accept="image/*"
                        onChange={updateImageFile1}
                    />
                }
                
                {picture2 ? <>
                    <img className="create-post-image"
                        src={picture2} 
                        alt="PostImage1"
                    />
                    
                    <button className="create-post-remove-image-button remove-button2"
                        onClick={() => removePicture(2)}
                     >X</button>
                </>
                :
                    <input
                        className="create-post-image-input"
                        type="file"
                        accept="image/*"
                        onChange={updateImageFile2}
                    />
                }
                
                {picture3 ? <>
                    <img className="create-post-image"
                        src={picture3} 
                        alt="PostImage1"
                    />
                    
                    <button className="create-post-remove-image-button remove-button3"
                        onClick={() => removePicture(3)}
                     >X</button>
                </>
                :
                    <input
                        className="create-post-image-input"
                        type="file"
                        accept="image/*"
                        onChange={updateImageFile3}
                    />
                }
                
            </div>
        );
    };
    
    const buttonDisabled = () => !text || !title;
    
    return (
        <div id="create-post-modal-container">
            <h2>Create a new post</h2>
            
            {errors && errors.map((error, i) => 
                <p key={i} className="create-post-errors">{error}</p>
            )}
            
            <form onSubmit={handleSubmit}>
                
                <div id="create-post-container">
                    
                    <input className="login-input create-post-title" type="text"
                        maxLength={40}
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                    
                    <p>Upload up to 3 images for your post</p>
                    
                    {showPicutes()}

                    <textarea className="create-post-textarea" type="text"
                        maxLength={250}
                        placeholder="What would you like to say?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                    />
                    
                </div>
                
                <div id="create-post-buttons-div">
                    <button className="create-post-button"
                        onClick={closeModal}
                    >Cancel</button>
                    <button className="create-post-button"
                        onClick={handleSubmit}
                        disabled={buttonDisabled()}
                    >Submit</button>
                </div> 
                
            </form>
            
            
        </div>
    );
};

export default CreatePostModal;
