import { useModal } from "../../context/Modal";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserSkills } from "../../store/session";

const SkillsModal = ({user}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [skills, setSkills] = useState(user?.skills);
    const [skill, setSkill] = useState('');
    
    
    if (!user) return null;
    
    const skillsArray = skills?.split(';');
    
    
    const handleAddSkill = (e) => {
        e.preventDefault();
        
        if (!skill) return;
        if (skill.length > 30) return;
        if (skillsArray && skillsArray.length > 10) return;
        
        if (!skillsArray) {
            setSkills(skill);
            return setSkill('');
        }
        
        if (skillsArray) {
            skillsArray.push(skill);
            if (skillsArray.length === 1) return setSkills(skill);
            setSkills(skillsArray.join(';'));
        }
        
        return setSkill('');
    };
    
    const handleRemoveSkill = (e) => {
        e.preventDefault();
        
        if (!skill) return;
        if (skill.length > 30) return;
        if (!skillsArray) return;
        const indexSkill = skillsArray.indexOf(skill);
        if (indexSkill === -1) return;
        
        setSkill('');
        
        skillsArray.splice(indexSkill, 1);
        if (skillsArray.length === 0) return setSkills(null);
        return setSkills(skillsArray.join(';'));
    }
    
    const handleSubmitSkills = () => {
        dispatch(updateUserSkills(user.id, skills));
        return closeModal()
    }
    
    return (
        <div id="user-skills-container">
            <h2 style={{margin: "0px", padding: "10px", color: "white"}}>Update Your Skills</h2>
            <div id="user-skills-show">
                <span>
                    {skills ? skills : ""}
                </span>
            </div>
            
            <div>
                <input type="text" placeholder="Type a skill"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                />
            </div>
            
            <div>
                <button onClick={(e) => handleRemoveSkill(e)}>Remove</button>
                <button onClick={(e) => handleAddSkill(e)}>Add</button>
            </div>
            
            <div>
                <button onClick={() => closeModal()}>Close</button>
                <button onClick={() => handleSubmitSkills()}>Confirm</button>
            </div>
            
        </div>
    );  
};

export default SkillsModal;
