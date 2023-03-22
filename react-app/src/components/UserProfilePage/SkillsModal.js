import { useModal } from "../../context/Modal";


const SkillsModal = ({userId}) => {
    const { closeModal } = useModal();
    
    if (!userId) return null;
    
    return (
        <div>
            <h2>Skills</h2>
            <button onClick={() => closeModal()}>Close</button>
        </div>
    );  
};

export default SkillsModal;
