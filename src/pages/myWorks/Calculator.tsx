import { useState ,useReducer } from 'react'
import '../../assets/css/myWorks/Calculator.css'

type State = {
    firstNum: string;
    operator: string;
    secondNum: string;
    placement: number;
    result: number | null;
}
type Action = {type: string | number, payload: string} ;

const reducer = (state: State,action:Action) => {
    
   switch(`${action.type}-${state.placement}`) {
        case '1-0':
        case '2-0':
        case '3-0':
        case '4-0':
        case '5-0':
        case '6-0':
        case '7-0':
        case '8-0':
        case '9-0':
        case '0-0':
        case '.-0':
        // case '%-0':
            if(action.payload === ".") {
                if(state.firstNum.includes(".")) {
                    return state
                }
            }
            if(action.payload === "%") {
                if(state.firstNum.includes("%")) {
                    return state
                }
            }
            return {...state , firstNum:state.firstNum + action.payload}
        case '1-1':
        case '2-1':
        case '3-1':
        case '4-1':
        case '5-1':
        case '6-1':
        case '7-1':
        case '8-1':
        case '9-1':
        case '0-1':
        case '.-1':
        // case '%-1':
            if(state.operator === '') return state
            if(action.payload === ".") {
                if(state.secondNum.includes(".")) {
                    return state
                }
            }
            if(action.payload === "%") {
                if(state.secondNum.includes("%")) {
                    return state
                }
            }
            if(state.result !== null) {
                return {...state,firstNum:action.payload.toString(),placement: 0,secondNum:'',operator: '',result: null}
            }
            return {...state,secondNum: state.secondNum + action.payload}
        case "÷-0": 
        case "%-0":
        case "×-0": 
        case "--0": 
        case "+-0":
        case "÷-1": 
        // case "%-1":
        case "×-1": 
        case "--1": 
        case "+-1":
            if(state.firstNum.length === 0) return state; 
            if(state.secondNum.length === 0) {
                return {...state,operator: action.payload , placement: 1}
            }
            return state
        case "=-1":
            if(state.secondNum.length !== 0) {
                if(state.operator === "+") {
                    return {...state , result: Number(state.firstNum) + Number(state.secondNum)}
                }
                else if(state.operator === "×") {
                    return {...state , result: Number(state.firstNum) * Number(state.secondNum)}
                }
                else if(state.operator === "÷") {
                    return {...state , result: Number(state.firstNum) / Number(state.secondNum)}
                }
                else if(state.operator === "-") {
                    return {...state , result: Number(state.firstNum) - Number(state.secondNum)}
                }
            }
          
            return state
        case 'AC-0':
        case 'AC-1':
            return {...state, firstNum: '',operator: '',secondNum: '',placement:0,result: null}
        case "C-0":
        case "C-1":
            if(state.result !== null) {
                return {
                    firstNum:'',
                    operator:'',
                    secondNum:'',
                    placement: 0,
                    result:null,
                }
            }
            if(state.operator !== "" && state.firstNum !== "" && state.secondNum !== "") {
                let newSecondNum = state.secondNum.split('').slice(0,state.secondNum.length - 1).join('')
                return {...state,secondNum:newSecondNum} 
            }
            if(state.operator !== "" && state.secondNum === "" && state.firstNum !== "" ) {
                return {...state , operator:'',placement:0}
            }
            if(state.firstNum.length !== 0 && state.operator === '' && state.secondNum === '') {
                if(state.operator !== "" || state.secondNum !== "") return state
                let newFirstNum = state.firstNum.split('').slice(0,state.firstNum.length - 1).join('')
                return {...state,firstNum:newFirstNum}                
            }
            return state
    default:
        return state
   }
}

const Calculator = () => {
    const [{firstNum,operator,secondNum,placement,result},dispatch] = useReducer(reducer,{
        firstNum:'',
        operator:'',
        secondNum:'',
        placement: 0,
        result:null,
    })
   
   
  
   const [buttons,setButtons] = useState<any[]>(
    ['AC','C','%','÷',7,8,9,'×',4,5,6,'-',1,2,3,'+',' ',0,'.','=']
   )    

  return (
    <div className='w_calculator'>
        <div className="title">
            <h1>SIMPLE CALCULATOR</h1>
        </div>
        <div className="calculator_container">
            <div className='prev_res_wrapper'>
                <div className="result">
                    <span>{result === null? '' : `=${result.toLocaleString('en-US')}`}</span>
                </div>
                <div className='numbers'>
                <span>{firstNum !== '' ? firstNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","): ''}</span>
                <span>{operator}</span>
                <span>{secondNum !== '' ?secondNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","): ''}</span>
                </div>
            </div>
            <div className="calculator_buttons">
                {buttons.map((button,index) => (
                    <button 
                    className='btn' key={index}
                    onClick={() => {
                        dispatch({type: button,payload:button})
                    }}
                    >
                        <span>{button}</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Calculator