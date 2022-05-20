import './Header.css'
import { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Modal from '../Modal/Modal';

const Header = () => {
    const [modal, setModal] = useState('');

   
    //OnClick function to hide the Modal
    function hideModalDisplay(data){
        setModal(data);
      }
      
      //OnClick function to show Modal
      function showModalDisplay(data){
        setModal(data);
      }

  return (
    <div className='header-image-wrapper'>
        <Navbar showModalDisplay={showModalDisplay}/>
        {modal && <Modal changeDisplay={hideModalDisplay} />}
    </div>
    
  )
}

export default Header
