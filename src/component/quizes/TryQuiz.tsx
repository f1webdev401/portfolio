import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../../assets/css/myWorks/quiz/TryQuiz.css'
interface Quiz {
    id: string,
    title: string,
    quiz: any,
}
const TryQuiz = () => {
    const params = useParams<{id:string}>()
    const id = params.id
    const [answer,setAnswer] = useState<{[key:number]:string}>({})
    const [quiz,setQuizes] = useState<Quiz | null >()
    const [submitted,setSubmitted] = useState(false)
    const [loading,setLoading] = useState(true)
    const [submittedQuiz,setSubmittedQuiz] = useState<any>(false)
    const [score,setScore] = useState(0)
    useEffect(() => {
        let getQuiz = localStorage.getItem("quizes")
        let parse_quiz : Quiz[] = getQuiz ? JSON.parse(getQuiz) : []
        let findQuiz = parse_quiz.find(quiz => quiz.id.toString() === id)
        setQuizes(findQuiz)
        
        setAnswer(_  => 
            {   
                let quiz : any = {} 
                for(let i = 0; i<findQuiz?.quiz.length ; i ++) {
                    quiz[i] = ''
                }
                return quiz
            })
        let answerQuizInStorage = localStorage.getItem(`quiz_${id}`)
        let parse_answerQuizInStorage = answerQuizInStorage ? JSON.parse(answerQuizInStorage) : false
        setSubmittedQuiz(parse_answerQuizInStorage)
        let quizScore = localStorage.getItem(`quiz_${id}_score`)
        let parseQuizScore = quizScore ? JSON.parse(quizScore) : 0
        setScore(parseQuizScore)
    },[])
    const SubmitAnswer = () => {
        if(submitted || submittedQuiz !== false) {
            setSubmitted(false)
            setSubmittedQuiz(false)
            setAnswer({})
            setScore(0)
            localStorage.removeItem(`quiz_${id}`)
            localStorage.removeItem(`quiz_${id}_score`)
        } else {

            let answer_res   = 0
            for(let i = 0 ; i <quiz?.quiz.length ; i ++) {
                if(quiz?.quiz[i].answer === answer[i]) {
                    answer_res += 1
                    setScore(prev => prev + 1) 
                }
            }
            localStorage.setItem(`quiz_${id}_score`,JSON.stringify(answer_res))
            localStorage.setItem(`quiz_${id}`,JSON.stringify(answer))
            setSubmitted(true)
        }
    }
    const AddAnswerInput = (e:any,index:number) => {
        const {value} = e.target
        setAnswer(prevAnswer => ({...prevAnswer,[index]:value}))
    }
    useEffect(() => {
        setLoading(false)
    },[])
    if(loading) {
        return <div>Loading ...</div>
    }
  return (
        <div className='try_quiz_container'>
            <h2 className='quiz_title'>
            {quiz && quiz.title}
            </h2>
          <div className='score_wrapper'>
            <span className="quiz_score">
            {submitted || submittedQuiz !== false ? `SCORE: ${score}/${quiz?.quiz.length}`:''}
            </span>
          </div>
        <div className='questions'>
    {quiz && quiz.quiz.map((question: any, questionIndex: number) => (
        <div key={questionIndex} className='quiz_qustion_wrapper'>
            <div className='question_text'>
                <span>
                {question.question[-1] === '?' ? question.question : `${question.question} ?`}
                </span>
            </div>

            {
                 submitted || submittedQuiz !== false ? 
                question.choices.map((choice: string, choiceIndex: number) => (
                    <div key={choiceIndex} className='question_choices'
                    style={{backgroundColor: (submittedQuiz[questionIndex] === choice || answer[questionIndex] === choice) ?
                        ((submittedQuiz[questionIndex] === question.answer || answer[questionIndex] === question.answer) ? '#21F701' : '#F73131') :
                        (question.answer === choice ? '1px solid green' : ''),border: question.answer === choice ? '1px solid green' : ''}}
                    >
                    
                    <input 
                    disabled={true}
                    onChange={(e) => AddAnswerInput(e,questionIndex)}
                    type="radio" name={`question_${questionIndex}`} id={`choice_${questionIndex}_${choiceIndex}`} value={choice} checked={choice === submittedQuiz[questionIndex] || choice === answer[questionIndex]}/>
                    <label htmlFor={`choice_${questionIndex}_${choiceIndex}`}>{choice}</label>

                    {/* {submittedQuiz[questionIndex] === choice || answer[questionIndex] === choice  ? 
                    submittedQuiz[questionIndex] === question.answer || answer[questionIndex] === question.answer ? "correct" : "wrong" :question.answer === choice? 'this is the correct answer': ''   
                    } */}
                    {/* {choice === answer[questionIndex]} */}
                    {/* {answer[questionIndex] === choice ? 'true': 'false'} */}
                    </div>
        )) :
        question.choices.map((choice: string, choiceIndex: number) => (
                    
            <div key={choiceIndex} className='question_choices'>
            <input 
            onChange={(e) => AddAnswerInput(e,questionIndex)}
            type="radio" name={`question_${questionIndex}`} id={`choice_${questionIndex}_${choiceIndex}`} value={choice} />
            <label htmlFor={`choice_${questionIndex}_${choiceIndex}`}>{choice}</label>
            </div>
        ))}
            
        </div>
    ))}
    <div className='sub_try_again'>
        <button onClick={SubmitAnswer}>{submitted || submittedQuiz !== false ? "Try again": "SUBMIT"}</button>
    </div>
</div>
        </div>
  )
}

export default TryQuiz