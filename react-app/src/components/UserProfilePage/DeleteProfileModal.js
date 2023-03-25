import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteUserProfileThunk } from "../../store/session";

const DeleteProfileModal = ({user}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    
    const handleDelete = async () => {
        
        await dispatch(deleteUserProfileThunk(user.id));
        return closeModal();
    };
    
    return (
        <div id="delete-profile-container">
            <h2 style={{margin: "0px"}}>Are you sure you want to delete your profile?</h2>
           
            <div id="delete-profile-buttons-div"> 
                <button className="user-profile-button-small"
                    onClick={() => closeModal()}
                >No (Keep)</button>
                <button className="user-profile-button-small"
                    onClick={() => handleDelete()}
                >Yes (Delete)</button>
            </div>
        </div>
    );
};

export default DeleteProfileModal;
