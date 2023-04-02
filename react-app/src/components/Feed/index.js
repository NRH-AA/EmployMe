import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import { getAllUsersThunk, setWindowPath, getSearchResults } from "../../store/session";
import InfoModal from "./InfoModal";
import './Feed.css';

const Feed = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const sessionUsers = useSelector((state) => state.session.users);
    const sessionSearchedUsers = useSelector((state) => state.session.searchResults);
    const sessionPath = useSelector(state => state.session.path);
    const [feedType, setFeedType] = useState(null);
    //const [offset, setOffset] = useState(0);
    
    useEffect(() => {
        if (!sessionPath || (sessionPath !== '/' && sessionPath !== '')) dispatch(setWindowPath(window.location.pathname));
    }, [dispatch, sessionPath])
    
    
    const getSearchJobs = async () => {
        const searchData = {
            type: 'Jobs',
            text: '',
            offset: 0
        }
        
        await dispatch(getSearchResults(searchData))
    }
    
    useEffect(() => {
        if (!sessionSearchedUsers) getSearchJobs();
    }, [dispatch, sessionSearchedUsers])
    
    if (!sessionUser) return null;
    
    let activeProfiles
    if (sessionSearchedUsers && (sessionSearchedUsers?.users?.length > 0 || sessionSearchedUsers?.jobs?.length > 0 || sessionSearchedUsers?.companies?.length > 0)) {
        if (sessionSearchedUsers?.users?.length) {
            activeProfiles = sessionSearchedUsers?.users?.filter(user => user.active && user.id !== sessionUser?.id);
            if (feedType !== 'user') setFeedType('user');
        } else if (sessionSearchedUsers?.companies?.length) {
            activeProfiles = sessionSearchedUsers?.companies?.filter(company => company.active && company.user.id !== sessionUser?.id);
            if (feedType !== 'company') setFeedType('company');
        } else if (sessionSearchedUsers?.jobs?.length) {
            activeProfiles = sessionSearchedUsers?.jobs?.filter(job => job.active && job.user.id !== sessionUser?.id);
            if (feedType !== 'job') setFeedType('job');
        }
    } else {
        if (!activeProfiles) {
            activeProfiles = sessionUsers?.length > 0 && sessionUsers?.filter(user => user.active);
            if (feedType !== 'user') setFeedType('user');
        }
    }
    
    const handleSearchExtend = () => {
        
    }
    
    
    const showSearchedUsers = (data) => {
        return (
            <NavLink className="user-feed-info-div" to={`/profile/${data?.id}`}>
            <img className="feed-profile-picture" src={data?.profile_picture} alt={data?.first_name}/>
                
  
                <div className="user-feed-info-data-div">
                    <div className="user-feed-info-data-div-inner">
                        <p className="feed-info-p">Name: <span>{data?.first_name} {data?.middle_name} {data?.last_name}</span></p>
                        <p className="feed-info-p">Email: <span>{data?.work_email}</span></p>
                        <p className="feed-info-p">Occupation: <span>{data?.occupation}</span></p>
                        <p className="feed-info-p">Rec: <span>0</span></p>
                    </div>
                
                </div>
            </NavLink>
        );
    };
    
    const showSeachedJobs = (data) => {
        return (
            <NavLink className="user-feed-info-div" to={`/job/${data?.id}`}>
            <img className="feed-profile-picture" src={data?.user?.profile_picture} alt={data?.user?.first_name}/>
                            
            <div className="user-feed-info-data-div">
                <div className="user-feed-info-data-div-inner">
                    <p className="feed-info-p">Occupation: <span>{data?.occupation}</span></p>
                    <p className="feed-info-p">Wage: <span>{`$${data?.wage?.min} - $${data?.wage?.max}`}</span></p>
                    <p className="feed-info-p">Openings: <span>{data?.openings + " / " + data?.filled}</span></p>
                    <p className="feed-info-p">Company: <span>{data?.user?.company_name}</span></p>
                    <p className="feed-info-p">Email: <span>{data?.user?.work_email}</span></p>
                </div>
             </div>
            </NavLink>
        );
    };
    
    return (
        <div id="feed-container">
            <div id="feed-content-container">
            
            <div id="feed-content-div">
                {(activeProfiles && !activeProfiles.length) &&
                    <h2>No users or jobs found in search.</h2>
                }
                {activeProfiles && activeProfiles.map(data => 
                <div key={data.id}>
                    {(feedType === 'user') ? 
                    <>
                    {showSearchedUsers(data)}
                    </>
                    : (feedType === 'job') ?
                    <>
                    {showSeachedJobs(data)}
                    </>
                    :
                    <>
                    </>
                    }
                </div>
                )}
            </div>
            </div>
            
            {/* <button
                onClick={() => handleSearchExtend()}
            >Show More</button> */}
            
            <div id="feed-footer-div">
                <OpenModalButton
                    className="info-modal-button"
                    buttonText={<i className="fa fa-info-circle"></i>}
                    modalComponent={<InfoModal />}
                />
                
                <NavLink className="footer-p" 
                    to={{pathname: "https://github.com/NRH-AA"}}
                    target="_blank"
                ><i className="fa-brands fa-github"></i></NavLink>
                
                <NavLink className="footer-p" 
                    to={{pathname: "https://www.linkedin.com/in/nathan-heinz-5b3718231/"}}
                    target="_blank"
                ><i className="fa-brands fa-linkedin"></i></NavLink>
            </div>
            
        </div>
    );
};

export default Feed;
