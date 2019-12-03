import React from 'react';
import "./styles/RadioSet.css";
import Playlist from './Playlist';

export default class RadioSet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      morningTracks: props.tracks.slice(0, props.tracks.length / 2),
      eveningTracks: props.tracks.slice(props.tracks.length / 2, props.tracks.length),
      parentCB_Fav: props.parentCB_Fav
    }
  }

  radioSetCB_Fav = (id, favorite) => {
    console.log( `RadioSet -> App... toggle on ${id} newFav = ${favorite}`);
    
    this.state.parentCB_Fav(id, favorite);
  }

  radioSetCB_Switch = (id, playlistName) => {
    console.log(`Radioset has received info: ${id} & ${[playlistName]}`);
    
  }

  render() {
    return (
      <div className="radio-set">
        <section className="radio-set--playlist-container">
          <Playlist
            side="Morning"
            tracks={this.state.morningTracks}
            parentCB_Fav={this.radioSetCB_Fav}
            parentCB_Switch={this.radioSetCB_Switch}
          />
          <Playlist
            side="Evening"
            tracks={this.state.eveningTracks}
            parentCB_Fav={this.radioSetCB_Fav}
            parentCB_Switch={this.radioSetCB_Switch}
          />
        </section>
      </div>
    );
  }
}
