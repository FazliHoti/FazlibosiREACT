import React from 'react';

const songs = [
  { id: 1, title: 'Song 1', cover: '' },
  { id: 2, title: 'Song 2', cover: '' },
  { id: 3, title: 'Song 3', cover: '' },
];

export default function RecentSongs() {
  return (
    <div className="recent-grid">
      {songs.map(song => (
        <div key={song.id} className="song-tile">
          <div className="song-cover">{/* img goes here */}</div>
          <span>{song.title}</span>
        </div>
      ))}
      <div className="add-tile">+ Add Song</div>
    </div>
  );
}
