import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getNewsThunk } from "../../store/session";

const NewsComponant = () => {
    const dispatch = useDispatch();
    
    const sessionUser = useSelector(state => state.session.user);
    const sessionNews = useSelector(state => state.session.news);
    const [newsOffset, setNewsOffset] = useState(0);
    const [newsLimit, setNewsLimit] = useState([]);
    
    if (sessionNews && !newsLimit.length) {
        const newNews = sessionNews.slice(0, 10);
        setNewsLimit(newNews);
    }
    
    const updateNews = () => {
        if (sessionNews?.length) {
            const newNews = sessionNews.slice(newsOffset, newsOffset + 10);
            setNewsLimit(newNews);
        }
    }
    
    const showNewsAuthor = (news) => {
        if (!news.author) return null;
        let splitAuthor = news.author.split('(')[1];
        if (splitAuthor) {
            news.author = splitAuthor.split(')')[0];
        } 
        
        return (<>
            <p className="text-primary feed-news-text">- {news.author.toUpperCase()}</p>
            <p className='text-secondary feed-news-title'>{news.title.slice(0, 80)} ...</p>
        </>)
    }
    
    const showNewsArea = () => {
        return <div id="feed-news-div">
        <h3 style={{marginLeft: "10px", fontSize: "16px"}} className='text-primary'>EmployMe News</h3>
        {newsLimit?.map((news, i) => 
            <div key={i}>
                {showNewsAuthor(news)}
            </div>
        )}
    </div>
    }
    
    useEffect(() => {
        if (!sessionNews) dispatch(getNewsThunk());
    }, [sessionNews]);
    
    
    if (!sessionUser) return null;
    
    return (
        <div id="feed-news-container">
            {showNewsArea()}
                    
            {(!newsLimit?.length) ?
                <p style={{marginLeft: "10px"}}>
                    No news today.
                </p>
            :
                <button id="feed-news-button" className='button-main'
                    type='button'
                    title='See More News'
                    onClick={() => {setNewsOffset(newsOffset + 10); updateNews()}}
                >More News</button>
            }
        </div>
    );  
};

export default NewsComponant;
