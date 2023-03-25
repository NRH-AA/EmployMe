import { useModal } from "../../context/Modal";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserSkills } from "../../store/session";

const SkillsModal = ({user}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [skills, setSkills] = useState(user?.skills);
    const [skill, setSkill] = useState('');
    const [error, setError] = useState('');
    
    
    if (!user) return null;
    
    const skillsArray = skills?.split(';');
    
    const handleAddSkill = (e) => {
        e.preventDefault();
        
        if (!skill) return;
        
        const skillArray = skill.split(';');
        if (skillArray[skillArray.length - 1] === '') skillArray.pop();
        
        if (skillsArray && skillsArray.length >= 10) return setError('You cannot exceed 10 skills.');
        if (skillsArray && (skillsArray.length + skillArray.length) > 10) return setError('You cannot exceed 10 skills.');
        
        for (let skillVal of skillArray) {
            if (skillVal.length > 20) return setError('Skill length cannot exceed 20 characters.');
        }
        
        if (!skillsArray) {
            setSkills(skillArray.join(';'));
            return setSkill('');
        }
        
        for (let skillVal of skillArray) {
            skillsArray.push(skillVal)
        }

        setSkills(skillsArray.join(';'));
        return setSkill('');
    };
    
    const handleRemoveSkill = (e, index) => {
        e.preventDefault();
        
        if (!skillsArray) return;
        skillsArray.splice(index, 1);
        if (skillsArray.length === 0) return setSkills(null);
        return setSkills(skillsArray.join(';'));
    }
    
    const handleSubmitSkills = () => {
        if (skills === user.skills) return;
        if (skills === ' ') setSkills('');
        
        dispatch(updateUserSkills(user.id, skills));
        return closeModal()
    }
    
    if (skillsArray && skillsArray[0] === '') skillsArray.pop();
    
    return (
        <div id="user-skills-container">
            <h2 style={{margin: "0px", padding: "10px", color: "white"}}>Update Your Skills</h2>
            <div id="user-skills-show">
                <span id="user-skills-button-span">
                    {skillsArray?.map((skill, i) => (
                    <button key={i} className="user-profile-button-small user-skills-button-small"
                        onClick={(e) => handleRemoveSkill(e, i)}
                    >
                        {skill}
                    </button>))}
                </span>
            </div>
            
            <p style={{color: "white"}}>Add multiple skills by seperating them with a semi-colon
            <br></br>Remove a skill by pressing its button above.</p>
            {error && <p style={{color: "red"}}>{error}</p>}
            
            <div>
                <input type="text" placeholder="Type a Skill"
                    id="user-skill-input"
                    value={skill}
                    autoFocus
                    onChange={(e) => setSkill(e.target.value)}
                />
            </div>
            
            <div>
                <button className="user-profile-button-small user-skills-button-medium"
                    onClick={(e) => handleAddSkill(e)}
                >Add</button>
            </div>
            
            <div id="user-skills-confirm-buttons">
                <button className="user-profile-button-small user-skills-button-large"
                    onClick={() => closeModal()}
                >Close</button>
                <button className="user-profile-button-small user-skills-button-large"
                    onClick={() => handleSubmitSkills()}
                >Confirm</button>
            </div>
            
        </div>
    );  
};

export default SkillsModal;
