import { Link, useNavigate } from "react-router-dom"
import '../assets/css/SignInPage.css'
import { useRef, useState  } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase-config"
import { useContext } from "react"
import SignUpContext from "../component/signUpContext"
const SignInPage = () => {
    const navigate = useNavigate()
    const [error ,setError] = useState("")
    const [isPassword,setIsPassword] = useState(false)
    const passwordRef = useRef<any>(null)
    const {signUpMessage , setSignUpMessage} = useContext(SignUpContext)
    const [isLogin , setIsLogin] = useState(false)
    const [loginDetail,setLoginDetail] = useState({
        email: '',
        password: '',
    })

    const SignInHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value,name} = e.target
        setLoginDetail(prev => ({...prev , [name]: value}))
    }
    const password_show_hide = (action:string) => {
        if(action === 'show') {
            passwordRef.current?.setAttribute('type','text')
            setIsPassword(true)
        } else {
            passwordRef.current?.setAttribute('type','password')
            setIsPassword(false)
        }
    }
    const sign_in = async (e:any) => {
        e.preventDefault()
        setIsLogin(true)
        try {
            const user = await signInWithEmailAndPassword(auth , loginDetail.email , loginDetail.password)
            setIsLogin(false)
            navigate('/myworkf1')
        }
        catch(e:any) {
            const errorMessage = e.message;
            const errorCode = errorMessage.split(':').pop().trim(); // Extract the last part and remove leading/trailing whitespace
            console.log(errorCode);
            setError(errorCode)
            setIsLogin(false)
        }
        return false;
    }
    const close_error = () => {
        setError("")
    }
  return (
    <section className='sign_in_page'>
        <form action="" onSubmit={(e) => sign_in(e)} className="sign_in_form">
            <div className="sif_header_text">
                <span>SIGN IN</span>
            </div>
            <div className="sip_messages">
                {
                  signUpMessage  ?
                    <div className="sp_message">
                <span>{signUpMessage}</span>
                <span 
                onClick={() => setSignUpMessage()}
                className="close_sp_message">
                    &times;
                </span>
                </div> : ''
                }
                <div className="sip_error_message_container">
                    {error? 
                    <div className="sip_error_message_wrapper">
                        <span className="sipe_message">{error}</span>
                        <span 
                        onClick={close_error}
                        className="sipe_close_err">&times;</span>
                    </div> : ''
                    }
                </div>
            </div>
            <div className="sip_inp_container">
                <label htmlFor="email">Email</label>
                <input 
                type="email" 
                id="email"
                name="email"
                value={loginDetail.email}
                onChange={(e) => SignInHandler(e)}
                />
            </div>
            <div className="sip_inp_container">
                <label htmlFor="password">Password</label>
                <div className="sif_password_container">
                <input 
                ref={passwordRef}
                value={loginDetail.password}
                type="password" 
                onChange={(e) => SignInHandler(e)}
                name="password"
                id="password" />
                {isPassword ? 
                    <i className="fa-regular fa-eye-slash"
                    onClick={() => password_show_hide("hide")}
                    ></i> 
                    : 
                    <i className="fa-regular fa-eye hide"
                    onClick={() => password_show_hide("show")}
                    ></i>
                    }
                </div>
            </div>
            <button
            style={{opacity: isLogin ? '.5' : '1'}}
            disabled={isLogin}>
                {isLogin ? "SIGNING IN ..." : "SIGN IN"}
            </button>
            <div className="sif_sign_in_link">
                <p>
                    <span>don't have an account?</span>
                    <Link to={"/sign_up"}>Sign Up</Link>
                </p>
            </div>
        </form>
    </section>
  )
}

export default SignInPage