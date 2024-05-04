import '../../assets/css/myWorks/pi_test_cart/Pi_Success_Payment.css'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import {   useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const Pi_Success_Payment = () => {
    let navigate = useNavigate()
    let paymentReceipt :any= Cookies.get('receipt') || null
    const [receipt,setReceipt] = useState<any>('')
    useEffect(() => {
        if(paymentReceipt) {
            setReceipt(JSON.parse(paymentReceipt))
        }
    },[])
    const ClosePayment = () => {
        Cookies.remove('receipt')
        Cookies.remove('payment-intent')
        navigate('/myworkf1/paymentintegration/')
    }
  return (
    <section className='pi_success_p_container'>
        {receipt ?
        
        <div className="pi_success_box_container">
            <div className="pisbc_header_text">
                <i className="fa-regular fa-circle-check"></i>
                <span>Your'e Payment was Successfull</span>
            </div>
            <div className="pisp_details">
                <div className="span_wrapper">
                    <span>Payment Type</span>
                    <span>Card</span>
                </div>
                <div className="span_wrapper">
                    <span>Email</span>
                    <span>{receipt.email}</span>
                </div>
                <div className="span_wrapper pisp_ammount_paid">
                    <span>Amount paid</span>
                    <span>PHP {receipt.amount.toLocaleString('en-US')}</span>
                </div>
                <div className="span_wrapper pis_date_wrapper">
                    <span>Date</span>
                    <span>{receipt.date}</span>
                </div>
                <div className="transaction_id">
                    <span>Transaction ID</span>
                    <span>{receipt.id}</span>
                </div>
            </div>

                <Link onClick={ClosePayment} to='#' className='pisp_close_btn'>Close</Link>
        </div> : 
        <div className="">
        <Link className='pisp_close_btn' to={'/myworkf1/paymentintegration/'}>Go Back</Link>
        </div>
        }
    </section>
  )
}

export default Pi_Success_Payment