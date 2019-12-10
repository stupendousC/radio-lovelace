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
      // side: props.side,
      // tracks: props.tracks,
      // totalRuntime: props.totalRuntime,
      // parentCB_Fav: props.parentCB_Fav,
      parentCB_Top: props.parentCB_Top,
      parentCB_Switch: props.parentCB_Switch,
    }
  }

  playlistCB_Fav = (id, favorite) => {
    // console.log(`playlistCB -> RadioSet... toggle on ${id} newFav=${favorite}`);
    this.state.parentCB_Fav(id, favorite);
  }
  
  playlistCB_Order = (id) => {
    console.log(`passing ${id} onto RadioSetCB_TOP`);
    this.state.parentCB_Top(id);
  }

  playlistCB_Switch = (id, playlistName) => {
    // console.log(`passing it back up to Radioset! ${id} & ${playlistName}`);
    this.state.parentCB_Switch(id, playlistName);
  }

  playlistCB_UpDown = (id, delta) => {
    // console.log(`chosen song id=${id} to move by ${delta} positions`);
    
    const currTrackOrder = this.state.tracks.slice();
    
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
      tracks: currTrackOrder,
    })
  }

  render(props) {
    const tracks = this.props.tracks;

    // I did receive the correct props, but it's not automatically saved to the state here
    console.log("Playlist RECEIVED", this.props.tracks.length);

    const trackCount = tracks.length;
    const playtime = parseToHHMMSS(this.props.totalRuntime); 
  
    console.log('PLAYLIST rendering from state: #',trackCount, 'tracks');

    
    
    const trackElements = tracks.map((track, i) => {
      return (
        <Track
          key={i} 
          {...track}
          id={track.id}
          favorite={track.favorite}
          parentCB_Fav={this.props.parentCB_Fav}
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
  parentCB_Top: PropTypes.func,
  parentCB_Switch: PropTypes.func,
}

export default Playlist;
