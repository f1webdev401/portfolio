import '../../assets/css/myWorks/profile/ProfileFriendRequest.css'

import UserContext from '../UserContext'
import { useContext, useEffect, useState } from 'react'
import { db } from '../../firebase-config'
import { query , getDocs, where , collection, updateDoc } from 'firebase/firestore'

const ProfileFriendRequest = () => {
    const {user} = useContext(UserContext)
    const [friendRequest, setFriendRequest] = useState<any>()
    const [loading ,setLoading] = useState(true)
    const [succesAction,setSuccessAction] = useState<string | boolean>(false)
    const [requestProcessing,setRequestProcessing] = useState<boolean>(false)
    async function getUserAccount() {
        if(user) {
            const usersCollection = collection(db,'users')
                const querySnapShot :any =await getDocs(query(usersCollection,where('userId' , '==' , user.uid)))
                const doc = await querySnapShot.docs[0].data().friends
                return doc
                
        }
    }
    const displayUserFriends = async () => {
        let friendsData :any =  await getUserAccount()
        if(friendsData) {
            const friendRequestArray = friendsData.filter((obj: any) => obj.isAccepted === false).map((obj:any )=> obj.user);
            if(friendRequestArray.length > 0) {
                const userCollection = collection(db,'users')
                const usersQuery = query(userCollection,where('userId','in', friendRequestArray))
                const querySnapShot = await getDocs(usersQuery)
                const newFriends = querySnapShot.docs.map(doc => doc.data()); 
                setFriendRequest(newFriends);
                setLoading(false)
            }else {
                setFriendRequest(null);
                setLoading(false)

            }

        } else {
            setFriendRequest(null);
            setLoading(false)
        }
       
    }
    const UpdateRequestedUser = async (id:string ) => {
        try {
            if(user) {
                const userCollection = collection(db ,'users')
                const querySnapShot = await getDocs(query(userCollection ,where('userId','==',id)))
                const doc = querySnapShot.docs[0]
                const friendsArray = querySnapShot.docs[0].data().friends
                if(friendsArray) {
                    const newFriendsArray = [...friendsArray]
                    const friendIndex = newFriendsArray.findIndex((user:any) => user.user === id)
                    newFriendsArray[friendIndex].isAccepted = true
                    await updateDoc(doc.ref, {
                        friends: newFriendsArray
                    });
                }else {
                    await updateDoc(doc.ref, {
                        friends: [{user:user.uid , isAccepted: true}]
                    }); 
                }
            }
        }catch(e) {

        }
    }
    // const DeleteRequestedUser = async(id:string) => {
    //     try {
    //         if(user) {
    //             const userCollection = collection(db ,'users')
    //             const querySnapShot = await getDocs(query(userCollection ,where('userId','==',id)))
    //             const doc = querySnapShot.docs[0]
    //             const friendsArray = querySnapShot.docs[0].data().friends
    //             if(friendsArray) {
    //                 const newFriendsArray = [...friendsArray]
    //                 const deletedFriendsArray = newFriendsArray.filter((obj:any) => obj.user !== id)
    //                 await updateDoc(doc.ref, {
    //                     friends: deletedFriendsArray
    //                 });
    //             }else {
    //                 await updateDoc(doc.ref, {
    //                     friends: [{user:user.uid , isAccepted: true}]
    //                 }); 
    //             }
    //         }
    //     }catch(e) {

    //     }
    // }
    const AcceptFriendRequest = async (id:string) => {
        setRequestProcessing(true)
        if(user) {
            const usersCollection = collection(db,'users')
            const querySnapShot :any = await getDocs(query(usersCollection, where('userId', '==' , user.uid)))

            const doc = querySnapShot.docs[0]
            const newfriendRequest =[...doc.data().friends]
            const requestToEdit = newfriendRequest.findIndex(obj => obj.user === id)
            newfriendRequest[requestToEdit].isAccepted = true

            // update user requested
            const queryReqUser = await getDocs(query(usersCollection , where('userId', '==' ,id)))
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

            await updateDoc(doc.ref, {
                friends: newfriendRequest
            });
            UpdateRequestedUser(id)
            // DeleteRequestedUser(id)
            displayUserFriends()
            setSuccessAction("Accepted!")
            setRequestProcessing(false)
            callPopup()
        }
    }
    const DeleteFriendRequest = async (id:string) => {
        setRequestProcessing(true)
        if(user) {
            try {
                const userCollection = collection(db , 'users')
                const querySnapShot = await getDocs(query(userCollection , where('userId', '==', user.uid)))
                const doc = querySnapShot.docs[0]
                const friendsArray = querySnapShot.docs[0].data().friends
                const newfriendRequest = friendsArray.filter((obj:any) => obj.user !== id)
                await updateDoc(doc.ref, {
                    friends: newfriendRequest.length === 0 ? null : newfriendRequest
                }); 
                displayUserFriends()
                setSuccessAction("Successfully Deleted")
        setRequestProcessing(false)
                callPopup()
            }catch(e){
                console.log('something went wrong')
            }
        }
    }
    function callPopup() {
        setTimeout(() => {
            setSuccessAction(false)
        },1000)
    }
    useEffect(() => {
       
        displayUserFriends()
    },[user])
    if(loading) {
        return <>
        <div className="friend_request_container">

        {[1,2,3,4,].map((_:any , index:number) => (
            <div key={index} className='fr_user_container fr_user_loading'>
            </div>
        ))}
        </div>
        </>
    }
  return (
    <section className='friend_request_container'>
        {friendRequest ? 
        friendRequest.map((user:any , index: any) => (
            <div key={index} className='fr_user_container'>
                <div className='fr_image_wrapper'>
                    <img src={user.photoUrl ? user.photoUrl :""} alt="" />
                </div>
                <div className='fr_user_info'>
                    <span> {user.userName}</span>
                    <span> {user.email}</span>
                </div>
                <div className="fr_user_action">
                    <button onClick={() => DeleteFriendRequest(user.userId)}>Delete</button>
                    <button onClick={() => AcceptFriendRequest(user.userId)}>Accept</button>
                </div>
            </div>
        ))
        : <div className='pf_no_request_container'>
            <i className="fa-solid fa-x"></i>
                <span>No Friend Request</span>
            </div>}
            {succesAction &&
            
            <div className="pf_popup_message">
                <span>succesAction</span>
            </div>
        }
        {
            requestProcessing &&
        <div className="requestProcessing">

        </div>
        }
    </section>
  )
}

export default ProfileFriendRequest