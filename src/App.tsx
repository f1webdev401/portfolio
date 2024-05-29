import { Outlet } from "react-router-dom";
import Navbar from "./component/Navbar";
import './App.css'
import Footer from "./component/Footer";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { auth } from "./firebase-config";
import { HelmetProvider } from "react-helmet-async";
import CursorEffect from "./pages/CursorEffect";
interface User {
  uid: string;
  email: string | null ;
  displayName: string | null;
}
function App() {
  const [user , setUser] = useState<User | null>(null)

  onAuthStateChanged(auth , (currentUser) => {
    setUser(currentUser)
  })
  return (
    <>
    <HelmetProvider>
      <CursorEffect/>
      <main className="main_app">
        <Navbar user={user}/>
        <Outlet/>
        <Footer />
      </main>
    </HelmetProvider>
    </>
  );
}

export default App;
