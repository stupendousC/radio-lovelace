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
      trackIdsByOrder: this.defaultTrackIdsByOrder(props),
      parentCB_Fav: props.parentCB_Fav,
      parentCB_Switch: props.parentCB_Switch,
    }
  }

  playlistCB_Fav = (id, favorite) => {
    // console.log(`playlistCB -> RadioSet... toggle on ${id} newFav=${favorite}`);
    this.state.parentCB_Fav(id, favorite);
  }

  defaultTrackIdsByOrder = (props) => {
    // this is the initial .state of trackIdsByOrder, where it's just the ids in asc order in an array
    // ex: [0, 2, 7 ... 42] for the am jams, and [6, 10, 17, .... 85] for the pm songs.
    
    // RadioSet is sending props.tracks initially as pre-sorted by id, and whatever ranking changes the user makes will be reflected by the indices of the affected array(s)
    // Therefore I'm generating the state.trackIdsByOrder by index position.
    const tracksObjsByOrder = props.tracks.sort((a,b) => { return (parseInt(a.index) - parseInt(b.index)) });
    return tracksObjsByOrder.map( track => { return track.id }); 
  }
  
  playlistCB_Order = (id) => {
  // the event trigger in Track.js will invoke this, which will move the selected song to index 0 of state.trackIdsByOrder

    const currTrackOrder = this.state.trackIdsByOrder;
    
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
        // console.log("you're already at the top spot, done");
        return;
      } else {
        newIndex = currIndex - 1;
      }

    } else if (delta === -1) {
      if (currIndex === currTrackOrder.length-1) {
        // console.log("you're already at the bottom spot, done");
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

  render(props) {
    const tracks = this.state.tracks;

    // I did receive the correct props, but it's not automatically saved to the state here
    console.log("Playlist RECEIVED", this.props.tracks.length);
    

    // here we want tracks to appear in order per .state.trackIdsByOrder, instead of just the default ids
    const tracksInOrder = this.state.trackIdsByOrder.map ((id) => {
      // super import to leave the parseInt() in there, otherwise it won't work!!!
      const match = tracks.find ( track => parseInt(track.id) === parseInt(id) );
      return match;
    });

    const trackCount = tracks.length;
    const playtime = parseToHHMMSS(this.state.totalRuntime); 
  
    console.log('PLAYLIST rendering from state: #',trackCount, 'tracks');

    
    
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
  totalRuntime: PropTypes.number,
  trackIdsByOrder: PropTypes.array,
  parentCB_Fav: PropTypes.func,
  parentCB_Switch: PropTypes.func,
}

export default Playlist;
