import React, { useContext, useEffect, useState  } from 'react'
import '../../assets/css/myWorks/chatapp/ChatAppSideBar.css'
import { collection , getDocs } from 'firebase/firestore'
import { useParams } from 'react-router-dom'




import { NavLink } from 'react-router-dom'
import { db } from '../../firebase-config'
import UserContext from '../UserContext'
import ChatAppContext from '../../assets/Context/ChatAppContext'


const ChatAppSideBar = () => {
  const {setChatPerson} = useContext(ChatAppContext)
  const {user} = useContext(UserContext)
    const {id} = useParams()
    const [allUsers,setAllUsers] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [searchUsers,setSearchUsers] = useState<any>()
    const [inpSearchVal , setInpSearchVal] = useState("")
    const [chatSideOpen,setChatSideOpen] = useState(false)
    const chatBarStyleOpen = {
      transform: "translateX(0)",

    }
    const chatBarStyleClose = {
      transform: "translateX(calc(var(--translate-value) * -1))",

    }
    const ImgStyleOpen : React.CSSProperties = {
      width: "40px",
    height: '40px',
    margin: 'auto',
    borderRadius: '5px',
    overflow: 'hidden',
      position: "static",
    }
    const ImgStyeClose : React.CSSProperties = {
      position: "absolute",
        right: '0',
        top: '0',
        bottom: '0',
        margin: "auto 5px auto 0"
    }
    const UserDetailClose = {
      display: "none",
    }
    const UserDetailOpen = {
      display: "flex",
    }
    useEffect(() => {
      const getUser = async () => {
        try {
          if(user) {
            const userCollection = collection(db , 'users')
            const querySnapshot = await getDocs(userCollection)
            const userDataArray :any = querySnapshot.docs.map((doc) => doc.data());
            let userFriends : any[] = []
            for (let i = 0; i < userDataArray.length; i++) {
              if (userDataArray[i].friends) {
                for (let j = 0; j < userDataArray[i].friends.length; j++) {
                  if (userDataArray[i].friends[j].user === user.uid && userDataArray[i].friends[j].isAccepted) {
                    userFriends.push(userDataArray[i]);
                    break; 
                  }
                }
              }
            }
            setAllUsers(userFriends)
            setSearchUsers(userFriends)
            setLoading(false)
          }
        }catch(e) {
        }
      }
      getUser()
    },[user,loading])
    const SearchInputHandler = (e:any) => {
      const {value} = e.target
      setInpSearchVal(value)
      let splitValue = value.split(' ')
      const newAllUsers = [...searchUsers]
      const filterUsers = newAllUsers.filter(user_ => {
        return splitValue.every((el:any) => {
          return user_.userName.includes(el)
        })
      })
      setAllUsers(filterUsers)
    }
    const OpenChatBar = () => {
      setChatSideOpen(true)
    }
    const CloseChatBar = () => {
      setChatSideOpen(false)
    }
    // useEffect(() => {
    //   setChatSideOpen(false)
    // },[id])
    const [width, setWidth] = useState<any>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    if(parseInt(width) >= 800) {
      setChatSideOpen(true)
    } else {
      setChatSideOpen(false)
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width,id]);
    if(loading && user) {
      return (
        <>
          <div className='cas_side_bar cas_side_bar_loader'>
            <span className="loader"></span>
          </div>
        </>
      )
    }
  return (
    <aside className="cas_side_bar"
    style={chatSideOpen === true? chatBarStyleOpen : chatBarStyleClose }
    >
        <header>
          <form action="">
          <input
          onChange={(e) => SearchInputHandler(e)}

          type="text" placeholder='Search ...'/>
          {/* <button><i className="fa-solid fa-magnifying-glass search"></i></button> */}
          {chatSideOpen ? 
          
          <button type="button" className='close_side_bar' onClick={CloseChatBar}>
          <i className="fa-solid fa-arrow-left"></i>
          </button> : 
          <button type="button" className='open_chat' onClick={OpenChatBar}>
          <i className="fa-brands fa-rocketchat "></i>
          </button>
        }
          </form>
        </header>
        <div className="cas_user_message_container">
          {!user ? '':
          allUsers && allUsers.length > 0 ? allUsers.map((user_:any,index:number) => (
            user?.uid === user_.userId ?
            '' :
            <NavLink 
            onClick={() =>setChatPerson(user_)}
            to={user_.userId}
            style={{backgroundColor: user_.userId === id ? '#2a4a69': '',boxShadow: user_.userId === id ? `box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px`:''}}
            className="cas_user_message_list" key={index}>
            <div className="cas_user_image" 
            style={chatSideOpen ? ImgStyleOpen : ImgStyeClose}
            >
              <img 
              src={user_.photoUrl ? user_.photoUrl : "https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"} alt="" />
            </div>
            <div className='cas_user_detail'
            style={chatSideOpen? UserDetailOpen : UserDetailClose}
            >
              <span>{user_.userName}</span>
              <span>message ...</span>
            </div>
            <div className='cas_user_stamp'>
              {/* <span>4m</span> */}
              <span></span>
            </div>
          </NavLink>
            )): inpSearchVal.length && searchUsers? <div className='cas_no_result'>
              <span>&times; No result of {inpSearchVal}</span>
            </div>: <div className='cas_findfriends'>
              <NavLink to={'findfriends'}>Find Friends
              <i className="fa-solid fa-user-plus"></i>
              </NavLink>
            </div>
        }
        </div>
      </aside>
  )
}

export default ChatAppSideBar