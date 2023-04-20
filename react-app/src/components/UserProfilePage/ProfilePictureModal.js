import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { updateProfilePicture } from "../../store/session";
import './ProfilePictureModal.css'

const ProfilePictureModal = ({user}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const sessionTheme = useSelector(state => state.session.theme);
    const [picture, setPicture] = useState(user?.profile_picture);
    const [imageLoading, setImageLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    
    const default_image = 'https://www.computerhope.com/jargon/g/guest-user.png';
    
    
    if (!user) return null;
    
    const updateImage = (e) => {
        const file = e.target.files[0];
        handleImageUpload(file);
    }
    
    const handleImageUpload = async (file) => {
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
          setPicture(imageUrl)
          setImageLoading(false);
        };
    };
    
    const handleSubmitPicture = async (e) => {
        e.preventDefault();
        
        if (picture === user.profile_picture) return closeModal();
        if (!picture) return setPicture(default_image);
        
        const ret = await dispatch(updateProfilePicture(user.id, picture));
        if (ret.errors) {
            return setErrors(['Failed to set profile picture url.'])
        }
        return closeModal();
    }
    
    return (
        <div id="profile-picture-modal-container" data-theme={sessionTheme}>
            <h2 className='text-primary'>Update Profile Picture</h2>
            
            {errors && errors.map(err => <p key={err}>{err}</p>)}
            {picture && <><img
                id="profile-picture-modal-img"
                src={picture} 
                alt={user.first_name}
            />
            <button id="profile-picture-modal-remove"
                onClick={() => setPicture('')}
            >X</button></>}
            
            {!picture && <>
                <div>
                <input id="upload-image-container"
                    title='Click to upload a file'
                    type="file"
                    accept="image/*"
                    onChange={updateImage}
                />
                </div>
            </>}
                {imageLoading && <p id="picture-loading-message">Loading...</p>}
            
            <div id="user-picture-button-div">
                <button className="button-main update-profile-picture-button" 
                    onClick={() => closeModal()}
                >Close</button>
                <button className="button-main update-profile-picture-button" 
                    onClick={(e) => handleSubmitPicture(e)}
                >Update</button>
            </div>
        </div>
    );  
};

export default ProfilePictureModal;
