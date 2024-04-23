import  { useContext, useEffect, useRef, useState } from 'react'
import '../../assets/css/myWorks/chatapp/MessagesContainer.css'
import { getDatabase , ref , set ,onValue, push ,get } from 'firebase/database'

import { useParams } from 'react-router-dom'
import UserContext from '../UserContext'
import ChatAppContext from '../../assets/Context/ChatAppContext'
import { collection ,getDocs,query,where} from 'firebase/firestore'

import { db } from '../../firebase-config'
const MessagesContainer = () => {
  const {chatPerson} = useContext(ChatAppContext)
  const {id} = useParams()
  const {user} = useContext(UserContext)
  const messageInpRef = useRef<any>(null)
  const [messageText , setMessageText] = useState("")
  const [userChatInfo,setUserChatInfo] = useState<any>(null)

  const resizeTextArea = () => {
    if(!userChatInfo) return ;
    const textarea = messageInpRef.current as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.style.maxHeight = '200px'
    if(parseInt(textarea.style.height.slice(0,-2)) >= 200) {
      textarea.style.overflowY = 'auto'
      textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
    }else  {
      textarea.style.overflowY = 'hidden'
    }
  };
  useEffect(resizeTextArea , [messageText])

  // chat functionality
  const [chat_room,setChatRoom] = useState('')
  const sendMessageToRoom = async(roomPath:string) => {
    const db = getDatabase()
    const chatDataRef = ref(db, roomPath);
    const uniqueKey = push(chatDataRef);

    try {
      await set(uniqueKey, {
        name: user.displayName,
        message: messageText,
        time: '1:30pm',
        isOwnMessage: user.uid,
      });
    } catch (error) {
    }
  }
  const SendMessage = () => {
    const db = getDatabase()
    const rooms = [`chatdata/${user.uid}${id}`,`chatdata/${id}${user.uid}`]
   
    Promise.all(rooms.map(room => get(ref(db, room)))).then(snapshots  => {
      let existingRoomFound = false;
      snapshots.forEach((snapshot,index) => {
        if(snapshot.exists()) {
          existingRoomFound = true
          setChatRoom(rooms[index])
          sendMessageToRoom(rooms[index])
          setMessageText("")
          return;
        } 
      })
      if(!existingRoomFound)  {
        sendMessageToRoom(`chatdata/${user.uid}${id}`);
      }
    })
  }
  const database = getDatabase();
  const [chats, setChats] = useState<any>([]);
  useEffect(() => {
    if(user) {
      const rooms = [`chatdata/${user.uid}${id}`,`chatdata/${id}${user.uid}`]
      let roomFound = false
      for(let i = 0 ;i < rooms.length ; i ++) {
        const chatRef = ref(database,rooms[i]);
        onValue(chatRef, (snapshot) => {
          const data = snapshot.val();
          if(data) {
            roomFound = true
            setChats(Object.values(data)); 
          }
        });
      }
      if(!roomFound) {
        setChats(null)
      }

    }
  }, [db,id,user]);
 

  useEffect(() => {
  },[chat_room])


  const chatboxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chatBox = chatboxRef.current as HTMLDivElement
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
    }
  },[chats])
  async function getChatUser() {
    try {

      if(id) {
        const userCollection = collection(db , 'users')
        const querySnapShot : any = await getDocs(query(userCollection,where('userId', '==', id)))
        const doc = await querySnapShot.docs[0].data()
        setUserChatInfo(doc)
      }
    }catch(e) {
      return <>
        <span>Something went wrong</span>
      </>
    }
  }
  useEffect(() => {
    getChatUser()
  },[user,id])
  // chat functionality
 if(!userChatInfo) {
  return <>
  <div className="cas_message_container mc_loading_contianer">

    <span className='loader'>Loading ...1</span>
  </div>
  </>
 }
  return (
    <div className='cas_message_container'>

      <header className="cas_message_header">
        <div className="cas_active_message_detail">
          <div className="cas_user_image">
            <img src={userChatInfo.photoUrl? userChatInfo.photoUrl : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="} alt="" />
          </div>
          {userChatInfo ? 
          <span>
      {userChatInfo.userName}
          </span>
         :  <span>Start Chat Now</span> 
        }
          
        </div>
        <button>
      
        </button>
      </header>
      <div ref={chatboxRef} className="cas_message_body">
        {chats ? chats.map((k:any,i:number) => (
          k.isOwnMessage === user.uid ? 
            <div 
            key={i}
            className="cas_message_receiver message_all_c">
            <div className="cas_message_content_receiver cas_message_content_all">
              
              <span>{k.message}</span>
              <div className="cas_receiver_image cas_message_image">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzj-pRmqYH-8ONKwUmsgfljQaM9ArDp4FL0IoBFa-Fyg&s" alt="" />
              </div>
            </div>
        </div> 
          :


          <div key={i} className="cas_message_sender message_all_c">
            <div className="cas_message_content_sender cas_message_content_all">
            <div className="cas_sender_image cas_message_image">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzj-pRmqYH-8ONKwUmsgfljQaM9ArDp4FL0IoBFa-Fyg&s" alt="" />
              </div>
              <span>{k.message}</span>
            </div>
        </div>
       
          )) : 
            <div className='mc_start_container'>
              <span>Start a Chat</span>
            </div>
          } 
      </div>
      <form className="cas_message_compose">
        <button type="button" className='cas_message_file'>
        🗃️
        </button>
        <div className="cas_message_textArea_wrapper">
        <textarea 
        value={messageText}
        className='cas_message_textArea'
        onChange={(e) => setMessageText(e.target.value)}
        ref={messageInpRef} name="" id="" rows={1}></textarea>
        </div>
        <button
        onClick={(e) => {
          e.preventDefault()
          setMessageText("")
          SendMessage()
        }}
        className='cas_send_btn'>
        ➡️
        </button>
      </form>
    </div>
  )
}

export default MessagesContainer