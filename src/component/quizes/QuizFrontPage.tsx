import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import '../../assets/css/myWorks/quiz/QuizFrontPage.css'
interface Quiz {
    title: string,
    id: number
}
const QuizFrontPage = () => {
    const [saveQuiz,setSavedQuiz] = useState<Quiz[]>([])
    
    useEffect(() => {
        let saveQuizesString = localStorage.getItem("quizes");
    let saveQuizes = saveQuizesString ? JSON.parse(saveQuizesString) : [];
        setSavedQuiz(saveQuizes)
    },[])
    const DeleteQuizHandler = (id:any) => {
        console.log(saveQuiz)
        let newSaveQuiz = saveQuiz.filter((_:any,index:any) => index !== id)
        console.log(newSaveQuiz)
        localStorage.setItem("quizes", JSON.stringify(newSaveQuiz));
        setSavedQuiz(newSaveQuiz)
        
    }
  return (
    <>
     <div className="create_quiz_link_wrapper">
    <Link to='create_quiz'>CREATE QUIZ <i className="fa-solid fa-plus"></i></Link>
    </div>

    <div>
        <div className="title_quiz">
            <h1>CREATED QUIZ LIST</h1>
        </div>
        <div className="quiz_list">
            <ul>
                {saveQuiz.length === 0 ? 
                    <div className="no_quiz_text">
                        <span>
                            No quiz &times;
                        </span>
                    </div> :
                saveQuiz.map((quiz,index) => (
                <li key={index}>
                <Link to={`try_quiz/${quiz.id}`}>{quiz.title}</Link>
                <button onClick={() => DeleteQuizHandler(index)}>&times;</button>
                </li>
                ))
            }
            </ul>
        </div>
    </div>
    </>
    
  )
}

export default QuizFrontPage
