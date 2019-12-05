
export const Capitalize = function(props) {
    return props.charAt(0).toUpperCase() + props.slice(1);
  }

export const parsePlaytime = function(playtimeStr) {
  // playtimeStr is in format of "mm:ss", such as "5:30" or "10:21"
  const time = playtimeStr.split(':');
  const mm = time[0];
  const ss = time[1];
  
  const totalSecs = parseInt(ss) + (60 * parseInt(mm));
  return totalSecs;  
  }

export const parseToHHMMSS = function(playtimeInSeconds) {
  // playtimeInSeconds is in integer of seconds, return as "HH:MM:SS" format
  const minAndHours = Math.floor(playtimeInSeconds / 60);
  const ss = playtimeInSeconds % 60;
  const hh = Math.floor(minAndHours / 60);
  const mm = minAndHours % 60;
  return `${hh}:${mm}:${ss}`;
}

// this came from Playlist originally, just stashing it here for now.  
// I ended up calculating playtime another way instead
export const calculatePlayTime = (tracks) => {
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

