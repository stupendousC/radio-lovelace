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
      // tracks: props.tracks,
      // totalRuntime: props.totalRuntime,
      parentCB_Switch: props.parentCB_Switch,
    }
  }

  playlistCB_Fav = (id, favorite) => {
    // console.log(`playlistCB -> RadioSet... toggle on ${id} newFav=${favorite}`);
    this.state.parentCB_Fav(id, favorite);
  }
  
  playlistCB_Top = (id, playlistName) => {
    // console.log(`passing ${id} on ${playlistName} onto RadioSetCB_TOP`);
    this.props.parentCB_Top(id, playlistName);
  }

  playlistCB_Switch = (id, playlistName) => {
    // console.log(`passing it back up to Radioset! ${id} & ${playlistName}`);
    this.state.parentCB_Switch(id, playlistName);
  }

  playlistCB_UpDown = (id, delta, playlistName) => {
    // console.log(`chosen song id=${id} to move by ${delta} positions`);
    this.props.parentCB_UpDown(id, delta, playlistName);
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
          parentCB_Top={this.playlistCB_Top}
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
