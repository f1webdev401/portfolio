import { useEffect, useRef, useState } from 'react'
import {io} from 'socket.io-client'
import '../../../assets/css/myWorks/livestream/ViewerStream.css'
import { useParams } from 'react-router-dom'
import {v4 as uuid} from 'uuid'
// const socket = io('https://livestream-server-qhcr.onrender.com',{transports: ['websocket']})
// const socket = io('http://localhost:4000')
import socket from './socket'

const ViewerStream = () => {
  let iceServers = {
    iceServers: [
      {urls: "stun:stun2.l.google.com:19302"},
      {urls: "stun:stun3.l.google.com:19302"}
    ]
  }
  let rtcPeerConnections : any = {}
  let viewerImage = localStorage.getItem('viewerimg')
  const {id,v_id,name} = useParams()
  const [messageTxt,setMessageTxt] = useState('')
  const [allMessage,setAllMessage] = useState<any>({})
  const viewerStreamVideo = useRef<any>(null)
  const [viewers,setViewers] = useState<any>('')
  const [viewerStream,setViewerStream] = useState<any>('') 
  const [onPlayProcess,setOnPlayProcess] = useState<boolean>(false)
  const [isPlayButton,setIsPlayButton] = useState(true)
  const [loading,setLoading] = useState<boolean>(true)
  const SendMessageBtn = (e:any) => {
    e.preventDefault()
    let msgId = uuid()
    socket.emit('message',messageTxt,id,name,viewerImage,false,msgId)
    setAllMessage((prev:any) => ({...prev , [msgId]:{message:messageTxt,id,user:name,image:viewerImage,sending:true}}))
    setMessageTxt('')
  }
  useEffect(() => {
    if(!socket.connected) {
      socket.connect()
    }
    function onConnect() {
      socket.emit('join-stream',id ,v_id)

      socket.on('receive-message', (message) => {
        setAllMessage(message);
      });

      socket.emit('register as viewer',{id,v_id,name})
      socket.on('offer',(broadcaster,sdp) => {
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
            setViewerStream(event.streams[0])
            setLoading(false)
        };
        rtcPeerConnections[broadcaster.id].onicecandidate = (event:any) => {
          if(event.candidate) {
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
      })
    }
    function onDisconnect() {
      socket.connect();
    }
    socket.on('connect',onConnect)
    socket.on('disconnect',onDisconnect)
    return () => {
      socket.off('receive-message');
      socket.off('register as viewer');
      socket.off('connect');
      socket.off('candidate')
      socket.off('offer')
      socket.off('viewers')
      socket.off('join-stream');
      socket.off('disconnect')
      socket.disconnect()
      rtcPeerConnections = {}
    };
  }, []);
  const PlayVideoBtnHandler = async () => {
    setOnPlayProcess(true)
    setIsPlayButton(false)
    await viewerStreamVideo.current.play();
    setOnPlayProcess(false)
  }
  useEffect(() => {
    if (viewerStreamVideo.current && viewerStream) {
      viewerStreamVideo.current.srcObject = viewerStream;
    } 
  },[viewerStream])
  if(loading) {
    return <>
      <div className='vs_loading_container'>
        <span className="loader"></span>
      </div>
    </>
  }
  return (
    <section className='vs_container'>
      <div className="vs_video_container">
        {
          isPlayButton && 
        <div className="vs_video_bg_play">
          <button onClick={PlayVideoBtnHandler} className='vs_play_button'>
          <i className="fa-solid fa-play"></i>
          </button>
        </div>
        }
      {onPlayProcess && 
        <div className="vs_video_loading">
          <span className="loader"></span>
        </div>
        }
      <div className='vs_live_text'>
      <span>
      <i className="fa-regular fa-circle-dot"></i>
        Live</span>
      <i className="fa-solid fa-headset"></i>
      </div>
      <video src="" ref={viewerStreamVideo}   playsInline></video>
      <div className='vs_viewer_wrapper'>
        {viewers ? 
        <p>viewers {viewers}</p> : <p>viewers 0</p>  
      }
      </div>
      </div>
      {/* <div className="vs_video_react_btn">
        <button>Like</button>
        <button>Heart</button>
      </div> */}
      <div className="vs_chat_container">
      <div className='vs_sca_header'>
          <span>Chat </span>
          <i className="fa-regular fa-comment-dots"></i>
          </div>
        <div className="vs_chat_messages">
          {allMessage && Object.values(allMessage).map((msg:any , index:number) => (
            <div style={{opacity: msg.sending ? '.7':'1'}} className='vs_chat_msg_wrapper' key={index}>
            <span>{msg.user}</span>
              <div className="vs_chat_mgs_u_info">
                <div className="vs_chat_img_wrapper">
                  <img src={msg.image} alt="" />
                </div>
                <div className="vs_chat_text_wrapper">
                  <p key={index}>{msg.message}</p>
                </div>
              </div>
            </div>
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