import  { useContext, useEffect, useState } from 'react'
import '../../assets/css/myWorks/ChatApp.css'
import { Outlet } from 'react-router-dom'
import { NavLink , Link } from 'react-router-dom'
import UserContext from '../../component/UserContext'
import LoadingPage from '../LoadingPage'
const ChatApp = () => {
  const {user} = useContext(UserContext)
  const [loading,setLoading] = useState(true)
  useEffect(() => {
     // Set a timer to delay setting loading to false
     const timerId = setTimeout(() => {
      if (user !== undefined ) {
        setLoading(false); // Set loading to false when user is available
      }
    }, 700);

    // Clear the timer when the component unmounts or when user changes
    return () => clearTimeout(timerId);
  },[user])
  
  if(loading){
    return (<>
      <LoadingPage />
    </>)
  }
  return (
   
    <>
    {!user &&
      <div className="cas_need_login">
          <Link to='/sign_in'>Go to Login  <i className="fa-solid fa-right-to-bracket"></i></Link>
         
      </div>
  
      }
    <div className='chat_app_nav'>
      <NavLink to={''}
      style={({ isActive}) => {
        return {
          backgroundColor: isActive ? '#834395' : '',
          color: isActive ? 'white' : ''
        };
      }}
      end
      >Chat</NavLink>
      <NavLink to={'findfriends'}
      style={({ isActive}) => {
        return {
          backgroundColor: isActive ? '#834395' : '',
          color: isActive ? 'white' : ''
        };
      }}
      end
      >Find Friends</NavLink>
      <NavLink to={'profile'}
      style={({ isActive}) => {
        return {
          backgroundColor: isActive ? '#834395' : '',
          color: isActive ? 'white' : ''
        };
      }}
      end
      >My Profile</NavLink>
    </div>
    <section className=''>
      {/* <ChatAppSideBar/> */}
      <Outlet />
      </section>
      
    </> 
   
  )
}

export default ChatApp