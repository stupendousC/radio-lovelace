  // Playlist doesn't need to be a class anymore, but I don't feel like changing it right now, got other things to fix



import React from 'react'
import PropTypes from 'prop-types'
import './styles/Playlist.css';
import Track from './Track';
import {parseToHHMMSS} from './Helpers';
// I moved calculatePlayTime() from here to Helpers b/c RadioSet is dealing with that instead

class Playlist extends React.Component {

  playlistCB_Fav = (id, favorite) => {
    // console.log(`playlistCB -> RadioSet... toggle on ${id} newFav=${favorite}`);
    this.props.parentCB_Fav(id, favorite);
  }
  
  playlistCB_Top = (id, playlistName) => {
    // console.log(`passing ${id} on ${playlistName} onto RadioSetCB_TOP`);
    this.props.parentCB_Top(id, playlistName);
  }

  playlistCB_Switch = (id, playlistName) => {
    // console.log(`passing it back up to Radioset! ${id} & ${playlistName}`);
    this.props.parentCB_Switch(id, playlistName);
  }

  playlistCB_UpDown = (id, delta, playlistName) => {
    // console.log(`chosen song id=${id} to move by ${delta} positions`);
    this.props.parentCB_UpDown(id, delta, playlistName);
  }

  render() {
    const tracks = this.props.tracks;

    const trackCount = tracks.length;
    const playtime = parseToHHMMSS(this.props.totalRuntime); 
  
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
          playlistName={this.props.side}
        />
      );
    });

    return (
      <div className="playlist">
        <h2>{this.props.side} Playlist</h2>
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
  parentCB_Fav: PropTypes.func,
  parentCB_Top: PropTypes.func,
  parentCB_Switch: PropTypes.func,
  parentCB_UpDown: PropTypes.func,
}

export default Playlist;
