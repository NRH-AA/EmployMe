import { useModal } from "../../context/Modal";


const EducationModal = ({userId}) => {
    const { closeModal } = useModal();
    
    if (!userId) return null;
    
    return (
        <div>
            <h2>Education</h2>
            <button onClick={() => closeModal()}>Close</button>
        </div>
    );  
};

export default EducationModal;
