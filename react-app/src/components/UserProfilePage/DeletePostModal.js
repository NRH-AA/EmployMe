import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deletePost } from "../../store/session";

const DeletePostModal = ({user, post}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    
    const handleDelete = async () => {
        await dispatch(deletePost(post.id, user.id));
        return closeModal();
    };
    
    return (
        <div id="delete-profile-container">
            <h2 style={{margin: "0px"}}>Are you sure you want to delete this post?</h2>
           
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

export default DeletePostModal;
