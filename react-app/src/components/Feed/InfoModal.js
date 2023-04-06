import { useModal } from "../../context/Modal";
import { NavLink } from "react-router-dom";
import './InfoModal.css';

const InfoModal = () => {
    const { closeModal } = useModal();
    
    return (
       <div id="info-modal-container">
            <h2 id="info-modal-h2">EmployMe Information</h2>
            <p>EmployMe was designed to help job seekers and company owners 
                find the best possible matches.</p>
            <p>Users may create a personal profile and a company profile.</p>
            <p>The search bar can be used to find the best possible candidates.</p>
            <p>Additional features will be implimented over time. Check the
                github wiki feature list for more information.
            </p>
            <NavLink id="info-modal-navlink" 
                to={{pathname: "https://github.com/NRH-AA/EmployMe/wiki/Feature-List"}}
                target="_blank"
            >Go to GitHub Wiki</NavLink>
            <button className="info-modal-button-close"
                onClick={closeModal}
            >Close</button>
       </div>
    );
};

export default InfoModal;
