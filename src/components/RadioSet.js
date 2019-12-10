import React from 'react';
import PropTypes from 'prop-types';
import "./styles/RadioSet.css";
import Playlist from './Playlist';
import {capitalize, sortById} from './Helpers';

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
    }
  }

  genDefaultPlaylists = (props) => {
    // Split the tracks into 2 playlists such that the playtimes are ~equal.  Big O = O(n^2)
    
    // generating tracksPlaytimeSorted is probably O(n log n)
    const tracksPlaytimeSorted = props.tracks.sort( (a,b) => { 
      return ((a.playtimeTotalSecs) - (b.playtimeTotalSecs) 
    )});

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

    // purely as an aesthetic choice, I want to present both playlists in asc order of song ids
    first = first.sort( (a,b) => { 
      return ((a.id) - (b.id) 
    )});
    second = sortById(second);
    return { playlists: [first, second], playlistRuntimes: [firstCumulRuntime, secondCumulRuntime]};
  }

  radioSetCB_Fav = (id, favorite) => {
    // console.log( `RadioSet -> App... toggle on ${id} newFav = ${favorite}`);
    this.state.parentCB_Fav(id, favorite);
  }

  radioSetCB_Top = (id, playlistName) => {
    // console.log(`RadioSet received ${id} to send to TOP of ${playlistName}`);
    const playlist = playlistName.toLowerCase();

    let updatedPlaylists = this.state.playlists;
    const currIndex = updatedPlaylists[playlist].findIndex( song => parseInt(song.id) === parseInt(id) );
    const newTopSong = updatedPlaylists[playlist].splice(currIndex, 1);
    updatedPlaylists[playlist].unshift(newTopSong[0]);

    this.setState({ playlists: updatedPlaylists });
  }

  radioSetCB_UpDown = (id, delta, playlistName) => {
    // console.log(`RadioSet received ${id} on ${playlistName}, move delta ${delta} spots`);
    const playlist = playlistName.toLowerCase();
    let updatedPlaylists = this.state.playlists;
    let affectedPlaylist = updatedPlaylists[playlist];
    
    const currIndex = affectedPlaylist.findIndex( song => song.id === parseInt(id) );
    
    let newIndex;
    if (delta === 1) {
      if (currIndex === 0) {
        // console.log("you're already at the top spot, done");
        return;
      } else {
        newIndex = currIndex - 1;
      }

    } else if (delta === -1) {
      if (currIndex === affectedPlaylist.length-1) {
        // console.log("you're already at the bottom spot, done");
        return;
      } else {
        newIndex = currIndex + 1;
      }
    }

    const temp = affectedPlaylist[newIndex];
    affectedPlaylist[newIndex] = affectedPlaylist[currIndex];
    affectedPlaylist[currIndex] = temp;

    this.setState({
      playlists: updatedPlaylists,
    })
  }

  removeSongFromList = (id, copy_oldPlaylistTracks) => {
    // remove song matching id from oldPlaylistTracks
    // return that song object with the updated oldPlaylistTracks array
      let song;
      for (let i=0; i<copy_oldPlaylistTracks.length; i++) {
        if (copy_oldPlaylistTracks[i].id === id) {
          song = copy_oldPlaylistTracks.splice(i, 1)[0];
          return [song, copy_oldPlaylistTracks];
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
    // console.log(`Radioset has received info: ${id} & ${[playlistName]}`);

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
        let copy_oldPlaylistTracks = tracks.slice();
        [song, updatedOldPlaylist] = this.removeSongFromList(id, copy_oldPlaylistTracks);
        const updatedOldPlaylistRuntime = this.updateListRuntime(oldPlaylistName, (-song.playtimeTotalSecs));

        // setState on oldList
        const updatedOldPlaylistInfo = {...this.state};
        updatedOldPlaylistInfo.playlists[name]= updatedOldPlaylist;
        updatedOldPlaylistInfo.playlistRuntimes[name]= updatedOldPlaylistRuntime;
        this.setState ({...updatedOldPlaylistInfo});
        
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
    
    // now ready to insert song into top of this current newPlaylist
    let updatedNewPlaylist = newPlaylist.slice();
    updatedNewPlaylist.unshift(song);
    // update that playlist's total runtime
    const updatedNewPlaylistRuntime = this.updateListRuntime(newPlaylistName, song.playtimeTotalSecs)
    // get copy of prev state, make changes, then setState()
    const updatedNewPlaylistInfo = {...this.state};
    updatedNewPlaylistInfo.playlists[newPlaylistName]= updatedNewPlaylist;
    updatedNewPlaylistInfo.playlistRuntimes[newPlaylistName]= updatedNewPlaylistRuntime;
    this.setState ({...updatedNewPlaylistInfo});
    }
  
  addNewPlaylist = () => {
    // TODO: trickle down from app.js, also need a button there.





  }

  render(props) {
    const allPlaylistComponents = () => {
      const allPlaylistEntries = Object.entries(this.state.playlists);
      
      return allPlaylistEntries.map ((playlistState, i) => {
        const name = playlistState[0];
        const tracks = playlistState[1];
        const totalRuntime = Object.entries(this.state.playlistRuntimes)[i][1];
        
        // console.log('RadioSet sending...',tracks.length, 'runtime=', totalRuntime);
        
        return (
              <Playlist 
                key={i}
                side={capitalize(name)}
                tracks={tracks}
                parentCB_Fav={this.props.parentCB_Fav}
                parentCB_Top={this.radioSetCB_Top}
                parentCB_UpDown={this.radioSetCB_UpDown}
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

RadioSet.propTypes = {
  tracks: PropTypes.array,
  parentCB_Fav: PropTypes.func,
}