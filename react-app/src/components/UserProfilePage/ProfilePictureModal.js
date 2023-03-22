import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { updateProfilePicture } from "../../store/session";
import './UserProfile.css'

const ProfilePictureModal = ({user}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
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
        if (!picture) setPicture(default_image);
        
        const ret = await dispatch(updateProfilePicture(user.id, picture));
        if (ret.errors) {
            return setErrors(['Failed to set profile picture url.'])
        }
        return closeModal();
    }
    
    return (
        <div id="profile-picture-modal-container">
            <h2 style={{margin: "0"}}>Update Profile Picture</h2>
            
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
                <div id="upload-image-container">
                <input
                    id="upload-img-input"
                    type="file"
                    accept="image/*"
                    onChange={updateImage}
                />
                </div>
            </>}
            
            <div>
                <button onClick={() => closeModal()}>Close</button>
                <button onClick={(e) => handleSubmitPicture(e)}>Update</button>
            </div>
        </div>
    );  
};

export default ProfilePictureModal;
