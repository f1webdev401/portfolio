import React, { useState , useEffect } from 'react'
import { useContext } from 'react'
import CrudContext from '../CrudContext'
import { CSSProperties } from 'react'
import { db } from '../../firebase-config'
import { doc , deleteDoc  , updateDoc} from 'firebase/firestore'
import CrudLoading from './CrudLoading'
const CrudActive= () => {
  const {todoList,getTodoList ,setTodolist} = useContext(CrudContext)
  const [loading,setIsLoading] = useState(true)
  const [targetEdit,setTargetEdit] = useState("")
  const [isUpdating,setIsUpdating] = useState(false)
  let editStyle:CSSProperties = {
    outline: '1px solid black',
    border: '1px solid black',
    pointerEvents: 'auto',
    height: '40px',
    paddingLeft: '10px'
  }
  useEffect(() => {
    const fetchData = async () => {
      await getTodoList();
      setIsLoading(false);
    };

    fetchData();
  }, [loading]);

  const DeleteTodo = async(docId:any) => {
    setIsLoading(true)
    try {
      const documentRef = doc(db,'todo_list',docId)
      await deleteDoc(documentRef)
    }
    catch(e) {
    }
  }

  const EditTodoHandler = (e:any,index:any) => {
    const {value} = e.target
    let newTodoList = [...todoList]
    newTodoList[index].todo_title = value
    setTodolist(newTodoList)
  }

  const EditTodo = async (target:any) => {
    setTargetEdit(target)
  }
  const ConfirmEditTodo = async (index:any) => {
    setIsUpdating(true)
      try {
        // Reference the document to edit
        const documentRef = doc(db, 'todo_list', targetEdit);
    
        // Update the document with new data
        await updateDoc(documentRef, {todo_title:todoList[index].todo_title});
    
        setTargetEdit('')
        setIsUpdating(false)
      } catch (error) {
      }
   
  }
  const MarkCompleteHandler = async (e:any,id:any,index:any) => {
    const {checked } = e.target
    setIsUpdating(true)
    setTargetEdit(id)
    try {
      // Reference the document to edit
      const documentRef = doc(db, 'todo_list', id);
      // Update the document with new data
      await updateDoc(documentRef, {isActive:checked});
      let newTodoList = [...todoList]
    newTodoList[index].isActive = checked
      setTodolist(newTodoList)
      setTargetEdit('')
      setIsUpdating(false)
    } catch (error) {
      console.error('Error updating document:', error);
    }
 
  }
  if(loading) {
    return <div className='crud_loader'> <CrudLoading /></div> 
   }
  return (
    <>
    {todoList ? todoList.map((todo:any,index:any) => (
          todo.isActive === false?
        <div  key={index} className='todo_list_item'>
          {
            todo.id === targetEdit && isUpdating === true?
            <div className="ca_updating">
            <span>UPDATING...</span>
          </div>
          : ''
          }
          <input 
          checked={todo.isActive}
          onChange={(e) => MarkCompleteHandler(e,todo.id,index)}
          type="checkbox"/>
          <input 
          style={todo.id === targetEdit ? 
            { ...editStyle, textDecoration: todo.isActive ? 'line-through' : '' } 
            : { textDecoration: todo.isActive ? 'line-through' : '' }}
          className='inp_list_item'
          type="text" 
          id={todo.id}
          onChange={(e) => EditTodoHandler(e , index)}
          value={todo.todo_title}/>
          
          <div className='list_item_action'>
          {todo.id === targetEdit ? 
          <i className="fa-solid fa-check" onClick={() => ConfirmEditTodo(index)}></i>
          :
          <i
          onClick={() => EditTodo(todo.id)}
          className="fa-solid fa-pen-to-square"></i>
        }
          <i
          onClick={() => DeleteTodo(todo.id)}
          className="fa-solid fa-trash"></i>
          </div>
        </div> : ''
        ) 
        ) : 'loading'}
    </>
  )
}

export default CrudActive