import React, { Component } from 'react';
import './App.css';

import RadioSet from './components/RadioSet';

import songData from './data/tracks.json';

songData.forEach((song, i) => {
  song.id = i;
  song.favorite = false;  //leave it alone??
});

class App extends Component {



  toggleFav = (id, favorite) => {
    console.log( `App to .setState/toggle on ${id} fav = ${favorite}`);

  }

  render() {
    return (
      <div className="App">
        <header>
          <h1 className="page-header--title">Radio Lovelace</h1>
        </header>
        <main className="main">
          <RadioSet 
            tracks={songData} 
            parentCB={this.toggleFav}
          />
        </main>
      </div>
    );
  }
}

export default App;
