import React from 'react'
import '../assets/css/myWorks/NeedToLoginMessage.css'
import { Link } from 'react-router-dom'
const NeedToLoginMessage = () => {
  return (
    <section className='ntlm_container'>
        <div className="need_login_message">
            <span>YOU NEED TO LOGIN !</span>
            <Link to={'/sign_in'}>Login Now</Link>
        </div>
    </section>
  )
}

export default NeedToLoginMessage