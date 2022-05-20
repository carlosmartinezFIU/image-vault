import React, { useState, useContext } from 'react'
import './Modal.css';
import { BiImageAdd } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';

import { CardList } from "../../App";


const Modal = ({ changeDisplay }) => {
  const {list, setList} = useContext(CardList);

  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [file , setFile] = useState();
  const [emptyImage, setEmptyImage] = useState(false);

  /**
   * Hide Modal button after User Submits Post
   * @param {*} data 
   */
  function handleClick( data ){
    changeDisplay(data)
}

//Collects Image, sets state to setFile
const handleFile = (e) =>{
    setFile(e.target.files[0]);
    setEmptyImage(true);
}
 
// Submits the Image - Location - Description of post
// Axios Post to Server ('/photocard')
  const submitForm = async e => {
      e.preventDefault();
      if(description === '')//Returns alert if description is missing
      {
        alert("Enter a description");
        return;
      }

      if(location === '')  //Returns alert if location is missing
      {
        alert("Enter a location");
        return;
      }

      if(emptyImage === false){  //Returns alert if Image is missing
        alert("Insert an Image");
        return;
      }

      const data = new FormData();
      data.append('image', file); 
      data.append('location', location);
      data.append('description', description);

      const result = await axios.post('/photocard', data);
      setList([...list, result.data]);

   
     handleClick(false); //Allows the Modal component to hide when users submits
  }


  return (
      <div className={`modal-wrapper`} >
        <form  >
        <div className='close-btn-container'>
           <AiOutlineClose className='close-btn' onClick={()=> handleClick(false)}/>
        </div>
          <div className='file-uploader'>

                <input type='file' filename={file} 
                onChange={handleFile} 
                className='modal-btn-input' name='image' accept='image/*'/> 

                <button className='modal-btn-wrapper'>
                    <BiImageAdd />
                    <p>Upload</p> 
                </button>
          </div>
         
          <div className='location-description-container'>
            <input className='location-input' placeholder='location' 
            onChange={e => setLocation(e.target.value)}   type='text'/>
            <textarea className='description-input' placeholder='description'
            onChange={e => setDescription(e.target.value)}></textarea>
          </div>
          <button className='add-button' onClick={submitForm}>Add
          </button>
          </form>
      </div>
    
  )
}

export default Modal


