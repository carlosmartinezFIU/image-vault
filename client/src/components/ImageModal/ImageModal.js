import { useState } from 'react';
import './ImageModal.css';
import { AiOutlineClose } from 'react-icons/ai';
import {BiMap} from 'react-icons/bi'
import axios from 'axios';

const ImageModal = ({ card, hideModal }) => {
    const [toggleOff, setToggleOff] = useState();
    const [editTrue, setEditTrue] = useState(false);
    const [newLocation, setNewLocation] = useState(card.photo_location);
    const [newDescription, setNewDescription] = useState(card.photo_description);


    //Allows the User to close the Image Modal
    const handleToggle = () =>{
      setToggleOff(false);
      hideModal( toggleOff );

    }

    //OnClick event to edit Location & Descrition of post
    const toggleEditDescription = (data) =>{
        setEditTrue(data);
    }

    //Function to Edit Location(Input) - Description(Input)
    //Server endpoint call to post passing data bove
    const sendEdit = async (id) =>{
        const body = {
          photo_location: newLocation,
          photo_description: newDescription
        }

        try {
         const dataResponse = await axios.put(`/photocard/${id}`, body)
         window.location = "/";
        } catch (error) {
          console.log(error)
        }
    }

  return (
    <div className='modal-overlay'>
          <div className='modal-card-wrapper'>
          <button className='modal-btn' onClick={() => toggleEditDescription(true)}>Edit</button> 
           <AiOutlineClose className='close-modal-btn' onClick={() => handleToggle(false)}/>
            <div className='modal-card-container'>
                <img className='image-modal-popup' src={card.photo_img} alt={card.photo_location}/>
                <div className='modal-info-container'>
                  {editTrue && 
                    <form className='form-image-modal-edit'>

                       <input value={newLocation} 
                       onChange={e => setNewLocation(e.target.value)}
                       maxLength={50}
                       className="input-modal-edit-location"
                       />
                       <input value={newDescription} 
                       onChange={e => setNewDescription(e.target.value)}
                       maxLength={250}
                       className='input-modal-edit-description'
                       />
                       <button className='modal-update-btn' type='button' onClick={() => sendEdit(card.photo_id)}>Enter</button>
                    </form>
                    
                  }
                  {editTrue === false &&
                    <div>
                      <div className='image-modal-map-location'>
                          <BiMap />
                          <p>{card.photo_location}</p>
                      </div>
                      <p className='image-modal-description'>{card.photo_description}</p>
                    </div>

                  }
                  
                </div>
            </div>
              
          </div>

    </div>
  )
}

export default ImageModal