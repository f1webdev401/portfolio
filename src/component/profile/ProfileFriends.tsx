import '../../assets/css/myWorks/profile/ProfileFriends.css'
import { useContext, useState } from 'react'
import UserContext from '../UserContext'
import { db } from '../../firebase-config'
import { query , getDocs, where , collection, updateDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const ProfileFriends = () => {
    const {user} = useContext(UserContext)    
    const [friends , setFriends] = useState<any>()
    const [isLoading,setIsLoading] = useState(true)
    async function getUserAccount() {
      if(user) {
          const usersCollection = collection(db,'users')
              const querySnapShot :any =await getDocs(query(usersCollection,where('userId' , '==' , user.uid)))
              const doc = await querySnapShot.docs[0].data().friends
                return doc
      }
  }
  const displayUserFriends = async () => {
    try {

      let friendsData : any = await getUserAccount()
      if(friendsData) {
        const acceptedFriendsArray = friendsData.filter((obj: any) => obj.isAccepted === true).map((obj: any) => obj.user);
        if (acceptedFriendsArray.length > 0) {
            const userCollection = collection(db, 'users');
            const usersQuery = query(userCollection, where('userId', 'in', acceptedFriendsArray));
            const querySnapShot = await getDocs(usersQuery);
            const newFriends = querySnapShot.docs.map(doc => doc.data());
            setFriends(newFriends);
            setIsLoading(false)
        } else {
            console.log("No accepted friends found.");
            setFriends(null); 
            setIsLoading(false)
        }

      } else {
        setFriends(null); 
            setIsLoading(false)
      }
    }catch(e) {
      console.log(e)
    }
  }
  const UnfriendHandler = async (id:string) => {
    setIsLoading(true)
    if(user) {
      try  {
        const userCollection = collection(db,'users')
        const querySnapShot = await getDocs(query(userCollection,where('userId' , '==' , user.uid)))
        const doc = querySnapShot.docs[0]
        const friendsArray = querySnapShot.docs[0].data().friends
        const newFriendsArray = friendsArray.filter((user:any) => user.user !== id)

        const queryFriendDoc = await getDocs(query(userCollection,where('userId','==',id)))
        const friendDoc = queryFriendDoc.docs[0]
        const u_friendArray = queryFriendDoc.docs[0].data().friends
        const newUFriendArray = u_friendArray.filter((user_:any) => user_.user !== user.uid)
        
        await updateDoc(doc.ref, {
          friends: newFriendsArray.length ===0 ? null : newFriendsArray
        })
        await updateDoc(friendDoc.ref, {
          friends: newUFriendArray.length ===0 ? null : newUFriendArray
        })
        displayUserFriends()
      }catch(e) {
        console.log(e)
      }
    }
  }
  async function UnfriendUserHanlder() {

  }
  useEffect(() => {
    displayUserFriends()
},[user])
  return (
    <section className='pf_page_container'>
      {isLoading ? 
       [1,2,3,4,].map((key:any,index:any) => (
        <div key={index} className="pf_fr_user_container pf_loading"></div>
      )) : (friends ? 
        friends.map((user:any , index: any) => (
            <div key={index} className='pf_fr_user_container'>
                <div className='pf_fr_image_wrapper'>
                    <img src={user.photoUrl ? user.photoUrl :""} alt="" />
                </div>
                <div className='pf_fr_user_info'>
                    <span> {user.userName}</span>
                    <span> {user.email}</span>
                </div>
                <div className="pf_fr_user_action">
                    <button onClick={() => UnfriendHandler(user.userId)}>Unfriend</button>
                    <button>Message</button>
                </div>
            </div>
        ))
        : <div className='pf_no_friends_contianer'>
          <span><i className="fa-solid fa-x"></i>No friends</span>
          <Link to={''}>Find Friends<i className="fa-solid fa-magnifying-glass"></i></Link>
        </div>)
      }
        
    </section>
  )
}

export default ProfileFriends