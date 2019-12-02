import React from 'react';
import "./styles/RadioSet.css";

import Playlist from './Playlist';

const RadioSet = (props) => {
  // console.log(`Radio set for ${props.tracks.length} tracks`);

  const playlists = {
    morningTracks: props.tracks.slice(0, props.tracks.length / 2),
    eveningTracks: props.tracks.slice(props.tracks.length / 2, props.tracks.length)
  };

  const radioSetCB_Fav = (id, favorite) => {
    // console.log( `RadioSet -> App... toggle on ${id} newFav = ${favorite}`);
    props.parentCB_Fav(id, favorite);
  }


  return (
    <div className="radio-set">
      <section className="radio-set--playlist-container">
        <Playlist
          side="Morning"
          tracks={playlists.morningTracks}
          parentCB_Fav={radioSetCB_Fav}
          // parentCB_Top={radioSetCB_Top}
        />
        <Playlist
          side="Evening"
          tracks={playlists.eveningTracks}
          parentCB_Fav={radioSetCB_Fav}
        />
      </section>
    </div>
  );
};

export default RadioSet;