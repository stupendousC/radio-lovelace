import React, { Component } from 'react';
import './App.css';

import RadioSet from './components/RadioSet';
import songData from './data/tracks.json';
import {parsePlaytime} from './components/Helpers';
import { thisExpression } from '@babel/types';


songData.forEach((song, i) => {
  song.id = i;
  song.favorite = false;
  song.playtimeTotalSecs = parsePlaytime(song.playtime);
});

class App extends Component {

  constructor() {
    super()
    this.state = {
      songData: songData,
      newPlaylistName: "",
    }
  }

  toggleFav = (id) => {
    // console.log( `App to .setState/toggle Fav on ${id});

    const newSongData = this.state.songData;
    for (let song of newSongData) {
      if (song.id === id) {
        song.favorite = !(song.favorite);
        break;
      }
    };
    
    this.setState({ songData: newSongData });
  }

  monitorNewPlaylistName = (event) => {
    // save the state as user types in <input>, so onNewPlaylistSubmit() can send it out upon form submission
    // console.log(`u typed ${event.target.value}, state is ${this.state.newPlaylistName}`);
    this.setState({newPlaylistName: event.target.value});
  }

  onNewPlaylistSubmit = (event) => {
    // MUST do this or page will reload, and lose all Single Page App data...
    event.preventDefault();

    console.log(`Making new playlist called ${this.state.newPlaylistName}`);
    
    // NOT SURE WHAT TO DO NOW... 





    
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1 className="page-header--title">Radio Lovelace</h1>
        </header>

        <fieldset className="addNewPlaylist-fieldset">
          <h1>This doesn't work yet.</h1>
          <form onSubmit={this.onNewPlaylistSubmit}>
            <label>
              <h3>Add a new playlist</h3>
              <input type="text" value={this.state.newPlaylistName} onChange={this.monitorNewPlaylistName} name="newPlaylistName"></input>
            </label>
            <input type="submit" value="Let's Rock!" />
          </form>
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
