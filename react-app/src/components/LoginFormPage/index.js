import { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const sessionTheme = useSelector(state => state.session.theme);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory();

  if (sessionUser) return null;
  
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
  
  
  const tabSubmitLogin = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (buttonDisabled) return;
      handleSubmit(e);
    } 
  }
  
  const buttonDisabled = email.length < 1 || password.length < 1;

  return (
    <div>
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
                maxLength={30}
                onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            
            <span className="login-error-span">{errors?.password && errors.password}</span>
            <label className="login-label"> Password * <br></br>
              <input className="login-input" type="password" value={password} required
                placeholder="Password"
                maxLength={30}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => tabSubmitLogin(e)}
                />
            </label>
          
          <button className="login-button button-main" data-theme={sessionTheme}
            type="submit"
            disabled={buttonDisabled}
          >Log In</button>
          
          <button className="login-button button-main" data-theme={sessionTheme}
            type="button"
            onClick={(e) => handleDemoLogin(e)}
          >Demo</button>
          
          <button id="login-signup-button" className='link-main' data-theme={sessionTheme}
            type="button"
            onClick={() => history.push('/signup')}
          >Create an account</button>
          
          </div>
        </form>
        
      </div>
    </div>
  );
}

export default LoginFormPage;
