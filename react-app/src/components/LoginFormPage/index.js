import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      if (!data.id) {
        return setErrors(data);
      }
    }
    
    setEmail("");
    setPassword("");
    return history.push('/');
  };
  
  const handleDemoLogin = async (e) => {
    e.preventDefault();
    
    await dispatch(login('demo@aa.io', 'password'));
    setEmail("");
    setPassword("");
    return history.push('/');
  }
  
  if (sessionUser) return null;

  return (
    <>
      <div id="login-container">
        <h1 id="login-h1">EmployMe</h1>
        <p id="login-info">Welcome to <b>EmployMe</b>. A site developed to match
        employers and employees. <b>EmployMe</b> offers many tools to find the best candidates.</p>
        
        <form onSubmit={handleSubmit}>
          <div id="form-input-div">
            
            <span className="login-error-span">{errors?.email && errors.email}</span>
            <label className="login-label"> Email * <br></br>
              <input className="login-input" type="text" value={email} required
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            
            <span className="login-error-span">{errors?.password && errors.password}</span>
            <label className="login-label"> Password * <br></br>
              <input className="login-input" type="password" value={password} required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                />
            </label>
          
          <button className="login-button" type="submit"
            disabled={email.length < 1 || password.length < 1 ? true : false}
          >Log In</button>
          
          <button className="login-button" type="button"
            onClick={(e) => handleDemoLogin(e)}
          >Demo</button>
          
          <button id="login-signup-button" type="button"
            onClick={() => history.push('/signup')}
          >Create an account</button>
          
          </div>
        </form>
        
      </div>
    </>
  );
}

export default LoginFormPage;
