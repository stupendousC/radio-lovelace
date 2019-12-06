import React, { Component } from 'react';
import './App.css';

import RadioSet from './components/RadioSet';
import songData from './data/tracks.json';
import {parsePlaytime} from './components/Helpers';


songData.forEach((song, i) => {
  song.id = i;
  song.favorite = false;
  song.playtimeTotalSecs = parsePlaytime(song.playtime);
});

class App extends Component {

  constructor() {
    super()
    this.state = {
      songData: songData
    }
  }

  toggleFav = (id) => {
    // console.log( `App to .setState/toggle Fav on ${id});

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
  }

  makeNewPlaylist = (event) => {
    console.log(`Making new playlist called ${event.target}`);
    // TODO
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1 className="page-header--title">Radio Lovelace</h1>
        </header>

        <fieldset>
          <legend><h3>Add a new playlist</h3></legend>
          <input type="text" placeholder="LINK BUTTON TO THIS TEXT SOMEHOW!!!!" className="TODO"></input>
          <button type="submit" onClick={this.makeNewPlaylist}>Let's rock!</button>
        </fieldset>
        

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
