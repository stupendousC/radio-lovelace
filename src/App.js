import React, { Component } from 'react';
import './App.css';

import RadioSet from './components/RadioSet';

import songData from './data/tracks.json';

songData.forEach((song, i) => {
  song.id = i;
  song.favorite = false;
});

class App extends Component {

  constructor() {
    super()
    this.state = {
      songData: songData
    }
  }

  toggleFav = (id, favorite) => {
    // console.log( `App to .setState/toggle on ${id} newFav = ${favorite}`);

    // iter over songData, find matching id and change its newFav value
    const newSongData = this.state.songData;
    for (let song of newSongData) {
      if (song.id === id) {
        song.favorite = !(song.favorite);
        break;
      }
    };
    
    this.setState({
      songData: newSongData
    })
    
    // ALTERNATIVE way of iterating over newSongData... I suppose this is more efficient cuz u .map only once, compared to up to twice above
    // I got this from scrimba video tutorials, but i don't like the pattern, 
    // so I'm sticking with my own, much easier to understand
    // this.setState(prevState => {
    //   const newSongData = prevState.songData.map( song => {
    //     if (song.id === id) { song.favorite = !song.favorite; }
    //     return song;
    //   })
    //   return { songData:newSongData }
    // })
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
            parentCB_Fav={this.toggleFav}
          />
        </main>
      </div>
    );
  }
}

export default App;
