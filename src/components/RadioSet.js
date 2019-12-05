import React from 'react';
import "./styles/RadioSet.css";
import Playlist from './Playlist';
import {calculatePlayTime} from './Helpers';

export default class RadioSet extends React.Component {
  constructor(props) {
    super(props)
    const [first, second] = this.genDefaultPlaylists(props)
    this.state = {
      playlists: {
        morning: first,
        evening: second,
      },
      parentCB_Fav: props.parentCB_Fav,
      
      topOrderSongId: null,
      topOrderPlaylist: null,
    }
  }

  genDefaultPlaylists = (props) => {
    // Split the tracks into 2 playlists such that the playtimes are ~equal.  Big O = O(n^2)
    
    // generating tracksPlaytimeSorted is probably O(n log n)
    const tracksPlaytimeSorted = props.tracks.sort( (a,b) => { 
      return ((a.playtimeTotalSecs) - (b.playtimeTotalSecs) 
    )});

    console.log(tracksPlaytimeSorted);

    // setup: add longest song to first array
    let first = [];
    let second = [];
    let firstCumulRuntime = 0;
    let secondCumulRuntime = 0;
    const length = tracksPlaytimeSorted.length;
    first.push(tracksPlaytimeSorted[length-1]);
    firstCumulRuntime += tracksPlaytimeSorted[length-1].playtimeTotalSecs;

    // iterate thru all tracks starting from the high end, index -2
    // O(n) * O(n) = O(n^2)
    for (let i = length-2; i >= 0; i--) {
      // add curr song to whichever array that has the shorter total runtime
      if (firstCumulRuntime < secondCumulRuntime) {
        first.push(tracksPlaytimeSorted[i]);
        firstCumulRuntime += tracksPlaytimeSorted[i].playtimeTotalSecs;
      } else {
        second.push(tracksPlaytimeSorted[i]);
        secondCumulRuntime += tracksPlaytimeSorted[i].playtimeTotalSecs;
      }
    }
    return [first, second];
  }

  radioSetCB_Fav = (id, favorite) => {
    console.log( `RadioSet -> App... toggle on ${id} newFav = ${favorite}`);
    this.state.parentCB_Fav(id, favorite);
  }

  radioSetCB_Switch = (id, playlistName) => {
    console.log(`Radioset has received info: ${id} & ${[playlistName]}`);
    
    console.log("PAUSED!");
    return;

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
    this.setState({ topOrderSongId: song.id, topOrderPlaylist: {newTracksName} })
    // send as props with the CORRECT <Playlist /> to tell them to use Playlist.playlistCB_Order(id) on our song!!!
  
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

          {/* TODO!! INSTEAD OF HARDCODING IT, LOOP THRU the object.entries(this.state.playlists to gen the sides prop as a capitalized string!) */}
          <Playlist
            side="Morning"
            tracks={this.state.playlists.morning}
            parentCB_Fav={this.radioSetCB_Fav}
            parentCB_Switch={this.radioSetCB_Switch}
            // needs to go with the CORRECT playlistname!!!
            topOrderSongId={this.state.topOrderSongId}
            topOrderPlaylist={this.state.topOrderPlaylist}
          />
          <Playlist
            side="Evening"
            tracks={this.state.playlists.evening}
            parentCB_Fav={this.radioSetCB_Fav}
            parentCB_Switch={this.radioSetCB_Switch}
            // needs to go with the CORRECT playlistname!!!
            topOrderSongId={this.state.topOrderSongId}
            topOrderPlaylist={this.state.topOrderPlaylist}
          />
        </section>
      </div>
    );
  }
}
