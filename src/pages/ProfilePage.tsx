import '../assets/css/ProfilePage.css'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../component/UserContext'
import WebLogo from '../assets/images/icon_1.png'

import {ref , uploadBytes , getStorage, getDownloadURL} from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase-config'
import { useRef } from 'react'
import { db } from '../firebase-config'
import { updateDoc , doc, getDocs, query  , where, collection} from 'firebase/firestore'
import { NavLink } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
const ProfilePage = () => {
    const {user} = useContext(UserContext)
    const [isEditProfile,setIsEditProfile] = useState(false)
    const [profileImg,setProfileImg] = useState(null)
    const [profileImgPrev , setProfileImgPrev] = useState<any>(null)
    const [updatedProfile,setUpdatedProfile] = useState<any>(null)
    const inputImgRef = useRef<any>(null)
    const [editNameVal,setEditNameVal] = useState(user && user.displayName ?  user.displayName : '' )
    const [friends , setFriends] = useState<any>(null)
    const [isUpdating,setIsUpdating] = useState(false)
    const handlePhotoChange = (e:React.ChangeEvent<HTMLInputElement> | null) => {
        if(e&& e.target.files && e.target.files.length > 0) {
            const selectedImg :any = e.target.files[0]
            const uploadImg:any = e.target.files[0]
            setProfileImg(uploadImg)
            setProfileImgPrev(selectedImg)
            const reader = new FileReader()
            reader.onload = () => {
                if(reader.result) {
                    setProfileImgPrev(reader.result as string)
                }
            }
            reader.readAsDataURL(selectedImg)
        }    
    }
    const SaveImgUrlStorage = async () => {
        if(profileImg) {

            const storage = getStorage()
            const storageRef = ref(storage,`profilePics/${user.uid}`)

            await uploadBytes(storageRef,profileImg)

            const url = await getDownloadURL(storageRef)

            return url
        } else {
            return null
        }


    }
    
    const SaveProfileHandler = async () => {
        setIsEditProfile(false)
        try {
            const photoURL = await SaveImgUrlStorage()
            
            if(photoURL) {
                if(auth.currentUser) {
                    await updateProfile(auth.currentUser, {
                        photoURL: photoURL , 
                        displayName: editNameVal,
                    }) 
                    setIsUpdating(true)
                    UpdateUserProfile(photoURL)
                    setProfileImgPrev('')
                }
            }else if (user.displayName !== editNameVal) {

                updateName ()
                setIsUpdating(true)

            }
             else {
                console.log('no image')
               
            }

        } catch(e) {

        }
    }
    const CancelProlileHandler = () => {
        setIsEditProfile(false)
    }
    async function UpdateUserProfile(photoUrl:any) {
        if(user) {

            const usersCollection = collection(db,'users')
            const querySnapShot :any =await getDocs(query(usersCollection,where('userId' , '==' , user.uid)))
            const doc = querySnapShot.docs[0]
            await updateDoc(doc.ref, {
                photoUrl: photoUrl ,
                userName: editNameVal

            });
            setUpdatedProfile(photoUrl)
            setIsUpdating(false)
        }
    }
    async function updateName () {
            if(auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: editNameVal,
                }) 
                setIsUpdating(false)
            }

    }
    async function getUserAccount() {
        if(user) {

            const usersCollection = collection(db,'users')
                const querySnapShot :any =await getDocs(query(usersCollection,where('userId' , '==' , user.uid)))
                const doc = await querySnapShot.docs[0].data().friends
                if(doc) {
                    setFriends(doc.length)
                } else {
                    setFriends(0)
                }
        }
    }
    

    useEffect(() => {
        setEditNameVal(user ? user.displayName :'')
        getUserAccount()
    },[user])
  return (
    <section className='profile_page_container'>
        <div className="pg_content_container">
            {
                isUpdating &&
            <div className="loader_container">
                <span className="loader"></span>
            </div>
            }
            <div className="pg_cover_photo">
                <div className="pg_img_wrapper">
                <img src={WebLogo} alt="" />
                </div>
                <h1>F1 WEB DEV</h1>
            </div>
            <div className="profile_info_container">
                    <div className="profile_image">
                        {
                            isEditProfile ? 

                        <div className="profile_image_wrapper">
                            {profileImgPrev ? 
                           
                        <img src={profileImgPrev} alt="" /> : <span>CHOOSE PHOTO</span>
                           }
                        </div> :

                        <div className="profile_image_wrapper">
                            {user && user.photoURL  ?
                            
                            <img src={updatedProfile ? updatedProfile : user.photoURL}alt="" />   
                            :
                            <img src={"https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"} alt="" />  
                        }
                       
                        </div>
                        }
                        {
                            isEditProfile && 
                        <button onClick={() => {
                            inputImgRef.current.click()
                        }} className='update_profile_btn'><i className="fa-solid fa-camera"></i></button>
                        }
                    </div>
                    <div className="profile_nf_container">

                    <div className="profile_name">
                        {
                            user &&
                            <>
                        <h2>{user.displayName}</h2>
                        <span>{user.email}</span>
                            </>
                        }
                    </div>
                    <div className="profile_friends">
                    <p>{friends} friends</p>
                    </div>
                    </div>
                    <div className='profile_edit_btn'>  {
                        isEditProfile ?
                        <div className='profile_save_cancel_btn'>

                        <button onClick={SaveProfileHandler}>
                        <i className="fa-solid fa-check">
                        </i>
                            <p>save</p>
                    </button> 
                    <button onClick={CancelProlileHandler}>
                    <i className="fa-solid fa-xmark"></i>
                    <p>Cancel</p>
                    </button>
                        </div>
                    :

                        <button 
                        onClick={() => setIsEditProfile(true)}
                        ><i className="fa-solid fa-pen-to-square"></i></button>
                        }
                       
                    </div>
            </div>
         {isEditProfile ? 
         
        <form action="" className="pg_edit_profile_form">
            <div className="name">
                <label htmlFor="">Name</label>
                <input
                onChange={(e) => setEditNameVal(e.target.value)}
                value={editNameVal}
                type="text" />
            </div>
            <div className="pg_profile_phot">
                <input ref={inputImgRef}style={{display: 'none'}} onChange={(e) => handlePhotoChange(e)} type="file" name="" id="" />
            </div>
        </form> :

        <>
         <div className="friend_request_navigator">
        <NavLink to={''}
        style={({ isActive}) => {
            return {
              backgroundColor: isActive ? '#ED9913' : '' ,
              color: isActive ? 'white' : ''
            };
          }}
          end
        >Friends</NavLink>
        <NavLink to={'friendrequest'}
        style={({ isActive}) => {
            return {
              backgroundColor: isActive ? '#ED9913' : '' ,
              color: isActive ? 'white' : ''
            };
          }}
          end
        >Friend Request</NavLink>
        </div>
        <Outlet/>
        </>
        }
       
        </div>

    </section>
  )
}

export default ProfilePage