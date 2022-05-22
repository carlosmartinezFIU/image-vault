import { useState, useContext } from 'react';
import './TripCard.css'
import { AiOutlineClose } from 'react-icons/ai'
import { BiMap } from 'react-icons/bi'
import { BsThreeDots } from 'react-icons/bs';
import ImageModal from '../ImageModal/ImageModal';
import axios from 'axios';
import { CardList } from "../../App";

const TripCard = ({ card }) => {
  const [cardId, setCardId] = useState();
  const [modalToggle, setModalToggle] = useState(false);
  const {list, setList} = useContext(CardList);

  //Shows Modal 
  const showhideModal = (data) => {
        setModalToggle(data);
  }

  //Grabs current Card id to show in Modal 
  const getCurrentId = (id) =>{
        setCardId(id)
  }

  //Hides Modal
  const hideModal = (off) => {
    setModalToggle(off);
  }

  /*Takes the id of the Trip card to send a delete request 
    also grabs the path of the image to send in body as to
    grab path and delete image from the backend 
  */
const deleteCard = async (id, imagePath) =>{
    
    try {
      const deleteCard = await axios.delete(`/photocard/${id}`, { data: { newPath: imagePath}});
      setList(list.filter(item => item.photo_id !== id));
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div className='card-wrapper' key={card.photo_id}>
        <div className='close-btn-container'>
          <AiOutlineClose className='close-btn-card' onClick={() => {deleteCard(card.photo_id, card.photo_img)}}/>
          <BsThreeDots className='edit-btn-card' onClick={() => {showhideModal(true); getCurrentId(card.photo_id)}} />
        </div>


        <div className='card-container'>
            <img src={card.photo_img} alt={`${card.photo_location}`}/>

            <div className='card-description-container'>
                <BiMap />
                <p className='card-location-text'>{card.photo_location}</p>
                <p className='card-description-text'>{card.photo_description}</p>
            </div>
        </div>

        { modalToggle && <ImageModal idCard={cardId} card={card} hideModal={hideModal}/> }
      
    </div>
    
  )
}

export default TripCard
