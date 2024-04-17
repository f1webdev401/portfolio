import { createContext , useState } from "react";
import { db } from "../firebase-config";
import { getDocs,collection,query,where ,orderBy} from "firebase/firestore";

import UserContext from "./UserContext";
import { useContext } from "react";



const CrudContext = createContext<any|null>(null)

export const CrudProvider = ({children}:{children: React.ReactNode}) => {
    const [todoList,setTodolist] = useState<any>()

    const {user} = useContext(UserContext)

    const userId = user && user.uid

    const todolistCollection = collection(db , "todo_list")
    const q = query(todolistCollection , where('userId' , '==' ,userId) , orderBy('timestamp','desc'))
    const getTodoList = async () => {
        try {
            const data = await getDocs(q)
            const filteredData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTodolist(filteredData)
        } catch(e) {
            console.log(e)
        }
    }

    return <CrudContext.Provider value={{getTodoList,todoList ,setTodolist}}>
        {children}
    </CrudContext.Provider>
}



export default CrudContext