import React, { useContext } from 'react'
import '../../assets/css/myWorks/ChatApp.css'
import ChatAppSideBar from '../../component/chatapp/ChatAppSideBar'
import { Outlet } from 'react-router-dom'
import { NavLink , Link } from 'react-router-dom'
import UserContext from '../../component/UserContext'
const ChatApp = () => {
  const {user} = useContext(UserContext)

  // if(!user) {
  //   return <>
  //   <div>
  //     <h1>Need to Login</h1>
  //   </div>
  //   </>
  // }
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