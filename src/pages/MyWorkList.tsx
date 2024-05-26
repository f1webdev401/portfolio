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
    {[['CALCULATOR','calculator',CalcImg],['QUIZ','quiz_app',QuizImg],['CHAT','chat_app',ChatImg] , ['CRUD','crud_app',TodoImg],['ECOMMERCE','https://f1webdev.github.io/sample_ecommerce/index.html',EcomImg],['PAYMENT INTEGRATION','paymentintegration',"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeOCdubBqCkaWXZq6wn9Zx_XjeYyFYvNgQga9pWRJOnQ&s"],['LIVE STREAM','livestream',"https://zoomcorp.com/media/original_images/Set_Up_Livestream_Header.jpg.1600x900_q65_crop_focal_area-810%2C450%2C1620%2C900_size_canvas.jpg"]].map((list,index) => {
      if(list[1] === 'livestream') {
        return <a href={`/myworkf1/${list[1]}`} key={index}className='work_container'>
        <div className="mywork_image" key={index}>
        <img src={list[2]} alt="" />
        </div>
        <h1>{list[0]}</h1>
        </a>
      }
      return  <Link to={`${list[1]}`} key={index}className='work_container'>
        <div className="mywork_image" key={index}>
        <img src={list[2]} alt="" />
        </div>
        <h1>{list[0]}</h1>
        </Link>
})}
    </div>
    </>
  )
}

export default MyWorkList