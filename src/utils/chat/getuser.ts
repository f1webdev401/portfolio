import { collection , query, getDocs , where } from "firebase/firestore";
import { db } from "../../firebase-config";
export default async function getUser (user:any,setData:any) {
    if(user) {
        const userCollection = collection(db ,'users')
        const querySnapShot = await getDocs(query(userCollection ,where('userId','==',user.uid)))
        const doc = querySnapShot.docs[0]
        if(doc.data().friends) {
            let data =  doc.data().friends.map((u_:any) => u_.user)
            // console.log(user)
            setData(data)
        }else {
            setData(null)
        }
    }
}

