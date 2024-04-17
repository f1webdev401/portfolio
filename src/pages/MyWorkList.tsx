import { Link } from 'react-router-dom'
import '../assets/css/MyWorkList.css'
import TodoImg from '../assets/images/my_works/todo_img.png'
import ChatImg from '../assets/images/my_works/chat_img.png'
import CalcImg from '../assets/images/my_works/calculator_img.png'
import QuizImg from '../assets/images/my_works/quiz_app_img.png'
import EcomImg  from '../assets/images/my_works/ecommerce_img.png'

const MyWorkList = () => {
  return (
    <>
    {/* <div>
      <h1>Projects</h1>
    </div> */}
    <div className='mywork_list_wrapper'>        
    {[['CALCULATOR','calculator',CalcImg],['QUIZ','quiz_app',QuizImg],['CHAT','chat_app',ChatImg] , ['CRUD','crud_app',TodoImg],['ECOMMERCE','https://f1webdev.github.io/sample_ecommerce/index.html',EcomImg]].map((list,index) => (
        <Link to={`${list[1]}`} key={index}className='work_container'>
        <div className="mywork_image" key={index}>
        <img src={list[2]} alt="" />
        </div>
        <h1>{list[0]}</h1>
        </Link>
    ))}
    </div>
    </>
  )
}

export default MyWorkList