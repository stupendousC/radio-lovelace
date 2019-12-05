import React from 'react';
import "./styles/RadioSet.css";
import Playlist from './Playlist';
import {calculatePlayTime} from './Helpers';

export default class RadioSet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playlists: {
        morning: this.genDefaultPlaylists(props)[0],
        evening: this.genDefaultPlaylists(props)[1],  // UGH!!! I DONT WANNA DO THIS AGAIN!
      },
      parentCB_Fav: props.parentCB_Fav,
      
      topOrderSongId: null,
      topOrderPlaylist: null,
    }
  }

  genDefaultPlaylists = (props) => {
    // TODO: split the tracks into 2 playlists such that the playtimes are ~equal.  Big O = ?
    
    // generating tracksPlaytimeSorted is probably O(n log n)
    const tracksPlaytimeSorted = props.tracks.sort( (a,b) => { 
      return ((a.playtimeTotalSecs) - (b.playtimeTotalSecs) 
    )});

    console.log(tracksPlaytimeSorted);
    
    // now open up the zipper, 1 track goes on left and 1 track goes on right, etc. 
    let first = [];
    let second = [];

    // HOLD UP!!!!!!!! EVEN BETTER SOLUTION!!! 
      // setup: add longest song to array1
    // iterate thru all tracks starting from the high end, index -2
      // add curr song to whichever array that has the shorter total runtime
      // this way, everystep is actively trying to even out the difference between the two,
      // like, if we had a single super outlier, we'll start the first few rounds like abbbbb... 
      // until it eventually becomes abababab :-D!!!!!  Whatever little difference at teh end will be minimal :-D
    



    // DECENT IF THERE'S NO OUTLIERS
    // tracksPlaytimeSorted.map ((track, i) => {
    //   return (i%2 === 0)? (first.push(track)):(second.push(track));
    // })
    // // theoretically first[] and second[] should have ~equal playtime,
    // // ... UNLESS there's a single outlier that ruins the balance (which, in this case, there is)

    // // check for playtime equality (i'd rather do it here, than send it down to playlist to check there)
    // let firstPlaytimesAll = first.reduce((a,b) => a + b.playtimeTotalSecs, 0);
    // let secondPlaytimesAll = second.reduce((a,b) => a + b.playtimeTotalSecs, 0);
    // const diff = Math.abs(firstPlaytimesAll - secondPlaytimesAll);
    // const acceptableDiff = 300;    // I'm ok if the 2 playlists were less than 5 min apart
    // let longerList;
    // let shorterList;

    // if (diff <= acceptableDiff) {
    //   // good, both playlist total run times are within the acceptableDiff range from each other
    //   return [first, second];
    // } else if (firstPlaytimesAll > secondPlaytimesAll) {
    //   longerList = first;
    //   shorterList = second;
    // } else if (firstPlaytimesAll < secondPlaytimesAll) {
    //   longerList = second;
    //   shorterList = first;
    // }
    
    // const playtimeToMove = diff/2;
    // console.log(playtimeToMove);
    // // go to the longer list, find a song with playtimeTotalSecs closest to this playtimeToMove value, and move it to the shorter list :-D
    // // do this with finding whichever has the minimum value of Math.abs(songObj.playtimeTotalSecs - playtimeToMove)








    console.log(firstPlaytimesAll, secondPlaytimesAll);
    
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
