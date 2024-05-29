import { useEffect, useState } from 'react'
import '../assets/css/LandingPage.css'
import CursorEffect from './CursorEffect'
import Cookies from 'js-cookie'
import { getDatabase , set , get ,ref } from 'firebase/database'
import socket from './myWorks/livestream/socket'
import { Helmet } from 'react-helmet-async'
const LandingPage = () => {
    const [pageview,setPageview] = useState<any>(0)
    const [ratingCount,setRatingCount] = useState<number>(0)
    const [ratingSet,setRatingCountSet] =useState<boolean>(false)
    const [rateReviewData , setRateReviewData] = useState<any>(
        {
            rate: 0 ,
            email: '' , 
            message: '', 
            
        }
    )
    const [successSubmit,setSuccessSubmit] = useState('')
    const [averageRating,setAverageRating] = useState(0)
    
    const db = getDatabase()
    const countRef = ref(db,'views/')
    const reviewRef = ref(db,'rate_review/')
   

    const StarRatingMouseEnter = (ratingCount:number) => {
        console.log(ratingCount)
        setRatingCountSet(false)
        setRatingCount(ratingCount)
    }
    const StarRatingMouseLeave = () => {
        if(ratingSet) return ; 
        setRatingCount(0)
    }
    const ReviewsInputHandler = (e: any) => {
        const {name , value} = e.target
        setRateReviewData((prev:any) => ({...prev  ,[name]: value }))
    }
    const SubmitReviews =   async () => {
        let isRated = Cookies.get('isRated')
        if(isRated) {
            console.log('already rated')
            setSuccessSubmit('Already Submitted')
            return ;
        }
        if(rateReviewData.email === '' , rateReviewData.rate === 0  || rateReviewData.message ==='') {
            return;
        }
        const rateReviewRef = ref(db , 'rate_review/' + rateReviewData.email.split('@')[0])
        try {
            await set(rateReviewRef , {
                rate: rateReviewData.rate,
                email: rateReviewData.email,
                message: rateReviewData.message
            })
            Cookies.set('isRated','true')
            setSuccessSubmit('Success Submit')
            setRateReviewData({email: '',message: '',rate: 0})
            setRatingCount(0)
        }catch(e) {
            console.log(e)
        }
    }
    get(countRef).then((snapshot:any) => {
        const data = snapshot.val();
        const pageViewCount = parseInt(data.pageviewcount) || 0;
        setPageview(pageViewCount + 1)
    });
   
    useEffect(() => {
       
        let isViewed = Cookies.get('viewed')
        if(!socket.connected) {
            socket.connect()
        }
        if(isViewed === undefined || !isViewed) {
            Cookies.set('viewed',"true")
            get(countRef).then((snapshot:any) => {
                const data = snapshot.val();
                const pageViewCount = parseInt(data.pageviewcount) || 0;
                set(ref(db, 'views/pageviewcount'), pageViewCount + 1);
                setPageview(pageViewCount + 1)
            });
        }
        get(reviewRef).then((snapshot:any) => {
            const data = snapshot.val()
            
            if (data) {
                const reviewValues = Object.values(data);
                const totalRating:any = reviewValues.reduce((acc: any, curr: any) => {
                    return acc + curr.rate;
                }, 0);
                const averageRate:any = (totalRating / reviewValues.length).toFixed(1)
                setAverageRating(averageRate);
            } else {
                setAverageRating(0)
            }
        })
        return () => {
            socket.disconnect()
        }
    },[successSubmit])
   

  return (
    <section className='landing_page'>
        <Helmet>
            <title>PORTFOLIO LANDING PAGE</title>
            <meta name="description" content="Looking for a  website developer? Hire me for full-stack development services to elevate your business online!" />
            <link rel="canonical" href="/" />
        </Helmet>
        {/* <CursorEffect /> */}
    <div className='hero_section'>
       
        <div className="text_banner">
            <div className="text_banner_wrap">
            <h1>HI !</h1>
            <h1>F1 WEB DEV HERE</h1>
            <h1>FULL STACK WEB DEVELOPER</h1>
            </div>
            <div className="txt_banner_button">
                <button className='hire_me_btn'>HIRE ME / CONTACT ME</button>
                {/* <button className='contact_me_btn'>CONTACT ME</button> */}
            </div>
            <div className="txt_banner_rate_views">
                    <button className='txt_page_views'>
                        <span>Views <i className="fa-regular fa-eye"></i></span>
                        <span>{pageview}</span>
                    </button>
                    <button className='txt_page_ratings'>
                        <span>Ratings <i className="fa-regular fa-star"></i></span>
                        <span>{averageRating === 0 ? 'No ratings yet': averageRating}</span>
                    </button>
            </div>
        </div>
        {/* <div classNamse="hero_img_banner"> */}
            {/* <h1>I'M KINGKONG</h1> */}
            {/* <div className="kingkong_img">
                <img src={HeroImg} alt="" />
            </div>
            <h1>HAVE A NICE DAY!</h1>
        </div> */}
    </div>
    <div className="skills_section">
        
        <h1 className='skills_text'>SKILLS</h1>        
        <div className="skill_wrapper">
        <div className='skill'>
            <i className="fa-brands fa-html5" style={{color:'red'}}></i>
            <h1>HTML</h1>
        </div>
        <div className="skill">
            <i className="fa-brands fa-css3-alt"></i>
            <h1>CSS</h1>
        </div>
        <div className="skill">
            <i className="fa-brands fa-js"  style={{color:'yellow'}}></i>
            <h1>JAVASCRIPT</h1>
        </div>
        <div className="skill">
            <i className="fa-brands fa-react"></i>
            <h1>REACT JS</h1>
        </div>
        <div className="skill">
        <i className="fa-brands fa-node"  style={{color:'green'}}></i>
            <h1>NODE JS</h1>
        </div>
        <div className="skill">
        <i className="fa-solid fa-code-compare"  style={{color:'aqua'}}></i>
            <h1>API</h1>
        </div>
        <div className="skill">
        <i className="fa-brands fa-python"  style={{color:'yellowgreen'}}></i>
            <h1>PYTHON</h1>
        </div>
        <div className="skill">
        <i className="fa-solid fa-d"  style={{color:'green'}}></i>
            <h1>DJANGO</h1>
        </div>
        </div>  
    </div>
    

    


    <form className="add_rating_review" onSubmit={(e) => {
        e.preventDefault()
        SubmitReviews()
    }}>
        <h1>Rate and Review</h1>
        {successSubmit ? 
        
        <div className="success_submit">
            <span>{successSubmit}.</span>
            <i className="fa-solid fa-xmark" onClick={() => setSuccessSubmit('')}></i>
        </div>
        : ''
        }
        <div className="rate_review_wrapper">
            <div className="add_rating_wrapper">
                {[1,2,3,4,5].map((val:number,index:any) => (
                    <i
                        onMouseEnter={() => StarRatingMouseEnter(val)}
                        onMouseLeave={StarRatingMouseLeave}
                        onClick={() => {
                            setRatingCount(val)
                            setRatingCountSet(true)
                            setRateReviewData((prev:any)=> ({...prev , rate:val}))
                        }}
                     style={{color:val <= ratingCount ? 'yellow':'white'}} className="fa-solid fa-star" key={index}></i>
                ))}
            </div>
            <div className="add_review_wrapper">
                <textarea
                onChange={(e => ReviewsInputHandler(e))}
                value={rateReviewData.message}
                className='add_review_textarea' name="message" id="" placeholder='Message ...' style={{width: '100%',height: '200px'}}></textarea>
            </div>
        </div>
            <div className="email_input_">
                <label htmlFor="">Email:</label>
                <input
                type="email" 
                name='email'
                value={rateReviewData.email}
                onChange={(e) => ReviewsInputHandler(e)}
                />
            </div>
        <div className="add_review_rating_action">
            <button onClick={SubmitReviews}>Submit</button>
        </div>
    </form>

    </section>
  )
}

export default LandingPage