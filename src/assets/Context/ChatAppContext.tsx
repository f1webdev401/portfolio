import { createContext , useState } from "react";


const ChatAppContext = createContext<any|null>(null)


export const ChatAppProvider = ({children}: {children: React.ReactNode}) => {
    const [chatPerson,setChatPerson] = useState<any|null>(null)


    return <ChatAppContext.Provider value={{chatPerson,setChatPerson}}>
        {children}
    </ChatAppContext.Provider>
}

export default ChatAppContext