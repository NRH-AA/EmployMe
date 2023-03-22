import { useModal } from "../../context/Modal";


const RecommendationsModal = ({userId}) => {
    const { closeModal } = useModal();
    
    if (!userId) return null;
    
    return (
        <div>
            <h2>Recommendations</h2>
            <button onClick={() => closeModal()}>Close</button>
        </div>
    );  
};

export default RecommendationsModal;
