import React from 'react'
import PropTypes from 'prop-types'
import './styles/Playlist.css';

import Track from './Track';

const calculatePlayTime = (tracks) => {
  let minutes = 0;
  let seconds = 0;
  tracks.forEach((track) => {
    const times = track.playtime.split(':');
    minutes += parseInt(times[0]);
    seconds += parseInt(times[1]);
  });

  minutes += Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;

  seconds = ("" + seconds).padStart(2, "0");
  minutes = ("" + minutes).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

class Playlist extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      side: props.side,
      tracks: props.tracks,
      parentCB_Fav: props.parentCB_Fav,
      parentCB_Top: props.parentCB_Top,
    }
  }

  playlistCB_Fav = (id, favorite) => {
    console.log(`playlistCB -> RadioSet... toggle on ${id} newFav=${favorite}`);
    
    this.state.parentCB_Fav(id, favorite);
  }

  playlistCB_Order = (id, order) => {
    console.log(`playlistCB -> RadioSet... id ${id} was order ${order} promoted to ORDER 0 in ${this.state.side} playlist`);
    
    // first locate newTopTrack
    const newTracksByOrder = this.state.tracks.sort(function(a,b){return a.order > b.order});
    const newTopTrack = newTracksByOrder.find( track => track.order === order);
    let emptySeat = newTopTrack.order;

    // have everyone on top of it move 1 down as the curr focus bubbles up to the top spot
    for (let i = newTopTrack.order-1; i >= 0; i-- ){
      const comparingTrack = newTracksByOrder[i]
      
      console.log(`${comparingTrack.title} vs ${newTopTrack.title}, where order = ${comparingTrack.order} vs ${emptySeat}`);
      comparingTrack.order = emptySeat;
      emptySeat -= 1;
      console.log(`empty seat = ${emptySeat}`);
      
      console.log(`${comparingTrack.title} is now Order${comparingTrack.order}\n\n`);
    }
    newTopTrack.order = 0;
    
    this.setState({
      tracks: newTracksByOrder
    })

    console.log(newTracksByOrder[0]);
    console.log(newTracksByOrder[1]);
    console.log(newTracksByOrder[2]);
    console.log(newTracksByOrder[3]);

    // ??? send entire playlist backup to App with their updated order params.
    this.state.parentCB_Top(newTracksByOrder);
  }


  render() {
    const tracks = this.state.tracks;
    const trackCount = tracks.length;
    const playtime = calculatePlayTime(tracks);
    const trackElements = tracks.map((track, i) => {
      return (
        <Track
          key={track.order} // changed from track.id
          {...track}
          id={track.id}
          favorite={track.favorite}
          parentCB_Fav={this.playlistCB_Fav}
          parentCB_Order={this.playlistCB_Order}
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
