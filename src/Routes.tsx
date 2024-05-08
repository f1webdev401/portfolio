import { createBrowserRouter , RouterProvider } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import MyWorkPage from "./pages/MyWorkPage";
import MyWorkList from "./pages/MyWorkList";
import Calculator from "./pages/myWorks/Calculator";
import QuizApp from "./pages/myWorks/QuizApp";
import QuizFrontPage from "./component/quizes/QuizFrontPage";
import CreateQuiz from "./component/quizes/CreateQuiz";
import TryQuiz from "./component/quizes/TryQuiz";
import ChatApp from "./pages/myWorks/ChatApp";
import CrudApp from "./pages/myWorks/CrudApp";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import Ecommerce from "./pages/myWorks/Ecommerce";

import { SignUpProvider } from "./component/signUpContext";
import { UserProvider } from "./component/UserContext";
import CrudAll from "./component/crud/CrudAll";
import CrudActive from "./component/crud/CrudActive";
import CrudCompleted from "./component/crud/CrudCompleted";
import { CrudProvider } from "./component/CrudContext";
import MessagesContainer from "./component/chatapp/MessagesContainer";
import { ChatAppProvider } from "./assets/Context/ChatAppContext";
import StartChatNow from "./component/chatapp/StartChatNow";
import ProfilePage from "./pages/ProfilePage";
import UserProfile from "./pages/UserProfile";
import ProfileFriends from "./component/profile/ProfileFriends";
import ProfileFriendRequest from "./component/profile/ProfileFriendRequest";
import ChatAppBox from "./component/chatapp/ChatAppBox";
import FindFriends from "./component/chatapp/FindFriends";
import Contacts from "./pages/Contacts";
import PaymentIntegration from "./pages/myWorks/PaymentIntegration";
import Pi_Test_Cart from "./component/paymenyintegration/Pi_Test_Cart";
import Pi_Checkout from "./component/paymenyintegration/Pi_Checkout";
import Pi_Success_Payment from "./component/paymenyintegration/Pi_Success_Payment";
import LiveStream from "./pages/myWorks/livestream/LiveStream";
const router = createBrowserRouter([
    {
        path: '/',
        element:( 
        <SignUpProvider>
            <UserProvider>
                <App />
            </UserProvider>
        </SignUpProvider>
        ),
        children: [
            {
                path: '',
                element: <LandingPage />
            } , 
            {
                path: 'myworkf1',
                element: <MyWorkPage/>,
                children: [
                    {
                        path: '',
                        element: <MyWorkList/>
                    } ,
                    {
                        path: 'calculator',
                        element: <Calculator />
                    },
                    {
                        path: 'quiz_app',
                        element: <QuizApp/>,
                        children: [
                            {
                                path:'',
                                element:<QuizFrontPage/>
                            },
                            {
                                path: 'create_quiz',
                                element: <CreateQuiz />
                            },
                            {
                                path: 'try_quiz/:id',
                                element: <TryQuiz />
                            }
                        ]
                    }, 
                    {
                        path: 'chat_app',
                        element: (
                            <ChatAppProvider>
                        <ChatApp />
                            </ChatAppProvider>
                        
                        ),
                        children: [
                            {
                                path: '',
                                element: <ChatAppBox />,
                                children: [
                                    {
                                        path: '',
                                        element: <StartChatNow />
                                    },
                                    {
                                            path: ':id',
                                            element: <MessagesContainer />
                                        }
                                ]
                            },
                            {
                                path: 'findfriends',
                                element: <FindFriends />
                            },
                            {
                                path: 'userprofile/:id',
                                element: <UserProfile/>
                            },
                            {
                                path: 'profile',
                                element: <ProfilePage />,
                                children: [
                                    {
                                        path: '',
                                        element: <ProfileFriends />
                                    } , 
                                    {
                                        path: 'friendrequest',
                                        element: <ProfileFriendRequest />
                                    }
                                ]
                            }
                            
                        ]
                    },
                    {
                        path: 'crud_app',
                        element: (
                        <CrudProvider>
                            <CrudApp />
                        </CrudProvider>
                        ),
                        children: [
                            {
                                path: '' ,
                                element: <CrudAll />
                            } ,
                            {
                                path: 'active',
                                element: <CrudActive />
                            } ,
                            {
                                path: 'completed',
                                element: <CrudCompleted />
                            }
                        ]
                    } ,
                    {
                        path: 'ecommerce',
                        element: <Ecommerce />
                    },
                    {
                        path: 'paymentintegration',
                        element: <PaymentIntegration />,
                        children: [
                            {
                                path: '',
                                element: <Pi_Test_Cart />
                            },
                            {
                                path: 'checkout',
                                element: <Pi_Checkout />
                            },
                            {
                                path:'success',
                                element: <Pi_Success_Payment />
                            }
                        ]
                    },
                    {
                        path: 'livestream',
                        element: <LiveStream />
                    }
                ]
            } ,
            {
                path: 'sign_up',
                element: <SignUpPage />
            },
            {
                path: 'sign_in',
                element: <SignInPage />
            }, 
            {
                path:'profile',
                element: <ProfilePage />,
                children: [
                    {
                        path: '',
                        element: <ProfileFriends />
                    } , 
                    {
                        path: 'friendrequest',
                        element: <ProfileFriendRequest />
                    }
                ]
            },
            {
                path: 'contacts',
                element: <Contacts />
            }
            
        ]
    }
])

export function Routes() {
    return <RouterProvider router={router}/>
}