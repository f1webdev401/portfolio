import { createContext , useState } from "react";


const StreamContext = createContext<any|null>(null)


export const StreamProvider = ({children}: {children: React.ReactNode}) => {
    const [created,setCreated] = useState<any|null>(null)

    return <StreamContext.Provider value={{created,setCreated}}>
        {children}
    </StreamContext.Provider>
}

export default StreamContext