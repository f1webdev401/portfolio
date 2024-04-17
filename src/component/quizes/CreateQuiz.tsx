import { useState , ChangeEvent, useEffect } from "react"
import '../../assets/css/myWorks/quiz/CreateQuiz.css'
import { useNavigate } from "react-router-dom";

function getStorageId () {
    let saveQuizesString = localStorage.getItem("quizes");
    let saveQuizes = saveQuizesString ? JSON.parse(saveQuizesString) : [];
    return saveQuizes.length
}
const CreateQuiz = () => {
    // const [quizList,setQuizList] = useState<any[]>([])
    let saveQuizesString = localStorage.getItem("quizes");
    let saveQuizes = saveQuizesString ? JSON.parse(saveQuizesString) : [];
    const navigate = useNavigate()
    const [cq_error,set_cq_error] = useState('')
    useEffect(() => {
        setQuizes(prevQuiz => ({
            ...prevQuiz,
            id: getStorageId() + 1
        }))
    },[])
    const [quizes,setQuizes] = useState({
            quiz: [
                {
                question:'',
                choices:[''],
                answer: ''
            }],
            title: "",
            id: null,
        })
   
    const AddMoreQuizHandler = () => {
        if(quizes.quiz.length === 5) return ; 
        setQuizes(prevQuiz => ({...prevQuiz,
            quiz: [
                ...prevQuiz.quiz,
            {
                question:'',
                choices:[''],
                answer: ''
            }   
        ]}))
    }
    const AddMoreChoicesHandler = (index:number) => {
        if(quizes.quiz[index].choices.length ===4) return;
        let newQuiz = {...quizes}
        newQuiz.quiz[index].choices.push("")
        setQuizes(newQuiz)
    }
    const AddQueztionInputHandler =(e:any,index:number) => {
        const {value} = e.target
        let newQuiz = {...quizes}
        newQuiz.quiz[index].question = value
        setQuizes(newQuiz)
    }
    const AddChoicesInputHandler = (e:ChangeEvent<HTMLInputElement>,quizIndex:number,ChoiceIndex:number) => {
        
        const {value} = e.target
        const newQuiz  = {...quizes}
        newQuiz.quiz[quizIndex].choices[ChoiceIndex] = value
        setQuizes(newQuiz)
    }
    const AnswerInputHandler = (e:ChangeEvent<HTMLSelectElement>,quizIndex:number) => {
        const {value} = e.target
        setQuizes(prevQuizes => {
            let newQuiz = {...prevQuizes}
            newQuiz.quiz[quizIndex].answer = value
            return newQuiz
        })
    }
    const AddTitleInputHandler =(e:any) => {
        const {value} = e.target
        setQuizes(prevQuiz => ({
            ...prevQuiz,
            title: value
        }))
    }

    const RemoveQuiz = (id:any) => {
        if(quizes.quiz.length === 1) return;
        let newQuiz = {...quizes}
        newQuiz.quiz = newQuiz.quiz.filter((_,index) => index !== id)
        setQuizes(newQuiz)
    }
    const SaveQuizHandler = () => {
        if(quizes.title === '') {
            set_cq_error("Add Title")
        }
        for(let i = 0; i < quizes.quiz.length ; i++) {
            if(quizes.quiz[i].question === '') {
            set_cq_error(`Add Question to (${i + 1})`)
            }
            if(quizes.quiz[i].answer === '') {
                set_cq_error(`Add Answer to (${i + 1})`)
            }
            if(quizes.quiz[i].choices.length < 2) {
                set_cq_error(`Choice must be more than one   (${i + 1})`)
            }
            for(let j = 0 ; j < quizes.quiz[i].choices.length ; j ++) {
                if(quizes.quiz[i].choices[j] === '') {
                    set_cq_error(`Add Answer choice to (${i + 1})`)
                }
            }
        }
        if(getStorageId() === 5) return
        
    setQuizes(prevQuiz => ({
        ...prevQuiz,
        id: getStorageId() + 1
    }))
    saveQuizes.push(quizes);
    localStorage.setItem("quizes", JSON.stringify(saveQuizes));
    navigate('/myworkf1/quiz_app')
    }
  return (
       
        <div className='add_quiz_container'>
            {
                cq_error && 
            <div className="aqc_err_container">
                <span>{cq_error}</span>
                <i className="fa-solid fa-xmark"
                    onClick={() => set_cq_error('')} 
                ></i>
            </div>
            }
            <div className="add_quiz_title">
                <span>ADD QUIZ TITLE</span>
                <input 
                value={quizes.title}
                onChange={(e) => AddTitleInputHandler(e)}
                type="text" />
            </div>
            {
            quizes.quiz.map((quiz_,quizIndex) => (
            <div className="quiz_wrapper" key={quizIndex}>
                <button onClick={() => RemoveQuiz(quizIndex)} className="qw_remove_quiz">Remove</button>

            <div className="add_question">
            <label htmlFor="question">({quizIndex + 1}) ADD QUESTION</label>
            <input 
            value={quizes.quiz[quizIndex].question}
            type="text" 
            id='question' 
            onChange={(e) => AddQueztionInputHandler (e,quizIndex)}/>

            </div>
            <div className="quiz_choices">
                <span className="add_choices_txt">ADD ANSWER CHOICES</span>
                {quiz_.choices.map((choice,choiceIndex) => (
                    
                    <div className="choice_list" key={choiceIndex}>
                    <span>
                    {(()=> {
                        switch(choiceIndex) {
                            case 0:
                                return "A.";
                            case 1:
                                return "B.";
                                case 2:
                                    return "C.";
                                    case 3:
                                        return "D.";
                                    }
                                })()}
                    </span>
                    <input
                        key={choiceIndex} 
                        type="text" 
                        value={choice}
                        onChange={(e) => AddChoicesInputHandler(e,quizIndex,choiceIndex)}
                        />
                    </div>
                ))}
                <button disabled={quiz_.choices.length === 4} onClick={()=>AddMoreChoicesHandler(quizIndex)}>+</button>
            </div>
            <div className="add_answer">
                <label htmlFor="answer">ADD ANSWER</label>
                {/* <input 
                    type="text" 
                    onChange={(e) => AnswerInputHandler(e,quizIndex)}    
                    value={quiz_.answer}
                /> */}
                <select name="" id=""  onChange={(e) => AnswerInputHandler(e,quizIndex)} >
                    <option value="">CHOOSE CORRECT ANSWER</option>
                    {quiz_.choices.map((answer,index) => (
                        <option key={index} value={answer}>{answer}</option>
                    ))}
                </select>
            </div>
            </div>
                ))
            }
            <div className="add_save_quiz">
            <button onClick={AddMoreQuizHandler} className="add_more_quiz_btn">ADD MORE QUIZ</button>
            <button className="save_quiz_btn" onClick={SaveQuizHandler}>SAVE QUIZ</button>
            </div>
        </div>

  )
}

export default CreateQuiz