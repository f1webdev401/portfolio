import { useRef, useState } from 'react'
import '../assets/css/SignUpPage.css'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { auth, db } from '../firebase-config'
import SignUpContext from '../component/signUpContext'
import { useContext } from 'react'
import { addDoc, collection } from 'firebase/firestore'
const SignUpPage = () => {
    const {signUpMessage,setSignUpMessage} = useContext(SignUpContext)
    const [error , setError] = useState("")
    const navigate = useNavigate()
    const [isRegister , setIsRegister] = useState(false)
    const password1Ref = useRef<any>(null)
    const [isPassword1, setIsPassword1] = useState(false)
    const password2Ref = useRef<any>(null)
    const [isPassword2, setIsPassword2] = useState(false)

    const [userDetail , setUserDetail] = useState({
        email : '',
        name: '',
        password: '',
        confirm_password: '',
    })

    const userdetailHandler = (e:any) => {
        const {value,name} = e.target 
        setUserDetail(prev => ({...prev , [name]: value}))
    }

    const password1_show_hide = (action:string) => {
        if(action === 'show') {
            password1Ref.current?.setAttribute('type','text')
            setIsPassword1(true)
        } else {
            password1Ref.current?.setAttribute('type','password')
            setIsPassword1(false)
        }
    }
    const password2_show_hide = (action:string) => {
        if(action === 'show') {
            password2Ref.current?.setAttribute('type','text')
            setIsPassword2(true)
        } else {
            password2Ref.current?.setAttribute('type','password')
            setIsPassword2(false)
        }
    }
   
    const sign_up = async (e:any) => {
        e.preventDefault()
        setIsRegister(true)
       
        try {
            if(userDetail.password !== userDetail.confirm_password) {
                setError('Password not match')
                setIsRegister(false)
            } else if (userDetail.email === "" || userDetail.name === "" || userDetail.password === "" || userDetail.confirm_password === "") {
                setError('Please Fill all Fields')
                setIsRegister(false)
            } 
            else {
                const user = await createUserWithEmailAndPassword(auth , userDetail.email,userDetail.password);
                const user_uid = user.user
                const userId = user_uid.uid
                const users = collection(db,'users')
                await updateProfile(user.user , {
                    displayName: userDetail.name
                })
                await addDoc(users, {
                    email: userDetail.email,
                    userId: userId, 
                    userName: userDetail.name,
                    photoUrl: '',
                    friends: null
                })
                await signOut(auth)
                setIsRegister(false)
                setSignUpMessage("You can now login")
                navigate("/sign_in")
            }
        } catch(e:any) {
            const errorMessage = e.message;
            const errorCode = errorMessage.split(':').pop().trim(); // Extract the last part and remove leading/trailing whitespace
            console.log(errorCode);
            setError(errorCode)
            setIsRegister(false)
        }
        return false;
    }
    const close_error = () => {
        setError("")
    }
    const logout = async () => {
        await signOut(auth)
    }
  return (
    <section className='sign_up_page'>
       
            <form onSubmit={(e) => sign_up(e)} action="" className='sign_up_form'>
                <div className='sp_form_header_text'>
                    <span>CREATE ACCOUNT</span>
                </div>
                <div className="sp_error_message_container">
                    {
                        error ? 
                        <div className='sp_error_message_wrapper'>
                            <span className='sp_error_message'>
                            {error}
                            </span>
                            <span className='close' onClick={close_error}>&times;</span>
                        </div> : ''
                    }
                    
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                    id='email'
                    name='email'
                    onChange={(e) => userdetailHandler(e)}
                    value={userDetail.email}
                    type="email" 
                    />
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <input 
                    id='name'
                    type="text" 
                    name='name'
                    onChange={(e) => userdetailHandler(e)}
                    value={userDetail.name}
                    />
                </div>
                <div>
                    <label htmlFor="password" className='sup_pass_label'>Password</label>
                    <div className="sup_inp_wrapper">
                    <input 
                    ref={password1Ref}
                    id='password'
                    type="password"
                    name='password'
                    onChange={(e) => userdetailHandler(e)}
                    value={userDetail.password}
                    />
                    {isPassword1 ? 
                    <i className="fa-regular fa-eye-slash"
                    onClick={() => password1_show_hide("hide")}
                    ></i> 
                    : 
                    <i className="fa-regular fa-eye hide"
                    onClick={() => password1_show_hide("show")}
                    ></i>
                    }
                    </div>
                </div>
                <div>
                    <label htmlFor="confirm_password" className='sup_pass_label'>Confirm Password</label>
                    <div className="sup_inp_wrapper">
                    <input 
                    ref={password2Ref}
                    name='confirm_password'
                    id='confirm_password'
                    type="password"
                    onChange={(e) => userdetailHandler(e)}
                    value={userDetail.confirm_password} 
                    />
                    {isPassword2 ? 
                    <i className="fa-regular fa-eye-slash"
                    onClick={() => password2_show_hide("hide")}
                    ></i>
                    :
                    <i className="fa-regular fa-eye"
                    onClick={() => password2_show_hide("show")}
                    ></i>
                    }
                    </div>
                </div>
                <button
                style={{opacity: isRegister ? '.5' : '1'}}
                disabled={isRegister}>
                    {isRegister ? "CREATING AN ACCOUNT ..." : "CREATE ACCOUNT"}
                </button>
                <div className='sp_sign_in_link'>
                    <p>

                    <span>Already have an account? </span>
                    <Link to="/sign_in">Sign in</Link>
                    </p>
                </div>
            </form>
    </section>
  )
}

export default SignUpPage