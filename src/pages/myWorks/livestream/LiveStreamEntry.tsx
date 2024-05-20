import '../../../assets/css/myWorks/livestream/LiveStreamEntry.css'
import { useNavigate } from "react-router-dom"
import {v4 as uuid} from 'uuid'
import { useEffect, useState } from "react"
import { useContext } from 'react'
import StreamContext from './context/StreamerContext'
import {io} from 'socket.io-client'
// const socket = io('https://livestream-server-qhcr.onrender.com',{transports: ['websocket']})
const socket = io('http://localhost:4000')
const LiveStreamEntry = () => {
  let viewerId = uuid()

  const [startStream,setStartStream] = useState<boolean>(false)
  const [streamInfo,setStreamInfo] = useState({
    name: '',
    caption: ''
  })
  const [streamList,setStreamList] = useState<any>([])
  const StartStreamBtn = () => {
    setStartStream(true)
  }
  const ProceedStreamBtn = () => {
    let streamId = uuid()
    window.location.href = `/myworkf1/livestream/streamerpage/${streamId}/${streamInfo.caption}/${streamInfo.name}`
  }
  const StreamInfoHandler =(e:any) =>{ 
    const {name,value} = e.target
    setStreamInfo(prev => ({...prev , [name]:value}))
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
     <div className="livestream_list">
    {streamList.length !== 0 ? streamList.map((stream:any,index:number) => (
      <a href={`/myworkf1/livestream/viewerpage/${stream.id}/${viewerId}/${viewerId.slice(0,8)}`} key={index}>
        <p>{stream.name}</p>
      </a>
    )) : 
      <p>No Streams</p>
    }
</div>
{startStream  && 
    <div className="lii_container">
    <div className="livestream_input_info">
      <div>
        <label htmlFor="">Name:</label>
        <input type="text"
          onChange={(e) => StreamInfoHandler(e)}
          value={streamInfo.name}
          name='name'
        />
      </div>
      <div>
        <label htmlFor="">Live Stream Caption</label>
        <input type="text" 
        onChange={(e) => StreamInfoHandler(e)}
        value={streamInfo.caption}
        name='caption'
        />
      </div>
      <button onClick={ProceedStreamBtn}>Proceed</button>
    </div>
    </div>
}
 <button onClick={StartStreamBtn} className='start_live_button'>Start Live Stream</button>
    </>
  )
}

export default LiveStreamEntry