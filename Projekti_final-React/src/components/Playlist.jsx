import React, { useState } from 'react';

const playlist = [
  { id: 1, title: 'Song A' },
  { id: 2, title: 'Song B' },
];

export default function Playlist() {
  const [active, setActive] = useState(1);

  return (
    <div className="playlist-view">
      <div className="playlist-header">
        <h3>Playlist</h3>
        <button>Add Song</button>
      </div>
      <div className="playlist-list">
        {playlist.map((song, idx) => (
          <div 
            key={song.id} 
            className={`playlist-item ${active === song.id ? 'active' : ''}`}
            onClick={() => setActive(song.id)}
          >
            <div className="playlist-index">{idx+1}</div>
            <div className="playlist-cover"></div>
            <div className="playlist-details">{song.title}</div>
            <div className="playlist-actions"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
