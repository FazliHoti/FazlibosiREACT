import React from 'react';

export default function Featured() {
  return (
    <div className="featured">
      <div className="featured-content">
        <span className="featured-tag">Top Pick</span>
        <h2>Song Title</h2>
        <p>Artist Name</p>
        <button>Play</button>
      </div>
      <div className="featured-music"></div>
    </div>
  );
}
