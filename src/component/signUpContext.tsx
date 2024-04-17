import { createContext ,  useState } from "react";

const SignUpContext = createContext<any|null>(null)


export const SignUpProvider = ({children}: {children: React.ReactNode}) => {
    const [signUpMessage,setSignUpMessage] = useState<string | null>("")

    return <SignUpContext.Provider value={{signUpMessage,setSignUpMessage}}>{children}</SignUpContext.Provider>
}

export default SignUpContext