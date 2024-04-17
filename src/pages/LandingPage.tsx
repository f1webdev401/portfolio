import '../assets/css/LandingPage.css'
import Kingkong from  '../assets/images/kingkong.png'
import CursorEffect from './CursorEffect'
const LandingPage = () => {
  return (
    <section className='landing_page'>
        <CursorEffect />
    <div className='hero_section'>
        <div className="text_banner">
            <h1>HI IM</h1>
            <h1>F1 WEB DEV</h1>
            <h1>STARTING TO DIVE INTO WEBSITE DEVELOPMENT</h1>
            <h1>NEED SOME WEBSITE ?</h1>
            <div className="txt_banner_button">
                <button className='hire_me_btn'>HIRE ME</button>
                <button className='contact_me_btn'>CONTACT ME</button>
            </div>
        </div>
        <div className="hero_img_banner">
            <h1>I'M KINGKONG</h1>
            <div className="kingkong_img">
                <img src={Kingkong} alt="" />
            </div>
            <h1>HAVE A NICE DAY!</h1>
        </div>
    </div>
    <div className="skills_section">
        
        <h1 className='skills_text'>SKILLS</h1>        
        <div className="skill_wrapper">
        <div className='skill'>
            <i className="fa-brands fa-html5"></i>
            <h1>HTML</h1>
        </div>
        <div className="skill">
            <i className="fa-brands fa-css3-alt"></i>
            <h1>CSS</h1>
        </div>
        <div className="skill">
            <i className="fa-brands fa-js"></i>
            <h1>JAVASCRIPT</h1>
        </div>
        <div className="skill">
            <i className="fa-brands fa-react"></i>
            <h1>REACT JS</h1>
        </div>
        <div className="skill">
        <i className="fa-brands fa-node"></i>
            <h1>NODE JS</h1>
        </div>
        <div className="skill">
        <i className="fa-solid fa-code-compare"></i>
            <h1>API</h1>
        </div>
        <div className="skill">
        <i className="fa-brands fa-python"></i>
            <h1>PYTHON</h1>
        </div>
        <div className="skill">
        <i className="fa-solid fa-d"></i>
            <h1>DJANGO</h1>
        </div>
        </div>  
    </div>
    
    </section>
  )
}

export default LandingPage