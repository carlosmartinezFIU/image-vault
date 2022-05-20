import './App.css';
import axios from 'axios';
import Header from './components/Header/Header';
import CardContainer from './components/CardContainer/CardContainer';
import { useState, createContext, useEffect } from 'react';


//Use Context to hold Array of Trip Cards
export const CardList = createContext();



function App() {
   const [list, setList] = useState([]);

// Call for all Trip Cards in database
useEffect(() =>{
  (async() => {
    const result = await axios.get('/photocard');
    setList(result.data);
  })()
}, []);


  return (
    <div className="App">
      <CardList.Provider value={{list, setList}}>
        <Header />
        <CardContainer />
      </CardList.Provider>
    </div>
  );
}

export default App;
