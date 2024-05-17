import '../../../assets/css/myWorks/livestream/LiveStream.css'
import { Outlet } from 'react-router-dom'
const LiveStream = () => {
  return (
    <div className='livestream_container'>
      <Outlet />
    </div>
  )
}

export default LiveStream