import './Navbar.css'

const Navbar = ({ showModalDisplay }) => {

  //Passes the boolean true to show Modal on OnClick
   function changeModalDisplay(view){
     showModalDisplay(view);
   }



  return (
    <div className='navbar-wrapper'>
        <div className='navbar-content-title'>
            <p>Travel Vault</p>
        </div>

        <div className='navbar-btn-container'>
            <button className='add-btn-entry' onClick={() => changeModalDisplay(true)}>Add Entry</button>
        </div>

    </div>
  )
}

export default Navbar