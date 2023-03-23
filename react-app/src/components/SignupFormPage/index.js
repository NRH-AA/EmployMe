import React, { useEffect, useState } from "react";
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
  const [errors, setErrors] = useState({});
  const history = useHistory();

  
  useEffect(() => {
    setErrors(validateFormErrors())
  }, [firstName, lastName, companyName, email, username, password, confirmPassword, age])
  
  if (sessionUser) return <Redirect to="/" />;
  
  const validateFormErrors = () => {
    const newErrors = {};
    
    if (firstName && (firstName.length < 2 || firstName.length > 20)) newErrors.firstName = 'First name (2-20) characters';
    if (lastName && (lastName.length < 2 || lastName.length > 30)) newErrors.lastName = 'Last name (2-30) characters';
    if (companyName && (companyName.length < 2 || companyName.length > 40)) newErrors.companyName = 'Company name (2-40) characters';
    if (email && (email.length < 4 || email.length > 30)) newErrors.email = 'Email (4-30) characters';
    if (username && (username.length < 2 || username.length > 20)) newErrors.username = 'Username (2-20) characters';
    if (password && (password.length < 6 || password.length > 30)) newErrors.password = 'password (2-30) characters';
    if (age && (age < 16 || age > 110)) newErrors.age = 'Age (16-110)';
    if (confirmPassword && confirmPassword !== password) newErrors.confirmPassword = 'Password fields must match';
    console.log(newErrors);
    return newErrors;
  }
  
  
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
              !password || !confirmPassword || !age || errors.length > 0;
              
  const tabSubmitSignup = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (diableSignupButton) return;
      handleSubmit(e);
    } 
  }
  
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
                maxLength={20}
                onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              
              <label className="signup-label"> Last Name * <br></br>
              <input className="login-input" type="text" value={lastName} required
                placeholder="Last Name"
                maxLength={30}
                onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
						
            <div id="signup-name-div">
              <label className="signup-label"> Company Name <br></br>
              <input className="login-input" type="text" value={companyName}
                placeholder="Company Name"
                maxLength={40}
                onChange={(e) => setCompanyName(e.target.value)}
                />
              </label>
              
              <label className="signup-label"> Email * <br></br>
                <input className="login-input" type="text" value={email} required
                  placeholder="Email"
                  maxLength={30}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
						
            <div id="signup-name-div">
              <label className="signup-label"> Username * <br></br>
                <input className="login-input" type="text" value={username} required
                  placeholder="Username"
                  maxLength={20}
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
                  maxLength={30}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            
              <label className="signup-label"> Confirm Password * <br></br>
                <input className="login-input" type="password" value={confirmPassword} required
                  placeholder="Confirm Password"
                  maxLength={30}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => tabSubmitSignup(e)}
                />
              </label>
            </div>
						
						<button className="signup-button" type="submit"
              disabled={diableSignupButton()}
            >Sign Up</button>
            <button className="signup-button signup-back-button" type="button"
              onClick={() => history.push('/')}
            >Back</button>
					</div>
					
				</form>
			</div>
    </>
  );
}

export default SignupFormPage;
