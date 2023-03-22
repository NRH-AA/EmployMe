import { useModal } from "../../context/Modal";


const AchievementsModal = ({userId}) => {
    const { closeModal } = useModal();
    
    if (!userId) return null;
    
    return (
        <div>
            <h2>Achievements</h2>
            <button onClick={() => closeModal()}>Close</button>
        </div>
    );
};

export default AchievementsModal;
