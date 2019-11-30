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

const Playlist = (props) => {
  const playlistCB_Fav = (id, favorite) => {
    console.log(`playlistCB -> RadioSet... toggle on ${id} newFav=${favorite}`);
    
    props.parentCB_Fav(id, favorite);
  }

  const playlistCB_Order = (id) => {
    console.log(`playlistCB -> RadioSet... id ${id} is NEW ORDER 1 in its playlist`);
    // store in a tempVar, have everyone on top of it move 1 down as the curr focus bubbles up to the top spot
    
  }


  const tracks = props.tracks;
  const trackCount = tracks.length;
  const playtime = calculatePlayTime(tracks);
  const trackElements = tracks.map((track, i) => {
    return (
      <Track
        key={track.id}
        {...track}
        id={track.id}
        favorite={track.favorite}
        parentCB_Fav={playlistCB_Fav}
        parentCB_Order={playlistCB_Order}
      />
    );
  });

  return (
    <div className="playlist">
      <h2>{props.side} Playlist</h2>
      <p>
        {trackCount} tracks - {playtime}
      </p>
      <ul className="playlist--track-list">
        {trackElements}
      </ul>
    </div>
  );
}

Playlist.propTypes = {
  tracks: PropTypes.array,
  side: PropTypes.string,
}

export default Playlist;
