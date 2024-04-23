import { useRef , useState , useEffect} from 'react'
import '../assets/css/CursorEffect.css'
const CursorEffect = () => {
    const [colors,setColors] = useState<any>([
        "#75E97C","#E1AA16","#E8423B","#002050","#7237E4","#89660A"
      ])
      const [cursor,setCursor] = useState({
        x: 0,
        y: 0
      })
      const CursorDivRef = useRef<any>(null)
      useEffect(() => {

        let animationFrameId;
    
        const handleMouseMove = (e:any) => {
          const { clientX, clientY } = e;
          // Use requestAnimationFrame to throttle state updates
          animationFrameId = requestAnimationFrame(() => {
            setCursor({
              x: clientX,
              y: clientY,
            });
          });
        };
    
        window.addEventListener('mousemove', handleMouseMove);
      },[])
    
        useEffect(() => {
          const newDiv = document.createElement('div');
        // Set some properties or content for the new div if needed
        let random = Math.floor(Math.random() * 6)
        newDiv.className = 'append fa-brands fa-react';
        newDiv.style.position = 'absolute';
      newDiv.style.left = cursor.x + 'px';
      newDiv.style.top =  cursor.y + 'px';
        newDiv.style.color = colors[random]
        // Append the new div to the document body or another element
        CursorDivRef.current.appendChild(newDiv);
        },[cursor])
  return (
    <div ref={CursorDivRef}
     className='cursor_effect'></div>
  )
}

export default CursorEffect