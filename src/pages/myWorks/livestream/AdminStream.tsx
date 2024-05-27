import { useEffect, useState  , useCallback, useRef} from 'react'
import '../../../assets/css/myWorks/livestream/AdminStreamer.css'
import { useParams } from 'react-router-dom'
import {v4 as uuid} from 'uuid'
// const socket = io('https://livestream-server-qhcr.onrender.com',{'multiplex':false,transports: ['websocket']})
// const socket = io('http://localhost:4000',{'multiplex':false})
import socket from './socket';
const AdminStream = () => {
  let iceServers = {
    iceServers: [
      {urls: "stun:stun2.l.google.com:19302"},
      {urls: "stun:stun3.l.google.com:19302"}
    ]
  }
  let rtcPeerConnections: any = {}
  const [isConnected,setIsConnected] = useState(socket.connected)
  let streamSrc : any= null ;
  const [streamerMsg,setStreamerMsg] = useState('')
  const [allMessage,setAllMessage] = useState<any>({})
  const {id,name,caption} = useParams()
  const [isLoading,setIsLoading] = useState<boolean>(true)
  let image =  localStorage.getItem('streamerimg') || null
  let streamImgThumbnail = localStorage.getItem('streamerthumbnail') || null
  const streamVideo = useRef<any>(null)
  const [viewers,setViewers] = useState<any>(0)
  const StreamerSendMessage = (e:any) => {
    e.preventDefault()
    if(streamerMsg === '') return;
    let msgId = uuid()
    socket.emit('message',streamerMsg,id,name,image,true , msgId)
    setAllMessage((prev:any) => ({...prev , [msgId]: {message:streamerMsg,id,user:name,image,sending:true}}))
    setStreamerMsg('')
  }

  useEffect(() => {
    if(!socket.connected) {
        socket.connect()
    }
    function onConnect() {
      // console.log('connected')
      setIsConnected(true)
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: 'user' }
      })
      .then((stream) => {
        streamSrc = stream
        streamVideo.current.srcObject = stream
        socket.emit('register as broadcaster',id)
        // console.log('working')
        setIsLoading(false)
      })
      .catch(function (err) {
        console.log("An error ocurred when accessing media devices", err);
      });
      socket.emit('create-stream',{id,name,caption,streamImgThumbnail})
      socket.on('receive-message', (message) => {
        setAllMessage(message);
      });

      socket.on('new viewer',(viewer) => {
        rtcPeerConnections[viewer.v_id] = new RTCPeerConnection(iceServers);
        const peerConnection = rtcPeerConnections[viewer.v_id]
        const stream = streamVideo.current.srcObject
        stream
        .getTracks()
        .forEach((track:any) => peerConnection.addTrack(track, stream));
        peerConnection.onicecandidate = (event:any) => {
          if (event.candidate) {
            socket.emit("candidate", viewer.v_id, {
              type: "candidate",
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate,
            });
          }
        };

        peerConnection
        .createOffer()
        .then((sessionDescription:any) => {
          peerConnection.setLocalDescription(sessionDescription);
          socket.emit("offer", viewer.v_id, {
            type: "offer",
            sdp: sessionDescription,
            broadcaster: {name:'random',room: id,},
          });
        })
        .catch((error:any) => {
          console.log(error);
        });
        console.log('new viewer')
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
      })
    }
    function onDisconnect() {
      socket.connect();
    }
    socket.on('connect',onConnect)
    socket.on('disconnect' , onDisconnect)
    socket.on('disconnected',(user) => {
      delete rtcPeerConnections[user]
      console.log(rtcPeerConnections)
    })
    return () => {
      socket.off('create-stream');
      socket.off('connect');
      socket.off('disconnected');
      socket.off('receive-message');
      socket.off('answer');
      socket.off('offer');
      socket.off('candidate');
      socket.off('new viewer');
      socket.off('register as broadcaster')
      socket.off('viewers')
      socket.off('disconnect')
      socket.disconnect()
      if(streamSrc) {

        streamSrc.getTracks().forEach(function(track:any) {
          track.stop();
        });
      } 
    };
  
  },[])


  return (
    <section className='as_container'>
      <div className='as_live_text'>
      <span>
      <i className="fa-regular fa-circle-dot"></i>
        Live</span>
      <i className="fa-solid fa-headset"></i>
      </div>
      <div className="as_live_content">

      <div className="streamer_video_container">
        {isLoading && 
        <div className="as_stream_vid_loading">
          <span className="loader"></span>
        </div>
        }
        <video src="" ref={streamVideo} autoPlay muted playsInline></video>
      </div>
      <div className="joined_viewer_container">
        {viewers? <p>viewer <span>{viewers}</span></p> : <p>0 viewer</p>}
      </div>
      <div className="stream_chat">
      <div className='as_sca_header'>
          <span>Chat </span>
          <i className="fa-regular fa-comment-dots"></i>
          </div>
        <div className="chat_messages_container">
          {allMessage && Object.values(allMessage).map((msg:any , index:number) => (
            <div style={{opacity: msg.sending ? '.7':'1'}} className='as_chat_wrapper' key={index}>
              <span>{msg.user}</span>
              <div className='as_chat_msg_info'>
                <div className="as_chat_img_wrapper">
                  <img src={msg.image} alt="" style={{width:'30px',height: '30px'}}/>
                </div>
                <div className="as_chat_text_wrapper">
                <p key={index}>{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={(e) => StreamerSendMessage(e)} className="streamer_chat_action">
          
          <input value={streamerMsg} onChange={(e) => setStreamerMsg(e.target.value)} type="text" />
          <button>Send</button>
        </form>
      </div>
      </div>
    </section>
  )
}

export default AdminStream