import { Link, Outlet } from "react-router-dom"
import '../../assets/css/myWorks/QuizApp.css'
import { useState } from "react"


const QuizApp = () => {
    const [state,setState] = useState([" Lorem ipsum dolor sit amet."," Lorem ipsum dolor sit amet."," Lorem ipsum dolor sit amet."," Lorem ipsum dolor sit amet."," Lorem ipsum dolor sit amet."])
  return (
    
    <div className="quiz_app_page">
        <div className="quiz_app_title">
            <h1>QUIZ APP</h1>
        </div>

        <Outlet />
    </div>
  )
}

export default QuizApp