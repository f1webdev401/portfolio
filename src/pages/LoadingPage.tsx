import '../assets/css/LoadingPage.css'
import Logo from '../assets/images/icon_1.png'
const LoadingPage = () => {
  return (
    <div className='loadingPage_container'>
        <span className="lp_loader">
        </span>
        <img src={Logo} alt="" />
    </div>
  )
}

export default LoadingPage