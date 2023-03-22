import { useModal } from "../../context/Modal";


const WorkHistoryModal = ({userId}) => {
    const { closeModal } = useModal();
    
    if (!userId) return null;
    
    return (
        <div>
            <h2>Work History</h2>
            <button onClick={() => closeModal()}>Close</button>
        </div>
    );  
};

export default WorkHistoryModal;
