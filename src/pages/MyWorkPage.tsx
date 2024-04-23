import {  Outlet } from 'react-router-dom'

const MyWorkPage = () => {
  return (
    <section className='mywork_section'>
        <Outlet/>
    </section>
  )
}

export default MyWorkPage