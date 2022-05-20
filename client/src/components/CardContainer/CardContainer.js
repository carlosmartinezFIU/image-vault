import { useContext } from "react";
import { CardList } from "../../App";
import TripCard from "../TripCard/TripCard";
import './CardContainer.css';

const CardContainer = () => {
    const {list, setList} = useContext(CardList);


/**
 * Holds all the Trip Cards populated
 * Outputs the cards in a flex wrap direction
 */
  return (
    <div className="card-container-wrapper">
        {list.map((card, i) => 
        <TripCard key={i} card={card}/>)
        }
    </div>
  )
}

export default CardContainer
