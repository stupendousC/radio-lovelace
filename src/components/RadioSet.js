import React from 'react';
import "./styles/RadioSet.css";
import Playlist from './Playlist';

export default class RadioSet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playlists: {
        morning: props.tracks.slice(0, props.tracks.length / 2),
        evening: props.tracks.slice(props.tracks.length / 2, props.tracks.length),
      },
      playlistToSetTopOrder: null,
      parentCB_Fav: props.parentCB_Fav
    }
  }

  genDefaultPlaylists = (props) => {
    // FOR SOME REASON THIS DOESN'T WORK!!!!!!!!
    // TODO: split the tracks into 2 playlists such that the playtimes are ~equal.  Big O = ?
    const first = props.tracks.slice(0, props.tracks.length / 2);
    const second = props.tracks.slice(props.tracks.length / 2, props.tracks.length);
    return [first, second];
  }

  radioSetCB_Fav = (id, favorite) => {
    console.log( `RadioSet -> App... toggle on ${id} newFav = ${favorite}`);
    this.state.parentCB_Fav(id, favorite);
  }

  radioSetCB_Switch = (id, playlistName) => {
    console.log(`Radioset has received info: ${id} & ${[playlistName]}`);

    // identify 1. oldTracks where song is from, 2. newTracks where it's gonna go 
    let oldTracksName;
    let oldTracks;
    let newTracksName;
    let newTracks;
    playlistName = playlistName.toLowerCase();

    const allPlaylistEntries = Object.entries(this.state.playlists);

    for (let i=0; i<allPlaylistEntries.length; i++) {
      // For currPair & prevPair, index 0 = :name of the state.playlist, index 1 = [tracks]
      const currPair = allPlaylistEntries[i];

      const name = currPair[0];
      const tracks = currPair[1];
      if (playlistName === name) {
        oldTracksName = name;  
        oldTracks = tracks;
        
        let prevPair;
        if (i === allPlaylistEntries.length-1) {
          // if oldTracks happened to be the last of the state.playlists,
          // will need to loop around to start of the array get the newTracks
          prevPair = allPlaylistEntries[0];
        } else {
          prevPair = allPlaylistEntries[i+1];
        }
        newTracksName = prevPair[0]; 
        newTracks = prevPair[1];
        
        break; 
      }
    }
    
    // remove song from oldTracks, set aside, .setState()
    let song;
    for (let i=0; i<oldTracks.length; i++) {
      if (oldTracks[i].id === id) {
        song = oldTracks.splice(i, 1)[0];
        break;
      }
    }

    // send song to new playlist here in state
    newTracks.unshift(song);
    this.setState({ playlistToSetTopOrder: song.id })
    // send as props: tell them to use Playlist.playlistCB_Order(id) on our song!!!
  
    // setState() on the both oldTracks & newTracks
    console.log('NEED TO SET STATE!!!!!');
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
            // needs to go with the CORRECT playlistname!!!
            playlistToSetTopOrder={this.state.playlistToSetTopOrder}
          />
          <Playlist
            side="Evening"
            tracks={this.state.playlists.evening}
            parentCB_Fav={this.radioSetCB_Fav}
            parentCB_Switch={this.radioSetCB_Switch}
                        // needs to go with the CORRECT playlistname!!!

            playlistToSetTopOrder={this.state.playlistToSetTopOrder}
          />
        </section>
      </div>
    );
  }
}
