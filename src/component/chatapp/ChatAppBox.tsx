import { Outlet } from "react-router-dom"
import ChatAppSideBar from "./ChatAppSideBar"
import '../../assets/css/myWorks/chatapp/ChatAppBox.css'
const ChatAppBox = () => {
  return (
    <div className="chat_app_container"> 
        <ChatAppSideBar/>
        <Outlet />
    </div>
  )
}

export default ChatAppBox