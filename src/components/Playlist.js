import React from 'react'
import PropTypes from 'prop-types'
import './styles/Playlist.css';
import Track from './Track';
import {parseToHHMMSS} from './Helpers';
// I moved calculatePlayTime() from here to Helpers b/c RadioSet is dealing with that instead

class Playlist extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      side: props.side,
      tracks: props.tracks,
      totalRuntime: props.totalRuntime,
      trackIdsByOrder: this.genTrackIdsByOrder(props),
      // trackIdsByOrder: this.defaultTrackIdsByOrder(props),
      parentCB_Fav: props.parentCB_Fav,
      parentCB_Switch: props.parentCB_Switch,
    }
  }

  playlistCB_Fav = (id, favorite) => {
    // console.log(`playlistCB -> RadioSet... toggle on ${id} newFav=${favorite}`);
    this.state.parentCB_Fav(id, favorite);
  }

  // NEED TO MAKE SURE THIS WORKS!!!!  DRY it via Radioset render returns!!
  genTrackIdsByOrder = (props) => {
    if (props.topOrderPlaylist === props.side) {
      // console.log(`Playlist will send id:${props.topOrder} to the TOP`);
      return this.playlistCB_Order(props.topOrder);

    } else {
      return this.defaultTrackIdsByOrder(props);
    }
  }

  defaultTrackIdsByOrder = (props) => { 
    // this is the initial .state of trackIdsByOrder, where it's just the ids in asc order in an array
    // ex: [0, 1, 2, 3 ... 42] for the am jams, and [43, 44, .... 85] for the pm songs.
    
    // for some reason... props.track.sort(); <- would also work, it automatically knows to sort by asc id...
    const tracksObjsByOrder = props.tracks.sort((a,b) => { return (parseInt(a.id) - parseInt(b.id)) });
    return tracksObjsByOrder.map( track => { return track.id }); 
  }
  
  playlistCB_Order = (id) => {
  // the event trigger in Track.js will invoke this, which will move the selected song to index 0 of state.trackIdsByOrder

    const currTrackOrder = this.state.trackIdsByOrder;
    // console.log(`playlistCB: song id ${id} is now top in ${this.state.side} playlist's state.trackIdsByOrder`);
    // console.log(`current order by Id is ${currTrackOrder}`);
    
    // get index of the new Top track
    const topIndex = currTrackOrder.findIndex( element => parseInt(element) === parseInt(id) );
    // super important to leave parseInt() in there, otherwise clicking on something again will give index -1!!!
    // topIndex CANNOT be -1, that means not found, do not erroneously put bottom track on top!
    
    // pluck out topTrack from whence it came, and put it in index 0
    const topTrack = currTrackOrder.splice(topIndex, 1);
    currTrackOrder.unshift(topTrack);

    this.setState({
      trackIdsByOrder: currTrackOrder,
    })
    
    // console.log(`new ORDER = ${this.state.trackIdsByOrder}`);
  }

  playlistCB_Switch = (id, playlistName) => {
    // console.log(`passing it back up to Radioset! ${id} & ${playlistName}`);
    this.state.parentCB_Switch(id, playlistName);
  }

  playlistCB_UpDown = (id, delta) => {
    // console.log(`chosen song id=${id} to move by ${delta} positions`);
    
    const currTrackOrder = this.state.trackIdsByOrder;
    
    const currIndex = currTrackOrder.findIndex( element => parseInt(element) === parseInt(id) );

    let newIndex;
    if (delta === 1) {
      if (currIndex === 0) {
        // console.log("you're already on the top spot, done");
        return;
      } else {
        newIndex = currIndex - 1;
      }

    } else if (delta === -1) {
      if (currIndex === currTrackOrder.length-1) {
        // console.log("you're already on the bottom spot, done");
        return;
      } else {
        newIndex = currIndex + 1;
      }
    }

    const temp = currTrackOrder[newIndex];
    currTrackOrder[newIndex] = currTrackOrder[currIndex];
    currTrackOrder[currIndex] = temp;

    this.setState({
      trackIdsByOrder: currTrackOrder,
    })
  }

  render() {
    const tracks = this.state.tracks;

    // here we want tracks to appear in order per .state.trackIdsByOrder, instead of just the default ids
    const tracksInOrder = this.state.trackIdsByOrder.map ((id) => {
      // super import to leave the parseInt() in there, otherwise it won't work!!!
      const match = tracks.find ( track => parseInt(track.id) === parseInt(id) );
      return match;
    });

    const trackCount = tracks.length;
    const playtime = parseToHHMMSS(this.state.totalRuntime); 
  
    const trackElements = tracksInOrder.map((track, i) => {
      return (
        <Track
          key={i} 
          {...track}
          id={track.id}
          favorite={track.favorite}
          parentCB_Fav={this.playlistCB_Fav}
          parentCB_Order={this.playlistCB_Order}
          parentCB_Switch={this.playlistCB_Switch}
          parentCB_UpDown={this.playlistCB_UpDown}
          playlistName={this.state.side}
        />
      );
    });

    return (
      <div className="playlist">
        <h2>{this.state.side} Playlist</h2>
        <p>
          {trackCount} tracks - {playtime}
        </p>
        <ul className="playlist--track-list">
          {trackElements}
        </ul>
      </div>
    );
  }
}

Playlist.propTypes = {
  tracks: PropTypes.array,
  side: PropTypes.string,
}

export default Playlist;
