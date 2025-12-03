import React from 'react';
import { X, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function FullPlayer({ onClose }) {
  return (
    <div className="full-player-overlay">
      <button onClick={onClose}><X /></button>
      <div className="full-player-cover"></div>
      <div className="full-player-info">
        <h2>Song Title</h2>
        <p>Artist</p>
      </div>
      <div className="full-player-controls">
        <button><SkipBack /></button>
        <button><Play /></button>
        <button><SkipForward /></button>
      </div>
      <input type="range" />
    </div>
  );
}
