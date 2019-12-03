import React from 'react';
import "./styles/RadioSet.css";
import Playlist from './Playlist';
import {Capitalize} from './Helpers';

export default class RadioSet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playlists: {
        morning: props.tracks.slice(0, props.tracks.length / 2),
        evening: props.tracks.slice(props.tracks.length / 2, props.tracks.length),
      },
      parentCB_Fav: props.parentCB_Fav
    }
  }

  genDefaultPlaylists = () => {
    // TODO: split the tracks into 2 playlists such that the playtimes are ~equal.  Big O = ?
  }

  radioSetCB_Fav = (id, favorite) => {
    console.log( `RadioSet -> App... toggle on ${id} newFav = ${favorite}`);
    this.state.parentCB_Fav(id, favorite);
  }

  radioSetCB_Switch = (id, playlistName) => {
    console.log(`Radioset has received info: ${id} & ${[playlistName]}`);

    // identify oldTracks where song is from 
    let oldTracks;
    playlistName = playlistName.toLowerCase();

    for (let name of Object.keys(this.state.playlists)) {
      if (playlistName === name){
        oldTracks = this.state.playlists.morning;
      } else if (playlistName === name) {
        oldTracks = this.state.playlists.evening;
      }
    }

    // find song in oldTracks, remove & .setState()
    for (let i=0; i<oldTracks.length; i++) {
      if (oldTracks[i].id === id) {
        oldTracks.splice(i, 1);
        break;
      }
    }

    this.setState({})
    
    // send song to new playlist here in state
    console.log(oldTracks);
    
    // as part of render to Playlist, make the switched song the top of Playlist.state.trackIdsByOrder
    // trackIdsByOrder needs to be sent as props so Playlist knows to use our specs instead of their default fcn
  }

  addNewPlaylist = () => {
    // TODO: trickle down from app.js, also need a button there.
  }

  render() {
    return (
      <div className="radio-set">
        <section className="radio-set--playlist-container">

          {/* TODO!! INSTEAD OF HARDCODING IT, LOOP THRU the object.keys(this.state.playlists to gen the sides prop as a capitalized string!) */}
          <Playlist
            side="Morning"
            tracks={this.state.playlists.morning}
            parentCB_Fav={this.radioSetCB_Fav}
            parentCB_Switch={this.radioSetCB_Switch}
          />
          <Playlist
            side="Evening"
            tracks={this.state.playlists.evening}
            parentCB_Fav={this.radioSetCB_Fav}
            parentCB_Switch={this.radioSetCB_Switch}
          />
        </section>
      </div>
    );
  }
}
