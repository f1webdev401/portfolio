import { Outlet } from "react-router-dom"
import '../../assets/css/myWorks/pi_test_cart/PaymentIntegration.css'
const PaymentIntegration = () => {
  return (
    <section className="pi_container">
      <div className="pi_title">
        <h1>PAYMENT GATEWAY INTEGRATION</h1>
        <div className="pi_title_des">
          <span>THIS IS FOR TEST MODE ONLY</span>
          <i style={{color: 'yellow'}} className="fa-solid fa-circle-info"></i>
        </div>
        <div className="pi_title_des" style={{marginTop: '10px'}}>
        <i className="fa-solid fa-credit-card"></i>
          <span>USING PAYMONGO</span>
        </div>
      </div>
      {/* <Pi_Test_Cart /> */}
      <Outlet/>
    </section>
  )
}

export default PaymentIntegration