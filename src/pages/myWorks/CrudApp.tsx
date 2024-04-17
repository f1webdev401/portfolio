import React, { useState } from 'react'
import '../../assets/css/myWorks/CrudApp.css'
import { Outlet , NavLink} from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth ,db } from '../../firebase-config'
import UserContext from '../../component/UserContext'
import { useContext } from 'react'
import { collection } from 'firebase/firestore'
import { addDoc ,Timestamp} from 'firebase/firestore'
import CrudContext from '../../component/CrudContext'
import NeedToLoginMessage from '../../component/NeedToLoginMessage'
const CrudApp = () => {
  const {getTodoList} = useContext(CrudContext)
  const {user,setUser} = useContext(UserContext)
  const userId = user && user.uid
  const [todoTitle, setTodoTitle] = useState('')
  const [isSubmit,setIsSubmit] = useState(false)
  const todolistCollection = collection(db,'todo_list')
   const AddTodolist = async(e:any) => {
    e.preventDefault()
    if(isSubmit) {
      return false
    }
    setIsSubmit(true)
    try {
      const timeStamp = Timestamp.now()
      await addDoc(todolistCollection, {
        userId: userId,
        todo_title: todoTitle,
        isActive:false,
        timestamp: timeStamp,
      })
     
      getTodoList()
      setIsSubmit(false)
      setTodoTitle('')
    }catch(e) {
      console.log(e)
    }
}

  return (
    <main className='ca_page'>
      <section className='cap_todo_container'>
        <div className="cap_todo_bg">
        </div>
        <div className="cap_todo_wrapper">
          {!userId ? <NeedToLoginMessage /> : ''}
          <form onSubmit={(e) => AddTodolist(e)} action="" className='cap_todo_form'>
            <input 
            onChange={(e) => setTodoTitle(e.target.value)}
            value={todoTitle}
            type="text" 
            placeholder='Create Todo'/>
            <button><i className="fa-solid fa-plus"></i></button>
          </form>
          <div className="todo_list">
            <Outlet/>
          </div>
          <div className="cap_todo_action">
            <div>
            <NavLink 
            to='' 
            style={({ isActive}) => {
              return {
                backgroundColor: isActive ? '#834395' : ''
              };
            }}
            end
            >
            All
            </NavLink>
            <NavLink
            to={'active'}
            style={({ isActive}) => {
              return {
                backgroundColor: isActive ? '#834395' : ''
              };
            }}
            end
            >
            Active
            </NavLink>
            <NavLink
            to={'completed'}
            style={({ isActive}) => {
              return {
                backgroundColor: isActive ? '#834395' : ''
              };
            }}
            end>
            Completed
            </NavLink>
            </div>
          </div>
          {isSubmit &&

            <div className="is_submitting">
              <span>Adding Todo List ...</span>
          </div>
          }
        </div>  
      </section>      
    </main>
  )
}

export default CrudApp