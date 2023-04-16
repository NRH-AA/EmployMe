import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../../store/session";
import './DeletePost.css';

const DeletePostModal = ({user, post}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const sessionTheme = useSelector(state => state.session.theme);
    
    const handleDelete = async () => {
        await dispatch(deletePost(post.id, user.id));
        return closeModal();
    };
    
    return (
        <div id="delete-post-container" data-theme={sessionTheme}>
            <h2 className='text-primary delete-post-h2'>Are you sure you want to delete this post?</h2>
           
            <div id="delete-profile-buttons-div"> 
                <button className="button-main delete-post-button"
                    onClick={() => closeModal()}
                >No (Keep)</button>
                <button className="button-main delete-post-button"
                    onClick={() => handleDelete()}
                >Yes (Delete)</button>
            </div>
        </div>
    );
};

export default DeletePostModal;
