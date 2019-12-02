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
      trackIdsByOrder: this.defaultTrackIdsByOrder(props),
      parentCB_Fav: props.parentCB_Fav,
    }
  }

  playlistCB_Fav = (id, favorite) => {
    // console.log(`playlistCB -> RadioSet... toggle on ${id} newFav=${favorite}`);
    this.state.parentCB_Fav(id, favorite);
  }

  // this is the initial .state of trackIdsByOrder, where it's just the ids in asc order in an array
  // ex: [0, 1, 2, 3 ... 42] for the am jams, and [43, 44, .... 85] for the pm songs.
  defaultTrackIdsByOrder = (props) => { 
    // for some reason... props.track.sort(); <- would also work, it automatically knows to sort by asc id...
    const tracksObjsByOrder = props.tracks.sort((a,b) => { return (parseInt(a.id) - parseInt(b.id)) });
    return tracksObjsByOrder.map( track => { return track.id }); 
  }

  // this is what gets the event trigger in Track.js will invoke, which will make the selected song
  // go to index 0 of state.trackIdsByOrder
  playlistCB_Order = (id) => {
    const currTrackOrder = this.state.trackIdsByOrder;
    console.log(`playlistCB: song id ${id} is now top in ${this.state.side} playlist's state.trackIdsByOrder`);
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


  render() {
    const tracks = this.state.tracks;

    // here we want tracks to appear in order per .state.trackIdsByOrder, instead of just the default ids
    const tracksInOrder = this.state.trackIdsByOrder.map ((id) => {
      // super import to leave the parseInt() in there, otherwise it won't work!!!
      const match = tracks.find ( track => parseInt(track.id) === parseInt(id) );
      return match;
    });

    // console.log(`TOP TRACK = ${tracksInOrder[0].title}`);

    const trackCount = tracks.length;
    const playtime = calculatePlayTime(tracks);

    const trackElements = tracksInOrder.map((track, i) => {
      return (
        <Track
          key={i} 
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
