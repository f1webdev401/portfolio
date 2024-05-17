import { useEffect, useRef, useState } from 'react'
import {io} from 'socket.io-client'
import '../../../assets/css/myWorks/livestream/ViewerStream.css'
import { useParams } from 'react-router-dom'
const socket = io('https://livestream-server-qhcr.onrender.com')
// const socket = io('http://localhost:4000')

const ViewerStream = () => {
  let iceServers = {
    iceServers: [
      {urls: "stun:stun2.l.google.com:19302"},
      {urls: "stun:stun3.l.google.com:19302"}
    ]
  }
  let rtcPeerConnections : any = {}
  const {id,v_id,name} = useParams()
  const [messageTxt,setMessageTxt] = useState('')
  const [allMessage,setAllMessage] = useState<any>([])
  const viewerStreamVideo = useRef<any>(null)
  const [viewers,setViewers] = useState<any>('')
  const SendMessageBtn = (e:any) => {
    e.preventDefault()
    socket.emit('message',messageTxt,id)
    setMessageTxt('')
  }
   useEffect(() => {
    socket.emit('join-stream',id ,v_id)
    return () => {
      socket.off('join-stream');
    };
   },[]) 
  useEffect(() => {
    socket.on('connect',() => {

      socket.on('receive-message', (message) => {
        console.log(message);
        setAllMessage((prev: any) => [...prev, message]);
      });

      socket.emit('register as viewer',{id,v_id,name})
      socket.on('offer',(broadcaster,sdp) => {
        console.log(broadcaster)
        rtcPeerConnections[broadcaster.id] = new RTCPeerConnection(iceServers)
        rtcPeerConnections[broadcaster.id].setRemoteDescription(sdp)
        rtcPeerConnections[broadcaster.id]
        .createAnswer()
        .then((sessionDescription:any) => {
          rtcPeerConnections[broadcaster.id].setLocalDescription(sessionDescription);
          socket.emit('answer',{
            type:'answer',
            sdp:sessionDescription,
            room: id
          })
        });

        rtcPeerConnections[broadcaster.id].ontrack = (event:any) => {
          viewerStreamVideo.current.srcObject = event.streams[0]
        };
        rtcPeerConnections[broadcaster.id].onicecandidate = (event:any) => {
          if(event.candidate) {
            console.log("sending ice candidate");
            socket.emit("candidate", broadcaster.id, {
              type: "candidate",
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate,
            });
          }
        }
      });
      socket.on("candidate", function (id, event) {
        var candidate = new RTCIceCandidate({
          sdpMLineIndex: event.label,
          candidate: event.candidate,
        });
        rtcPeerConnections[id].addIceCandidate(candidate);
      });

     
      socket.on('viewers',(n) =>{
        setViewers(n)
        
        console.log(rtcPeerConnections)
      })
    })
   
    return () => {
      socket.off('receive-message');
      socket.off('register as viewer');
      socket.off('connect');
      socket.off('candidate')
      socket.off('offer')
      socket.off('viewers')
    };
  }, []);
  return (
    <section className='vs_container'>
      <div className="vs_video_container">
      <video src="" ref={viewerStreamVideo} autoPlay muted playsInline></video>
      </div>
      <div>
        {viewers ? 
        <p>viewers: {viewers}</p> : ''  
      }
      </div>
      <div className="vs_video_react_btn">
        <button>Like</button>
        <button>Heart</button>
      </div>
      <div className="vs_chat_container">
        <div className="vs_chat_messages">
          {allMessage.map((msg:string , index:number) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
        <form onSubmit={(e) => SendMessageBtn(e)} className="vs_chat_action">
          <input
          onChange={(e) => setMessageTxt(e.target.value)}
          value={messageTxt}
          type="text" />
          <button>Send</button>
        </form>
      </div>
    </section>
  )
}

export default ViewerStream