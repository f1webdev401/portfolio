import React, { useEffect, useState } from 'react'
import WebLogo from '../assets/images/icon_1.png'
import '../assets/css/myWorks/UserProfile.css'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query , updateDoc, where} from 'firebase/firestore'
import { useContext } from 'react'
import { db } from '../firebase-config'
import UserContext from '../component/UserContext'
const UserProfile = () => {
    const {user} = useContext(UserContext)
    const {id} = useParams()
    const [userInfo , setUserInfo] = useState<any>(false)
    const [isRequested,setIsRequested] = useState<any>(null)
    const AddFriend = async  () => {
        try {

            if(user) {
                const userCollection = collection(db,'users')
                const querySnapshot : any  = await getDocs(query(userCollection,where('userId', '==' , id)))
                const doc = querySnapshot.docs[0]
                if(doc.data().friends === '' || doc.data().friends === null) {
                    let friends = [{user: user.uid , isAccepted: false}]
                    await updateDoc(doc.ref , {
                        friends: friends
                    })
                }else {
                    let friends = [...doc.data().friends]
                    let data = {
                        user: user.uid,
                        isAccepted: false
                    }
                    for(let i = 0 ; i < friends.length ; i ++) {
                        if(friends[i].user === user.uid) {
                            return;
                        } 
                    }
                    friends.push(data)
                    await updateDoc(doc.ref , {
                        friends: friends
                    })
                }
            }
        }catch(e) {
            console.log(e)
        }
        getUserAccount()
        checkIfRequested()
    }
    async function checkIfRequested() {
        try {
            if(user) {
                const userCollection = collection(db,'users')
                const querySnapshot : any  = await getDocs(query(userCollection,where('userId', '==' , id)))
                const doc = querySnapshot.docs[0].data().friends
                if(doc) {
                    for(let i = 0 ; i < doc.length ; i++) {
                        if(doc[i].user === user.uid && doc[i].isAccepted === false) {
                            setIsRequested("requested")
                            return
                        } else if (doc[i].user === user.uid && doc[i].isAccepted === true) {
                            setIsRequested("friend")
                            return ;
                        }
                    }
                    setIsRequested("addfriend")
                    return ;
                } else {
                    setIsRequested("addfriend")
                }
            }
        }catch(e) {
                console.log(e)
        }
    }
    async function getUserAccount() {
        const userCollection = collection(db,'users')
        const querySnapshot : any  = await getDocs(query(userCollection,where('userId', '==' , id)))
        const doc = querySnapshot.docs[0].data()
        setUserInfo(doc)
    }
    useEffect(() => {
             getUserAccount();
             checkIfRequested();
        
    },[user])
    if(!userInfo && isRequested === null )
         {
        return (
         <section className='user_profile_page_container uppc_loading'>
        <div className="upg_content_container  upgcc_loading_container">
            <div className="upg_cover_photo">
            </div>
            <div className="u_profile_info_container">
                    <div className="u_profile_image">

                        <div className="u_profile_image_wrapper upiw_loading">
                           
                        </div>
                       
                    </div>
                    <div className="u_profile_nf_container">

                    <div className="u_profile_name upname_loading">
                       
                            <>
                        <h2></h2>
                        <span></span>
                            </>
                    </div>
                    <div className="u_profile_friends">
                    <p> </p>
                    </div>
                    </div>
                    <div className='u_profile_edit_btn up_loading_button'>  

                       <button className='up_loading_btn'>
                        </button>
                       <button className='up_loading_btn'>
                       </button>
                    </div>
            </div>
        
        </div>

    </section>
    )
    }
  return (
    <section className='user_profile_page_container'>
        <div className="upg_content_container">
            {/* {
                isUpdating &&
            <div className="loader_container">
                <span className="loader"></span>
            </div>
            } */}
            <div className="upg_cover_photo">
                <div className="upg_img_wrapper">
                <img src={WebLogo} alt="" />
                </div>
                <h1>F1 WEB DEV</h1>
            </div>
            <div className="u_profile_info_container">
                    <div className="u_profile_image">

                        <div className="u_profile_image_wrapper">
                           
                            <img src={userInfo.photoUrl? userInfo.photoUrl : "https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"} alt="" />  
                        </div>
                       
                    </div>
                    <div className="u_profile_nf_container">

                    <div className="u_profile_name">
                       
                            <>
                        <h2>{userInfo.userName}</h2>
                        <span>{userInfo.email}</span>
                            </>
                    </div>
                    <div className="u_profile_friends">
                    <p>{userInfo.friends && userInfo.friends.length} friends</p>
                    </div>
                    </div>
                    <div className='u_profile_edit_btn'>  
                    {isRequested === 'friend' ? 
                        <button><span>Friend</span></button> : isRequested === 'requested' ?<button><span>Friend Requested</span></button> :

                       <button onClick={AddFriend}>
                        <span>
                        Add Friend
                        </span>
                        <i className="fa-solid fa-plus"></i></button>
                }
                       <button>
                        <span>
                        Message 
                        </span>
                       <i className="fa-solid fa-message"></i>
                       </button>
                    </div>
            </div>
        
        </div>

    </section>
  )
}

export default UserProfile