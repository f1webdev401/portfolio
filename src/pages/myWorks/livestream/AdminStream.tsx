import { useEffect, useState  , useCallback, useRef} from 'react'
import '../../../assets/css/myWorks/livestream/AdminStreamer.css'
import { useParams } from 'react-router-dom'
import { io } from "socket.io-client";
// const socket = io('https://livestream-server-qhcr.onrender.com',{'multiplex':false})
const socket = io('http://localhost:4000',{'multiplex':false})
const AdminStream = () => {
  let iceServers = {
    iceServers: [
      {urls: "stun:stun2.l.google.com:19302"},
      {urls: "stun:stun3.l.google.com:19302"}
    ]
  }
  let rtcPeerConnections: any = {}
  const [streamerMsg,setStreamerMsg] = useState('')
  const [allMessage,setAllMessage] = useState<any>([])
  const [joinedViewer,setJoinedViewer] = useState<any>([])
  const {id,name,caption} = useParams()
  const [s_id,setSid] = useState<any>('')
  const streamVideo = useRef<any>(null)
  const [viewers,setViewers] = useState<any>(0)
  const StreamerSendMessage = (e:any) => {
    e.preventDefault()
    socket.emit('message',streamerMsg,id)
    setStreamerMsg('')
  }
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { facingMode: 'user' }
    })
    .then((stream) => {
      console.log(stream)
      streamVideo.current.srcObject = stream
      socket.emit('register as broadcaster',id)
    })
    .catch(function (err) {
      console.log("An error ocurred when accessing media devices", err);
    });
    socket.on('connect',() => {
      socket.emit('create-stream',{id,name,caption})
      socket.on('receive-message', (message) => {
        setAllMessage((prev: any) => [...prev, message]);
      });

      socket.on('new viewer',(viewer) => {
        rtcPeerConnections[viewer.v_id] = new RTCPeerConnection(iceServers);
        console.log(rtcPeerConnections,'new viewer on streamer page')
        const stream = streamVideo.current.srcObject
        stream
        .getTracks()
        .forEach((track:any) => rtcPeerConnections[viewer.v_id].addTrack(track, stream));
        console.log(stream)
        rtcPeerConnections[viewer.v_id].onicecandidate = (event:any) => {
          if (event.candidate) {
            console.log("sending ice candidate");
            socket.emit("candidate", viewer.v_id, {
              type: "candidate",
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate,
            });
          }
        };

        rtcPeerConnections[viewer.v_id]
        .createOffer()
        .then((sessionDescription:any) => {
          rtcPeerConnections[viewer.v_id].setLocalDescription(sessionDescription);
          socket.emit("offer", viewer.v_id, {
            type: "offer",
            sdp: sessionDescription,
            broadcaster: {name:'random',room: id,},
          });
        })
        .catch((error:any) => {
          console.log(error);
        });

      })
      socket.on("answer", function (viewerId, event) {
        rtcPeerConnections[viewerId].setRemoteDescription(
          new RTCSessionDescription(event)
        );
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
      socket.off('create-stream');
      socket.off('connect');
      socket.off('receive-message');
      socket.off('answer');
      socket.off('offer');
      socket.off('candidate');
      socket.off('new viewer');
      socket.off('register as broadcaster')
      socket.off('viewers')
    };
  
  },[])
  return (
    <section className='as_container'>
      <span>connected{s_id}</span>
      <div className="streamer_video_container">
        <video src="" ref={streamVideo} autoPlay muted playsInline></video>
      </div>
      <div className="joined_viewer_container">
        {viewers? <p>viewer{viewers}</p> :'no viewer'}
      </div>
      <div className="stream_chat">
        <div className="chat_messages_container">
          {allMessage.map((msg:string , index:number) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
        <form onSubmit={(e) => StreamerSendMessage(e)} className="streamer_chat_action">
          <input value={streamerMsg} onChange={(e) => setStreamerMsg(e.target.value)} type="text" />
          <button>Send</button>
        </form>
      </div>
    </section>
  )
}

export default AdminStream