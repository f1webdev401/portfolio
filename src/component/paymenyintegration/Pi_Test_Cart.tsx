import { useState } from "react"
import '../../assets/css/myWorks/pi_test_cart/Pi_Test_Cart.css'
import axios from "axios"
import LoadingPage from "../../pages/LoadingPage"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
const Pi_Test_Cart = () => {
    const [redirectCount,setRedirectCount] = useState<any>(3)
    const [isCheckoutTrigger,setIsCheckoutTrigger] = useState<boolean>(false)
    
    const navigate = useNavigate()
    let cook = Cookies.get("peyment")
    console.log(cook)
    const [testItem,setTestItem] = useState<any>([
        {
            id: 1,
            name: 'Shoes for Men',
            img: 'https://freehindidesign.com/wp-content/uploads/2021/06/cool-white-man-shoe-HD-Png.jpg',
            size: 'XL',
            unit_price:120,
            quantity: 1,
            totalPrice: function () {
                return this.unit_price * this.quantity},
        },
        {
            id: 2,
            name: 'Cool Jacket',
            img: 'https://m.media-amazon.com/images/I/51cXN-aPvsL.jpg',
            size: 'S',
            unit_price:120,
            quantity: 1,
            totalPrice: function () {
                return this.unit_price * this.quantity},
        },
        {
            id: 3,
            name: 'Pants for men',
            img: 'https://m.media-amazon.com/images/I/31xBKo47VJL._AC_UF1000,1000_QL80_.jpg',
            size: 'L',
            unit_price:120,
            quantity: 1,
            totalPrice: function () {
                return this.unit_price * this.quantity},
        }
    ])
    let totalPrice = testItem.reduce((acc:number,curr:any) => {
        return acc + curr.totalPrice()
    },0)
    const QuantityInputHandlerBtn = (index:any,operator:string) => {
        const newTestItem = [...testItem]
        if(operator === 'plus') {
            newTestItem[index].quantity = parseInt(newTestItem[index].quantity) + 1
            setTestItem(newTestItem)
        }else {
            newTestItem[index].quantity = parseInt(newTestItem[index].quantity) - 1 
            setTestItem(newTestItem)
        }
    }
    const QuantityInput = (e:any,index:any) => {
        const newTestItem = [...testItem]
        const {value} = e.target
        newTestItem[index].quantity = value
        setTestItem(newTestItem)
    }
    /* const CheckOut =  async () => {
        // axios.post('http://localhost:5000/attach-intent-method')
        // .then((res:any) => {
        //     console.log(res)
        // }) 
        // .catch(e => {
        //     console.log((e.response.data.error[0].detail).slice(8))
        // })
        // console.log('redirecting in ..')
        // setIsCheckoutTrigger(true)
        // let totalPrice = testItem.reduce((acc:number,curr:any) => {
        //     return acc + curr.totalPrice()
        // },0)
        // for(let i = 3 ; i > -1 ; i --) {
        //     await new Promise(res => setTimeout(res,1000))
        //     console.log(i)
        //     setRedirectCount(i)
        // }
        // console.log('fired')
        // navigate('checkout')
    } */
    const CheckOut = async () => {
        setIsCheckoutTrigger(true)
        // let totalPrice = testItem.reduce((acc:number,curr:any) => {
        //     return acc + curr.totalPrice()
        // },0)
        const data = {
            data: {
              attributes: {
                amount: (totalPrice + 20) * 100,
                payment_method_allowed: ["card"],
                payment_method_options: {
                  card: {
                    request_three_d_secure: "any"
                  }
                },
                currency: "PHP",
                description: "Ecommerce",
                statement_descriptor: "F1 Web Dev Test"
              }
            }
          };
        //   https://first-deploy-server.onrender.com/create-payment-intent
        axios.post(process.env.REACT_APP_SERVER_API + 'create-payment-intent',data,{
            withCredentials: true
        })
        .then(async(res) => {
            console.log(res.data)
            console.log(res.status)
            if(res.status === 200) {
                Cookies.set('payment-intent',JSON.stringify(res.data))
                navigate('checkout')
            }
        })
        .catch(e => {
            console.log(e)
        setIsCheckoutTrigger(false)

        })
    }
  return (
    <section>
        <div className="pitc_item_container">
            {testItem && testItem.map((item:any , index:any) => (
                <div className="pitc_item_box"  key={index}>
                    <header>
                        <span>F1 WEB DEV SHOP</span>
                    </header>
                    <div className="pitc_item_wrapper">
                    <div className="pitc_item_image">
                        <img src={item.img} alt="" />
                    </div>
                    <div className="pitc_item_description">
                        <div className="pitc_item_name">
                            {item.name}
                        </div>
                        <div className="pitc_item_size">
                            <span>SIZE:</span>
                            <span>{item.size}</span>
                        </div>
                    </div>
                    <div className="pitc_quantity">
                        <div className="unit_price">
                            <div className="pitc_unit_price_txt">
                                <span>UNIT PRICE:</span>
                                <span>{item.unit_price}</span>
                            </div>
                            <div className="pitc_quantity">
                                <span className="pitc_quantity_text">
                                    Quantity:
                                </span>
                                <div className="pitc_quantity_inpt">
                                <button 
                                onClick={() => {
                                    QuantityInputHandlerBtn(index,'minus')
                                }}
                                >-</button>
                                <input
                                onChange={(e) => QuantityInput(e,index)}
                                value={item.quantity}
                                type="number" />
                                <button onClick={()=> {
                                QuantityInputHandlerBtn(index,'plus')}}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pitc_item_total_price">
                        <span>TOTAL PRICE</span>
                        <span>{item.totalPrice().toLocaleString()}</span>
                    </div>
                </div>
                </div>
                
            ))
            }
            
        </div>
            <div className="pitc_cc_ceckout_container">
                <div className="pic_cc_checkout_detail">
                    <div className="pitc_cc_item pitcc_detail">
                        <span>Item</span>
                        <span>(3)</span>
                    </div>
                    <div className="pitc_cc_sub_total pitcc_detail">
                        <span>Subtotal</span>
                        <span>{totalPrice.toLocaleString('en-US')}</span>
                    </div>
                    <div className="pitc_cc_vat pitcc_detail">
                    <span>Vat</span>
                        <span>20</span>
                    </div>
                    <div className="pitc_cc_total_ammount pitcc_detail">
                        <span>Total Ammount</span>
                        <span>{(totalPrice + 20).toLocaleString('en-US')}</span>
                    </div>
                </div>
                <button 
                className="pitcc_checkout_btn"
                onClick={CheckOut}
                >Check Out</button>
            </div>
        {isCheckoutTrigger &&
        
        <div className="pitc_redirect_container">
            <div className="pitc_count">
            <span>Redirecting in Payment..</span>
            {/* <LoadingPage/> */}
            <span>{redirectCount}</span>
            </div>
            <span className="loader"></span>
        </div>
        }
    </section>
  )
}

export default Pi_Test_Cart