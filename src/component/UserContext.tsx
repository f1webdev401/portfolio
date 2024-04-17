import { createContext , useState } from "react";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext<any|null>(null)

interface User {
    uid: string;
    email: string | null ;
    displayName: string | null;
    photoURL?: string | null ;
  }

export const UserProvider = ({children}:{children: React.ReactNode}) => {
    const [user,setUser] = useState<User | null>(null)
onAuthStateChanged(auth , (currentUser) => {
    setUser(currentUser)
})
return <UserContext.Provider value={{user,setUser}}>
{children}
</UserContext.Provider>
}

export default UserContext