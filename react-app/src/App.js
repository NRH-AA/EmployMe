import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch} from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import Feed from "./components/Feed";
import UserProfile from "./components/UserProfilePage";
import JobListing from "./components/JobListings";
import InfoModal from "./components/Feed/InfoModal";
import './index.css';


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);
  
  
  

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path='/job/:jobId'>
            <JobListing />
          </Route>
          
          <Route path='/profile/:userId'>
            <UserProfile />
          </Route>
          
          <Route path='/about'>
            <InfoModal />
          </Route>
          
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          
          <Route exact path="/" >
            <LoginFormPage />
            <Feed />
          </Route>
          
          <Route path="/">
            <Redirect to="/" />
          </Route>
          
        </Switch>
      )}
    </>
  );
}

export default App;
