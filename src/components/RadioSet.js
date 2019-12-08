import React from 'react';
import "./styles/RadioSet.css";
import Playlist from './Playlist';
import {Capitalize} from './Helpers';

export default class RadioSet extends React.Component {
  constructor(props) {
    super(props)
    const defaultPlaylistsHash = this.genDefaultPlaylists(props)
    const [first, second] = defaultPlaylistsHash.playlists
    const [firstCumulRuntime, secondCumulRuntime] = defaultPlaylistsHash.playlistRuntimes
    this.state = {
      playlists: {
        morning: first,
        evening: second,
      },
      playlistRuntimes: {
        morning: firstCumulRuntime,
        evening: secondCumulRuntime,
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
    // console.log(tracksPlaytimeSorted);

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
    return { playlists: [first, second], playlistRuntimes: [firstCumulRuntime, secondCumulRuntime]};
  }

  radioSetCB_Fav = (id, favorite) => {
    // console.log( `RadioSet -> App... toggle on ${id} newFav = ${favorite}`);
    this.state.parentCB_Fav(id, favorite);
  }

  removeSongFromList = (id, oldPlaylistTracks) => {
    // remove song from oldPlaylist & setState()
    // return that song object with the updated oldPlaylistTracks array
      let song;
      for (let i=0; i<oldPlaylistTracks.length; i++) {
        if (oldPlaylistTracks[i].id === id) {
          song = oldPlaylistTracks.splice(i, 1)[0];
          // console.log(`song found: ${song.title}`);
          return [song, oldPlaylistTracks];
        }
      }
  }
  
  updateListRuntime = (affectedPlaylistName, deltaTimeInSecs) => {
    // if removing song, deltaTimeInSecs will be negative.  Otherwise it's positive for adding a song.
    const currPlaylistRuntime = this.state.playlistRuntimes[affectedPlaylistName];
    const updatedRuntime = currPlaylistRuntime + deltaTimeInSecs;
    // console.log(`${affectedPlaylistName} runtime went from ${currPlaylistRuntime} to ${updatedRuntime}`);

    return updatedRuntime;
  }

  radioSetCB_Switch = (id, playlistName) => {
    console.log(`Radioset has received info: ${id} & ${[playlistName]}`);

    // identify 1. oldPlaylist where song is from, 2. newPlaylist where it's gonna go 
    const oldPlaylistName = playlistName.toLowerCase();
    let newPlaylistName;
    let newPlaylist;
    let song;

    const allPlaylistEntries = Object.entries(this.state.playlists);

    for (let i=0; i<allPlaylistEntries.length; i++) {
      const name = allPlaylistEntries[i][0];
      let tracks = allPlaylistEntries[i][1];

      if (name === oldPlaylistName) {
        // remove chosen song from this oldPlaylist's tracks, adjust its playtime, and set state
        let updatedOldPlaylist;
        [song, updatedOldPlaylist] = this.removeSongFromList(id, tracks.slice());
        const updatedOldPlaylistRuntime = this.updateListRuntime(oldPlaylistName, (-song.playtimeTotalSecs));

        console.log(`song is ${song.title}, runtime ${song.playtimeTotalSecs} oldPlaylist now has length ${updatedOldPlaylist.length} and new runtime ${updatedOldPlaylistRuntime}`);
        
        // setState on oldList... THIS DOES NOT WORK YET!!!
        const updatedOldPlaylistInfo =  { 
          playlists: { [name] : updatedOldPlaylist},
          playlistRuntimes: { [name] : updatedOldPlaylistRuntime},
        };
        
        console.log(updatedOldPlaylistInfo);
        
        // this.setState ({...updatedOldPlaylistInfo});
        console.log(`\nDOUBLE CHECK ON STATE, which should be set for OLDPLAYLIST both tracklist & runtime by now!!! `);

        // Assign newPlaylistName depending on index position of oldPlaylistName
        if (i < allPlaylistEntries.length - 1) {
          newPlaylistName = allPlaylistEntries[i+1][0];
          newPlaylist = allPlaylistEntries[i+1][1];
        } else {
          // if oldPlaylist is @ the end of this.state.playlists[], then newPlaylist will have to wrap around to index0 
          newPlaylistName = allPlaylistEntries[0][0];
          newPlaylist = allPlaylistEntries[0][1];
        }
        break;
      } 
    }
    
    
    // now ready to insert song into this current newPlaylist
    let updatedNewPlaylist = newPlaylist.slice();
    updatedNewPlaylist.push(song);
    // update that playlist's total runtime
    const updatedRuntime = this.updateListRuntime(newPlaylistName, song.playtimeTotalSecs)
    console.log(`SET STATE!!!!!!!!  ON: ${updatedNewPlaylist.length} tracks in ${newPlaylistName}, new runtime=${updatedRuntime}`);
    
    console.log( 'we want this song to be the first song in Playlist.state.trackIdsByOrder!');







    }
  


  addNewPlaylist = () => {
    // TODO: trickle down from app.js, also need a button there.





  }

  render() {

    const allPlaylistComponents = () => {
      const allPlaylistEntries = Object.entries(this.state.playlists);

      return allPlaylistEntries.map ((playlistState, i) => {
        const name = playlistState[0];
        const tracks = playlistState[1];
        const totalRuntime = Object.entries(this.state.playlistRuntimes)[i][1];
        
        return (
              <Playlist 
                key={i}
                side={Capitalize(name)}
                tracks={tracks}
                parentCB_Fav={this.radioSetCB_Fav}
                parentCB_Switch={this.radioSetCB_Switch}
                totalRuntime={totalRuntime}
              />
            );
      })
    }

    return (
      <div className="radio-set">
        <section className="radio-set--playlist-container">
          {allPlaylistComponents()}
        </section>
      </div>
    );
  }
}
