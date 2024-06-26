import { Link, NavLink } from "react-router-dom"
import '../assets/css/Navbar.css'
import Logo from '../assets/images/icon_1.png'
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import SignUpContext from "./signUpContext";
interface User {
    uid: string;
    email: string | null ;
    displayName: string | null;
    photoURL?: any | null;
}
interface NavbarProps {
    user: User | null;
}
const Navbar: React.FC<NavbarProps>  = ({user}) => {
    const navigate = useNavigate()
    const {setSignUpMessage} = useContext(SignUpContext)
    const [isNavMenuOpen,setIsNavMenuOpen] = useState<any>("")
    const logout = async () => {
        await signOut(auth)
        setIsNavMenuOpen(false)
        setSignUpMessage("You are now Logout")
        navigate('/sign_in')
    }
    
  return (
    <header className="navbar">
        <NavLink to={""} className='nav_banner'>
            <div className="f1_logo_img">
                <img src={Logo} alt="" />
            </div>
           <span> F1 WEB DEV</span>
        </NavLink>
        <ul>
            <NavLink to={''}
            style={({isActive}) => {
                return {
                    backgroundColor: isActive ? '#5562E9' : '',
                    color: isActive ? '#fff' : ''
                }
            }}
            end
            >
                 HOME
            </NavLink>
            <NavLink  style={({isActive}) => {
                return {
                    backgroundColor: isActive ? '#5562E9' : '',
                    color: isActive ? '#fff' : ''
                }
            }}
            end to={'myworkf1'}>
                MY WORK
            </NavLink>
            <NavLink  style={({isActive}) => {
                return {
                    backgroundColor: isActive ? '#5562E9' : '',
                    color: isActive ? '#fff' : ''
                }
            }}
            end to={'contacts'}>
                CONTACTS
            </NavLink>

            {user? 
             
                <button 
            onClick={() => setIsNavMenuOpen(true)}
            className="nav_menu_btn_logged_in">
                <div className="user_logged_in_img">

                <img src={user.photoURL} alt="" />
                </div>
            <i className="fa-solid fa-bars"></i>

            </button>
            :   
                <div className="nav_sr_link">
                
                <NavLink className="nav_login_a" to={"sign_in"}>
                    <span className="nav_sign_in_txt">LOGIN
                        </span>    
                        <i className="fa-solid fa-right-to-bracket nav_sign_in_icon"></i>
                </NavLink>
                <NavLink to={'sign_up'}>
                    <span>SIGN UP</span>
                </NavLink>
                </div>
            }
            {/* <span>{user ? <button onClick={logout}>Signout</button> : ''}</span>z */}
            {user ? '' :
            
           <button style={{color:'#fff'}} 
            onClick={() => setIsNavMenuOpen(true)}
            className="nav_menu_btn">
            <i className="fa-solid fa-bars"></i>
            </button>
            }
        </ul>
        {
            isNavMenuOpen !== "" &&isNavMenuOpen && 
            <div className="nav_menu_helper" onClick={()=>setIsNavMenuOpen(false)}>

            </div>
        }
            <div 
            style={{
                animation: isNavMenuOpen !== "" ? isNavMenuOpen ? '.3s navmenuContainer forwards' :'.3s navmenuContainerClose forwards' : ""
            }}
            className="nav_menu_container">
                
            <div className="nav_menu_close">
            {/* <i onClick={() => setIsNavMenuOpen(false)} className="fa-solid fa-xmark"></i> */}
            <span>F1 WEB DEV</span>
            <i onClick={() => setIsNavMenuOpen(false)} className="fa-solid fa-rectangle-xmark"></i>
            </div>

            <div className="profile_container">
                <div className="navpi_wrapper">
                <div className="nav_profile_image">
                    <img src={user?.photoURL ? user?.photoURL : "https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"} alt="" />
                </div>
                <div className="nav_profile_info">
                <span>{user?.displayName}</span>
                <span>{user?.email}</span>
                </div>
                </div>
                <div className="nav_profile_link">
                    {
                        user &&
                    <Link onClick={() => setIsNavMenuOpen(false)} to="/profile">
                    <i className="fa-solid fa-user"></i>
                    <span>
                        View Profile
                    </span>
                    </Link>
                    }

                    <Link to={"/"}
                     onClick={() => setIsNavMenuOpen(false)}
                    >
                    <i className="fa-solid fa-house"></i>
                    <span>
                        HOME
                    </span>
                    </Link>
                    <Link to={"/myworkf1"}
                     onClick={() => setIsNavMenuOpen(false)}
                    >
                    <i className="fa-solid fa-person-digging"></i>
                    <span>
                        MY WORKS
                    </span>
                    </Link>
                    <Link to={"/contacts"}
                    onClick={() => setIsNavMenuOpen(false)}>
                    <i className="fa-solid fa-address-book"></i>
                        <span>
                        CONTACTS
                        </span>
                    </Link>
                    {
                        user ?
                <button onClick={logout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                    <span>
                    Logout
                    </span>
                    </button> : 
                    <Link style={{marginTop: '10px'}}  onClick={() => setIsNavMenuOpen(false)} to={'sign_in'}>
                        <i className="fa-solid fa-right-to-bracket"></i>
                        <span>Login</span>
                        
                        </Link>
                    }
                </div>
            </div>
        </div> 
    </header>
  )
}

export default Navbar