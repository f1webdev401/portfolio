import { Link } from 'react-router-dom'
import '../../assets/css/myWorks/chatapp/FindFriends.css'
import { useContext, useEffect, useState } from 'react'
import { collection , getDocs , where , query, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase-config'
import UserContext from '../UserContext'
const FindFriends = () => {
    const {user} = useContext(UserContext)
    const [allUsers,setAllUsers] = useState<any>(null)
    const [isRequested,setIsRequested] = useState('')
    const [currentUserFriends,setCurrentUserFriends] = useState<any>(null)
    const [loading,setLoading] = useState(true)
    const AddFriendHandler = async(id:any) => {
        try {
            if(user) {
                const userCollection = collection(db,'users')
                const queryDoc : any  = await  getDocs(query(userCollection,where('userId','==',id)))
                const doc = queryDoc.docs[0]

               

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
            getAllUsers()
        }catch(e) {
        }   
    }
   
    async function getAllUsers() {
        try {

            const userCollection = collection(db,'users')
            const querySnap = await getDocs(userCollection)
            
            const allUsers = querySnap.docs.map((doc:any) => {
                return doc.data()
            })
            setAllUsers(allUsers)
            setLoading(false)
            
        }catch(e) {
            return <><div><span>Something went wrong</span></div></>
        }
    }
    async function getCurrentUser() {
        if(user) {
            const userCollection = collection(db ,'users')
            const querySnapShot = await getDocs(query(userCollection ,where('userId','==',user.uid)))
            const doc = querySnapShot.docs[0]
            if(doc.data().friends) {
                let data =  doc.data().friends.map((u_:any) => u_.user)
                setCurrentUserFriends(data)
            }else {
                setCurrentUserFriends(null)
            }
        }
    }
    async function AcceptFriendRequest(id:string) {
        if(user) {
            const userCollection = collection(db,'users')
            const queryDoc : any  = await getDocs(query(userCollection, where('userId' , '==', user.uid)))
            const doc = queryDoc.docs[0]

            const newFriendRequest = [...doc.data().friends]

            const requestToEdit = newFriendRequest.findIndex(obj => obj.user === id)
            newFriendRequest[requestToEdit].isAccepted = true

            // update user requested
            const queryReqUser = await getDocs(query(userCollection , where('userId', '==' ,id)))
            const reqDoc = queryReqUser.docs[0]
            const reqUserFriendArray = queryReqUser.docs[0].data().friends
            
            if(reqUserFriendArray) {
                let reqUserIdArray = []
                for(let i = 0 ; i < reqUserFriendArray.length ; i ++) {
                    reqUserIdArray.push(reqUserFriendArray[i].user)
                }
                if(reqUserIdArray.includes(user.uid)) {
                    const reqDocnewFriendsArray = [...reqUserFriendArray]
                    const friendIndex = reqDocnewFriendsArray.findIndex((user_:any) => user_.user === user.uid)
                    reqDocnewFriendsArray[friendIndex].isAccepted = true
                    await updateDoc(reqDoc.ref, {
                        friends: reqDocnewFriendsArray
                    });
                } else {
                    const reqDocnewFriendsArray = [...reqUserFriendArray,{user:user.uid , isAccepted: true}]
                    await updateDoc(reqDoc.ref, {
                        friends: reqDocnewFriendsArray
                    });
                }
                
            }else {
                await updateDoc(reqDoc.ref, {
                    friends: [{user:user.uid , isAccepted: true}]
                }); 
            }

            // update user requested

            await updateDoc(doc.ref , {
                friends: newFriendRequest
            })

        }
        getAllUsers()
    }
    useEffect(() => {
        getAllUsers()
        getCurrentUser()
    },[user,loading])
    if(loading) {
        return <>
        <div className="ff_page_container ff_page_loading">
           {[1,2,3,4].map((loading:any,index:any) => (
             <div key={index} className='ff_fr_user_container ff_fr_user_container_loading'>
            </div>
           )) }
        </div>
        </>
    }
  return (
    <section className='ff_page_parent_container'>
    <div className='ff_page_container'>
        {
            allUsers && user ? 
            allUsers.map((user_:any,index:any) => (
                user_.userId === user.uid ? '' :
          <div key={index} className='ff_fr_user_container'>
              <div className='ff_fr_image_wrapper'>
                  <img src={user_.photoUrl? user_.photoUrl : 'https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png'} alt="" />
              </div>
              <div className='ff_fr_user_info'>
                  <span>{user_.userName}</span>
                  {/* <span>{currentUserFriends.includes(user_.userId) ? 
                  user_.friends === null ? 'accept' : '' 
                  : "false"}</span> */}
                  <span> {user_.email}</span>
              </div>
              
              <div className="ff_fr_user_action">
               
                {currentUserFriends && currentUserFriends.includes(user_.userId) &&
                user_.friends === null ? <button onClick={() => AcceptFriendRequest(user_.userId)}>Accept</button> : currentUserFriends &&
                currentUserFriends.includes(user_.userId) &&
                user_.friends !== null &&
                user_.friends.map((u_id:any) => u_id.user).filter((is_id:any) => is_id === user.uid ).length === 0 
                ? 
                
                <button onClick={() => AcceptFriendRequest(user_.userId)}>Accept</button> 
                
                
                :

                  <button onClick={() => AddFriendHandler(user_.userId)}>{
                  user_.friends?.some((friend:any) => friend.user === user.uid &&  friend.isAccepted === true) ? ' Friend' :
                  user_.friends?.some((friend:any) => friend.user === user.uid &&  friend.isAccepted === false) ? 'Requested': 
                  'Add Friend'}</button>
                }
                  <Link className='ff_view_user' to={`/myworkf1/chat_app/userprofile/${user_.userId}`}>View Profile</Link>
              </div>
          </div>
            )) :
            "no users found"
        }
         
    </div>
    </section>
  )
}

export default FindFriends