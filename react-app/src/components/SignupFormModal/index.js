import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			const data = await dispatch(signUp(username, email, password));
			if (data) {
				setErrors(data);
			} else {
				closeModal();
			}
		} else {
			setErrors([
				"Confirm Password field must be the same as the Password field",
			]);
		}
	};

	return (
		<>
			<div id="signup-container">
			<h1 id="signup-h1">EmployMe</h1>
        		<p id="signup-info">Welcome to <b>EmployMe</b>. A site developed to match
       			 employers and employees. <b>EmployMe</b> offers many tools to find the best candidates.</p>
				
				<form onSubmit={handleSubmit}>
					<ul>
						{errors.map((error, idx) => (
							<li key={idx}>{error}</li>
						))}
					</ul>
					
					<div id="signup-form-input-div">
						<label className="signup-label"> First Name * <br></br>
						<input type="text" value={password} required
							placeholder="First Name"
							onChange={(e) => setPassword(e.target.value)}
							/>
						</label>
						
						<label className="signup-label"> Last Name * <br></br>
						<input type="text" value={password} required
							placeholder="Last Name"
							onChange={(e) => setPassword(e.target.value)}
							/>
						</label>
						
						<label className="signup-label"> Company Name <br></br>
						<input type="text" value={password} required
							placeholder="Company Name"
							onChange={(e) => setPassword(e.target.value)}
							/>
						</label>
						
						<label className="signup-label"> Email <br></br>
							<input type="text" value={email} required
								onChange={(e) => setEmail(e.target.value)}
							/>
						</label>
						
						<label className="signup-label"> Username <br></br>
							<input type="text" value={username} required
								onChange={(e) => setUsername(e.target.value)}
							/>
						</label>
						
						<label className="signup-label"> Password <br></br>
							<input type="password" value={password} required
								onChange={(e) => setPassword(e.target.value)}
							/>
						</label>
						
						<label className="signup-label"> Confirm Password <br></br>
							<input type="password" value={confirmPassword} required
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</label>
						
						<label className="signup-label"> Age * <br></br>
						<input type="number" value={password} required
							placeholder="18"
							onChange={(e) => setPassword(e.target.value)}
							/>
						</label>
						
						<button type="submit">Sign Up</button>
					</div>
					
				</form>
			</div>
		</>
	);
}

export default SignupFormModal;
