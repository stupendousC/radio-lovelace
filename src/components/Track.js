import PropTypes from 'prop-types';
import React from 'react';
import "./styles/Track.css";


// Here we use destructuring to extract the props into separate variables
// See https://wesbos.com/destructuring-objects/
const Track = ({parentCB_Switch, playlistName, parentCB_Fav, parentCB_Order, id, title, artist, playtime, albumart, favorite}) => {

  const sendNewFavUp = () => {
    // console.log(`\nu clicked on  ${title} id=${id} newFavorite=${!favorite}`);

    // send the newFav up the chain to Playlist, which will then send to Radioset, which will then send to App.js
    parentCB_Fav(id, !favorite)
  }

  const sendNewOrderUp = () => {
    // console.log(`\nEVENT TRIGGERED: New Top song = ${title} id=${id}`);
    parentCB_Order(id);
  }

  const switchList = () => {
    // console.log(`\nEVENT TRIGGERED: song ${title} is switching from ${playlistName} list`);
    parentCB_Switch(id, playlistName);
  }

  const moveUp1 = () => {
    console.log(`\nEVENT TRIGGERED: Move up by 1 spot: ${title} id=${id}`);
    // TODO!
  }

  const moveDown1 = () => {
    console.log(`\nEVENT TRIGGERED: Move down by 1 spot: ${title} id=${id}`);
    // TODO!
  }

  return (
    <li className="track">
      <img className="track--albumart" alt={`album art for ${title}`} src={albumart} />
      <h3 className="track--title">{title}</h3>
      <input
        type="checkbox"
        className="track--favorite"
        checked={favorite}
        onChange={sendNewFavUp}
      />
      <p className="track--artist">{artist}</p>
      <p className="track--playtime">{playtime}</p>

      <button
        className="track--control track--up-1"
        onClick={moveUp1}
        >
        <span role="img" aria-label="point up">👆</span>
      </button>

      <button
        className="track--control track--down-1"
        onClick={moveDown1}
        >
        <span role="img" aria-label="point down">👇</span>
      </button>

      <button
        className="track--control track--to-top"
        onClick={sendNewOrderUp}
        >
        <span role="img" aria-label="send to top">🔝</span>
      </button>

      <button
        className="track--control track--switch"
        onClick={switchList}
        >
        <span role="img" aria-label="switch lists">↔</span>
      </button>
    </li>
  );
};

Track.propTypes = {
  title: PropTypes.string,
  artist: PropTypes.string,
  playtime: PropTypes.string,
  albumart: PropTypes.string,
  favorite: PropTypes.bool,
}

export default Track;
