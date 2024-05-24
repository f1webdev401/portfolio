import '../../../assets/css/myWorks/livestream/LiveStreamEntry.css'
import { useNavigate } from "react-router-dom"
import {v4 as uuid} from 'uuid'
import { useEffect, useRef, useState } from "react"
import { useContext } from 'react'
import StreamContext from './context/StreamerContext'
import {io} from 'socket.io-client'
const socket = io('https://livestream-server-qhcr.onrender.com',{transports: ['websocket']})
// const socket = io('http://localhost:4000')
const LiveStreamEntry = () => {
  let viewerId = uuid()
  const [startStream,setStartStream] = useState<boolean>(false)
  const [isViewer,setIsViewer] = useState<boolean>(false)
  const [streamLink ,setStreamLink] = useState<any>('')
  const [streamInfo,setStreamInfo] = useState({
    name: '',
    caption: ''
  })
  const [streamList,setStreamList] = useState<any>([])
  const [avatarPrev,setAvatarPrev] = useState<any>('')
  const [thumbnailPrev,setThumbnailPrev] = useState<any>('')
  const AddAvatarRef = useRef<any>(null)
  const AddStreamThumbnail = useRef<any>(null)

  
  const StartStreamBtn = () => {
    setStartStream(true)
    setIsViewer(false)
  }
  const ProceedStreamBtn = () => {
    if(isViewer) {
      window.location.href = streamLink + `${streamInfo.name}`

    }else {
      let streamId = uuid()
      window.location.href = `/myworkf1/livestream/streamerpage/${streamId}/${streamInfo.caption}/${streamInfo.name}`
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
          if(isViewer) {
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
  const JoinStreamAsViewerBtn = (link:any) => {
    setStartStream(true)
    setIsViewer(true)
    setStreamLink(link)
  }
  const LliButtonClose = () => {
    setStartStream(false)
  }
    useEffect(() => {
      socket.on('connect',() => {
          console.log(socket.id,'asd213')
        })
        socket.on('created-stream',(stream) => { 
          setStreamList(stream)
        })
        return () => {
        socket.off('connect')
        socket.off('created-stream')
      }
    },[])
  return (
    <>
     <div className="lse_livestream_list">
    {
    streamList.length !== 0 ?
    <div className="lse_stream_list">
    {streamList.map((stream:any,index:number) => (
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
      <p>No Streams</p>
    }
</div>
{startStream  && 
    <div className="lii_container">
    <div className="livestream_input_info">
      <button onClick={LliButtonClose}  className='lli_button_close'><i className="fa-solid fa-xmark"></i></button>
      <div className="lli_info_header">
        <span>{isViewer ? 'Join Stream': 'Start Stream'}</span>
      </div>
      <div>
        <label htmlFor="">Name:</label>
        <input type="text"
          onChange={(e) => StreamInfoHandler(e)}
          value={streamInfo.name}
          name='name'
        />
      </div>
      {isViewer ? '' :
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
        <label htmlFor="">Add Avatart</label>
        <input ref={AddAvatarRef} type="file" name="" id="" onChange={(e) => StreamImageHandler(e)} hidden/>
        <button onClick={() => AddAvatarRef.current.click()}><i className="fa-solid fa-image"></i></button>
      </div>
      <div className="image_preview">
        <img alt="" src={avatarPrev} style={{width: '50px',height:'50px'}}/>
      </div>
      {isViewer ? '' :
        <>
      <div>
        <label htmlFor="">Add Stream Thumbnail</label>
        <input ref={AddStreamThumbnail} type="file" name="" id="" hidden onChange={(e) => StreamThumbnailHandler(e)}/>
        <button onClick={() => AddStreamThumbnail.current.click()}><i className="fa-solid fa-photo-film"></i></button>
      </div>
      <div className="image_preview">
        <img alt="" src={thumbnailPrev} style={{width: '50px',height:'50px'}}/>
      </div>
        </>
      }

      <div>
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