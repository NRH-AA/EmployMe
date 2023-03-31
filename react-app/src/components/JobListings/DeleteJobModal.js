import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deleteJobListing } from "../../store/session";
import { useHistory } from "react-router-dom";

const DeleteJobModal = ({jobId}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);
    const { closeModal } = useModal();
    
    const handleDelete = () => {
        dispatch(deleteJobListing(jobId, sessionUser.id));
        closeModal();
        return history.push(`/profile/${sessionUser.id}`);
    }
    
    return (
        <div id="delete-profile-container">
            <h2 style={{margin: "0px"}}>Are you sure you want to delete this job listing?</h2>
           
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

export default DeleteJobModal;
