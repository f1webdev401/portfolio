import { useState } from 'react'
import '../../assets/css/myWorks/pi_test_cart/Pi_Checkout.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
const Pi_Checkout = () => {
    const navigate = useNavigate()
    let paymentIntentId :any = Cookies.get('payment-intent')
    // console.log(JSON.parse(paymentIntentId))
    const [errorPayment , setErrorPayment] = useState<string>('')
    const [isSubmitted,setIsSubmitted] = useState<boolean>(false)
    const [data,setData] = useState({
        data: {
        card_holder: '',
        attributes: {
             details: {
                  card_number: '',
                  exp_month: '',
                  exp_year: '',
                  cvc: '',

             },
             billing: {
                address : {
                    line1: ""
                },
                  name: "",
                  email: "",
                  phone: ""
             },
             type: "card"
        }
   }})

   const InputChangeDetail = (e:any,key:"billing"| "details") => {
    const {value,name} = e.target
    let parsedValue = value;
    if (name === 'exp_month' || name === 'exp_year' || name === 'cvc') {
        parsedValue = parseInt(value);
    }
    const newData = {
        ...data,
        data: {
            ...data.data,
            attributes: {
                ...data.data.attributes,
                [key]: {
                    ...data.data.attributes[key],
                    [name]: value
                }
            }
        }
    };
    setData(newData);
   }
   const InputChangeAddress = (e:any) => {

        const newData = {
            data: {
                ...data.data,
                attributes: {
                    ...data.data.attributes,
                    billing: {
                        ...data.data.attributes.billing,
                        address: {
                            line1: e.target.value
                        } 
                    }
                }
            }
        }
        setData(newData)
   }
   const ChoosePaymentMethodInp = () => {

   }
   const SubmitPayment = async (e:any) => {
    setIsSubmitted(true)
        e.preventDefault()
        axios.post('http://localhost:5000/attach-intent-method',
        {data , paymentIntentId},
        {
            withCredentials: true
        })
        .then((res) => {
            console.log(res)
            setIsSubmitted(false)
            if(res.status === 200) {
                Cookies.set('receipt',JSON.stringify(res.data))
                navigate('/myworkf1/paymentintegration/success')
            }
        })
        .catch(e => {
            console.log(e.response.data.error[0].detail)
            setErrorPayment(e.response.data.error[0].detail)
            setIsSubmitted(false)
        })
        // console.log(data)
   }

  return (
    <section className='pic_container'>
        <header>
            <h1>Checkout Test Payment</h1>  
        </header>
        <div className="pic_payment_id_info">
            <h2>Payment Id: </h2>
            <h2>{JSON.parse(paymentIntentId).id.slice(3)}</h2>
        </div>
        <form className='pic_payment_form'  onSubmit={(e) => SubmitPayment(e)} action="">
        <div className="payment_option">
            <button type='button'>
                <span>Card</span>
                <input onChange={ChoosePaymentMethodInp} style={{accentColor: 'green'}} type="radio" name="" id="" checked/>
            </button>
            <button  style={{opacity: '.5'}} disabled>
                <span>Gcash</span>
                <input type="radio" name="" id="" disabled/>
            </button>
        </div>
        <div className="pic_payment_information">
            <div className="pic_billing_information">
                <h2>Billing Information</h2>
                <div>
                    <label htmlFor="">Customer Name</label>
                    <input 
                    name='name'
                    value={data.data.attributes.billing.name}
                    onChange={(e) => InputChangeDetail(e,'billing')}
                    type="text" 
                    required/>
                </div>
                <div>
                    <label htmlFor="">Phonenumber</label>
                    <input 
                    name='phone'
                    value={data.data.attributes.billing.phone}
                    onChange={(e) => InputChangeDetail(e,'billing')}
                    type="text" 
                    required/>
                </div>
                <div>
                    <label htmlFor="">email</label>
                    <input 
                    value={data.data.attributes.billing.email}
                    name='email'
                    onChange={(e) => InputChangeDetail(e,'billing')}
                    type="email" 
                    required/>
                </div>
                <div>
                    <label htmlFor="">Adress</label>
                    <input 
                    name='line1'
                    onChange={(e) => InputChangeAddress(e)}
                    value={data.data.attributes.billing.address.line1}
                    type="text" 
                    required/>
                </div>
            </div>
            <div className="pic_detail_information">
                <h2>Card Details</h2>
                <div className='card_detail_inp_box'>
                    <label htmlFor="">Card Holder</label>
                    <input 
                    // name='card_holder'
                    // value={data.data.card_holder}
                    // onChange={(e) => InputChangeDetail(e)}
                    type="text" 
                    required/>
                </div>
                <div  className='card_detail_inp_box'>
                    <label htmlFor="">Card Number</label>
                    <input 
                    value={data.data.attributes.details.card_number}
                    onChange={(e) => InputChangeDetail(e,'details')}
                    name='card_number'
                    type="text" 
                    required/>
                </div>
                <div className='picbi_expiry_date'>
                    <span>Expiry Date: </span>
                    <div className='picb_exp_date_box_container'>

                    <div className='picb_exp_date_select_box'>
                        <span>Month</span>
                        <select 
                        name="exp_month" 
                        id="" 
                        value={data.data.attributes.details.exp_month}
                        onChange={(e) => InputChangeDetail(e,'details')}>
                            <option value="">Month</option>
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map((month:number) => (
                                <option value={month} key={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                    <div className='picb_exp_date_select_box'>
                        <span>Year</span>
                        <select 
                        name="exp_year" 
                        id=""
                        onChange={(e) => InputChangeDetail(e,'details')}
                        value={data.data.attributes.details.exp_year}
                        >
                            <option value="">Year</option>
                            {[2025, 2026, 2027, 2028,2029, 2030,2031, 2032,2033, 2034,2035, 2036,2037, 2038,2039, 2040,2041, 2042,2043, 2044,2045, 2046,2047, 2048,2049, 2050,2051, 2052,2053, 2054,2055].map((year:number) => (
                                <option value={year} key={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    </div>
                </div>
                <div className="picbi_cvc_code card_detail_inp_box">
                    <label htmlFor="">CVC Code</label>
                    <input 
                    onChange={(e) => InputChangeDetail(e,'details')}
                    value={data.data.attributes.details.cvc}
                    type="text" 
                    name='cvc'
                    />
                </div>
            </div>
        </div>
        
        <div className="pic_cofirm_payment">
            {
                errorPayment &&
            <div className="pic_payment_error">
                <span> {errorPayment}</span>
                <i onClick={() => setErrorPayment('')} className="fa-solid fa-xmark"></i>
            </div>
            }
        <div className='pic_ammount_to_pay'>
            <span>Amount to pay</span>
            <span>PHP {((JSON.parse(paymentIntentId).attributes.amount) / 100).toLocaleString('en-US')}</span>
        </div>
            <button className='pic_proceed_payment_btn'>Proceed Payment</button>
        </div>
        </form>
        {
        isSubmitted &&     
        <div className="pic_checkout_loading">
            <span className='loader'></span>
        </div>
        }
    </section>
  )
}

export default Pi_Checkout