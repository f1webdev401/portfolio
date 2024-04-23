import '../assets/css/Contacts.css'
const Contacts = () => {
  return (
    <section className='contacts_page'>
        <div className="contacts_container">
            <div>
                <h1>Contact Me 😊</h1>
            </div>
            {/* <div className="phonenumber">
                <h1>Phonenumber: </h1>
                <p></p>
            </div> */}
            <div className="facebook">
                <h1>Facebook: </h1>
                <a href="https://www.facebook.com/profile.php?id=61558574728861">F1 WEB DEV
</a>
            </div>
            <div className="email">
                <h1>Email: </h1>
                <p>f1webdev@gmail.com</p>
            </div>
        </div>
    </section>
  )
}

export default Contacts