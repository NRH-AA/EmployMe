import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import { useHistory } from "react-router-dom";
import './SignupForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState(18);
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = {
      firstName,
      lastName,
      companyName,
      email,
      age,
      username,
      password,
      confirmPassword
    }
    
    const data = await dispatch(signUp(user));
    if (data.errors) {
      return setErrors(data.errors);
    }
    
    return history.push('/');
  };
  
  const diableSignupButton = () => !firstName ||
              !lastName || !email || !username||
              !password || !confirmPassword || !age;

  return (
    <>
      <div id="signup-container">
			<h1 id="signup-h1">EmployMe</h1>
        		<p id="signup-info">Welcome to <b>EmployMe</b>. A site developed to match
       			 employers and employees. <b>EmployMe</b> offers many tools to find the best candidates.</p>
				
				<form onSubmit={handleSubmit}>
					<ul className="signup-errors-ul">
						{Object.values(errors).map((error, idx) => (
							<li key={idx}>{error}</li>
						))}
					</ul>

					<div id="signup-form-input-div">
            
            <div id="signup-name-div">
              <label className="signup-label"> First Name * <br></br>
              <input className="login-input" type="text" value={firstName} required
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              
              <label className="signup-label"> Last Name * <br></br>
              <input className="login-input" type="text" value={lastName} required
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
						
            <div id="signup-name-div">
              <label className="signup-label"> Company Name <br></br>
              <input className="login-input" type="text" value={companyName}
                placeholder="Company Name"
                onChange={(e) => setCompanyName(e.target.value)}
                />
              </label>
              
              <label className="signup-label"> Email * <br></br>
                <input className="login-input" type="text" value={email} required
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
						
            <div id="signup-name-div">
              <label className="signup-label"> Username * <br></br>
                <input className="login-input" type="text" value={username} required
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              
              <label className="signup-label"> Age * <br></br>
              <input className="login-input" type="number" value={age} required
                onChange={(e) => setAge(e.target.value)}
                />
              </label>
            </div>
              
            <div id="signup-name-div">
              <label className="signup-label"> Password * <br></br>
                <input className="login-input" type="password" value={password} required
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            
              <label className="signup-label"> Confirm Password * <br></br>
                <input className="login-input" type="password" value={confirmPassword} required
                  placeholder="Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </div>
						
						<button className="signup-button" type="submit"
              disabled={diableSignupButton()}
            >Sign Up</button>
            <button className="signup-back-button" type="button"
              onClick={() => history.push('/')}
            >Back</button>
					</div>
					
				</form>
			</div>
    </>
  );
}

export default SignupFormPage;
