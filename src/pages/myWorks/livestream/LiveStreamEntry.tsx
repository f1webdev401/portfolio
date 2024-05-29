import '../../../assets/css/myWorks/livestream/LiveStreamEntry.css'
import { useNavigate } from "react-router-dom"
import {v4 as uuid} from 'uuid'
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react"
import { useContext } from 'react'
import StreamContext from './context/StreamerContext'
// import {io} from 'socket.io-client'
import socket from './socket'
// const socket = io('https://livestream-server-qhcr.onrender.com',{transports: ['websocket']})
// const socket = io('http://localhost:4000')

type State = {
  startStream:boolean,
  isViewer: boolean,
  streamListData:any,
  streamLink:any,
}
type Action = {type: "START_STREAM"} | {type: "JOIN_STREAM",link:any} | {type:'GET_STREAM_LIST',stream:any} | {type: "CLOSE_START_STREAM_FORM"}

const initialState = {
  startStream: false,
  isViewer: false,
  streamLink: '',
  streamListData: '',
  
}
const reducer = (state: State,action: Action) => {
  switch(action.type) {
    case "START_STREAM" :
      return {...state , startStream:true,isViewer:false}
    case "JOIN_STREAM":
      return {...state ,startStream:true,isViewer:true,streamLink:action.link}
    case "GET_STREAM_LIST":
      return {...state, streamListData:action.stream}
    case "CLOSE_START_STREAM_FORM":
      return {...state,startStream:false,isViewer:false,streamLink:''};
    default:
      return state
  }
}
const LiveStreamEntry = () => {
  let viewerId = uuid()
  const navigate = useNavigate()
  // const [startStream,setStartStream] = useState<boolean>(false)
  const [streamInfo,setStreamInfo] = useState({
    name: '',
    caption: ''
  })
  const [loading,setLoading] = useState<boolean>(true)
  const [avatarPrev,setAvatarPrev] = useState<any>('')
  const [thumbnailPrev,setThumbnailPrev] = useState<any>('')
  const AddAvatarRef = useRef<any>(null)
  const AddStreamThumbnail = useRef<any>(null)
  const [state,dispatch] = useReducer(reducer,initialState)
  // console.log('asdasd')
  const StartStreamBtn = useCallback(() => {
    // setStartStream(true)
    // setIsViewer(false)
    return dispatch({type: 'START_STREAM'})
  },[state.startStream])
  const JoinStreamAsViewerBtn = (link:any) => {
    // setStartStream(true)
    // setIsViewer(true)
    dispatch({type: 'JOIN_STREAM',link})
    // setStreamLink(link)
  }
  const ProceedStreamBtn = () => {
    if(state.isViewer) {
      navigate(`${state.streamLink}${streamInfo.name}`)
    }else {
      let streamId = uuid()
      navigate(`/myworkf1/livestream/streamerpage/${streamId}/${streamInfo.caption}/${streamInfo.name}`)
    }
  }
  const StreamInfoHandler =(e:any) =>{ 
    const {name,value} = e.target
    setStreamInfo(prev => ({...prev , [name]:value}))
  }
  const StreamImageHandler = (e:any) => {
      if(e && e.target.files && e.target.files.length > 0) {
        const image = e.target.files[0]
        const reader = new FileReader()
        reader.onload = (event:any) => {
          const base64Img = event.target.result as string
          setAvatarPrev(base64Img)
          if(state.isViewer) {
            localStorage.setItem('viewerimg',base64Img)
          }else {
            localStorage.setItem('streamerimg',base64Img)
          }
        }
        reader.readAsDataURL(image)
      }
  }
  
  const StreamThumbnailHandler = (e:any) => {
      if(e && e.target.files && e.target.files.length > 0) {
          const streamThumbnail = e.target.files[0]
          const reader = new FileReader()
          reader.onload = (event:any) => {
            const base64Thumbnail = event.target.result as string
            setThumbnailPrev(base64Thumbnail)
          localStorage.setItem('streamerthumbnail',base64Thumbnail)
          }
          reader.readAsDataURL(streamThumbnail)
      }
  }
  
  // const LliButtonClose = () => {
  //   // setStartStream(false)
  //   setStreamInfo({
  //     name: '',
  //     caption: ''
  //   })
  //   setAvatarPrev('')
  //   setThumbnailPrev('')
  // }

    // const connectSocket = useCallback(() => {
    //   if(!socket.connected) {
    //     socket.on('connect',() => {
    //       console.log(socket.id)
    //     })
    //     socket.connect()
    //   }
    // },[socket])
    // useEffect(() => {
    //   connectSocket()
    // },[])
    useEffect(() => {
      let isMounted = true
      if(!socket.connected) {
        socket.connect()
      }
      function onConnect() {
        // setIsConnected(true)
        // console.log(socket.id,'asd213')
        if(isMounted) {
          socket.on('created-stream',(stream) => { 
            dispatch({type:"GET_STREAM_LIST",stream})
            setLoading(false)
          })
        }
      }
      function onDisconnect() {
        // setIsConnected(false);
        console.log('Connection lost, retrying...');
        socket.connect();
      }
    
      socket.on('connect',onConnect)
      socket.on('disconnect', onDisconnect)
      // console.log('working')
        return () => {
        socket.off('disconnect')
        socket.off('connect')
        socket.off('created-stream')
        socket.disconnect()
      }
    },[])
    if(loading) {
      return <>
      <div className='lse_loader_container'>
  <span className="loader"></span>
</div>
      </>
    }
  return (
    <>
     <div className="lse_livestream_list">
    {
    state.streamListData.length !== 0 ?
    <div className="lse_stream_list">
      <h1>Watch Streams</h1>
    {state.streamListData.map((stream:any,index:number) => (
      // <a href={`/myworkf1/livestream/viewerpage/${stream.id}/${viewerId}/${viewerId.slice(0,8)}`} key={index}>
      <button onClick={() => JoinStreamAsViewerBtn(`/myworkf1/livestream/viewerpage/${stream.id}/${viewerId}/`)} className='' key={index}>
        <div className="lse_stream_thumbnail">
        <img  src={stream.imagestream} alt="" />
        </div>
        <p>{stream.caption.length > 24 ? stream.caption.slice(0,24) +'...': stream.caption }</p>
      </button>
      // </a>
    ))}
    </div>
    : 
    <div className="no_stream_text">
      <p>No Available Streams</p>
    </div>
    }
</div>

{state.startStream  && 
    <div className="lii_container">
    <div className="livestream_input_info">
      <button onClick={() => dispatch({type:"CLOSE_START_STREAM_FORM"})}  className='lli_button_close'><i className="fa-solid fa-xmark"></i></button>
      <div className="lli_info_header">
        <span>{state.isViewer ? 'Join Stream': 'Start Stream'}</span>
      </div>
      <div>
        <label htmlFor="">Name:</label>
        <input type="text"
          onChange={(e) => StreamInfoHandler(e)}
          value={streamInfo.name}
          name='name'
        />
      </div>
      {state.isViewer ? '' :
      <div>
        <label htmlFor="">Live Stream Caption</label>
        <input type="text" 
        onChange={(e) => StreamInfoHandler(e)}
        value={streamInfo.caption}
        name='caption'
        />
      </div>
    }
      <div>
        <label htmlFor="">Add Avatar</label>
        <input ref={AddAvatarRef} type="file" name="" id="" onChange={(e) => StreamImageHandler(e)} hidden/>
        <button onClick={() => AddAvatarRef.current.click()}><i className="fa-solid fa-image"></i></button>
      </div>

      <div className="image_preview">
        {avatarPrev &&
        <img alt="" src={avatarPrev} />
        }
      </div>
      {state.isViewer ? '' :
        <>
      <div>
        <label htmlFor="">Add Stream Thumbnail</label>
        <input ref={AddStreamThumbnail} type="file" name="" id="" hidden onChange={(e) => StreamThumbnailHandler(e)}/>
        <button onClick={() => AddStreamThumbnail.current.click()}><i className="fa-solid fa-photo-film"></i></button>
      </div>
      <div className="image_preview">
        {thumbnailPrev && 
        <img alt="" src={thumbnailPrev} />
        }
      </div>
        </>
      }

      <div className='lli_proceed_btn_container'>
      <button onClick={ProceedStreamBtn}>Proceed</button>
      </div>

    </div>
    </div>
}
 <button onClick={StartStreamBtn} className='start_live_button'>Start Live Stream</button>
    </>
  )
}

export default LiveStreamEntry