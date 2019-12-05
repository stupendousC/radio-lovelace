import React from 'react';

export const Capitalize = function(props) {
    return props.charAt(0).toUpperCase() + props.slice(1);
  }

export const parsePlaytime = function(playtimeStr) {
  //  playtimeStr is in format of "mm:ss", such as "5:30" or "10:21"
  // console.log(`parsing ${playtimeStr} to integer in seconds`);
  const len = playtimeStr.length;
  const ss = playtimeStr.slice(len-2, len);
  const mm = playtimeStr.slice(0, len-3);
  
  const totalSecs = parseInt(ss) + (60 * parseInt(mm));
  // console.log(`... = ${totalSecs}`);
  return totalSecs;  
  }

