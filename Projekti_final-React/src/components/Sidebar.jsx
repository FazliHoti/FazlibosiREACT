import React from 'react';
import { Home, Music, ListMusic, Download, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">🎵 MyMusic</div>
      <nav className="nav-items">
        <button><Home /> Home</button>
        <button><Music /> Songs</button>
        <button><ListMusic /> Playlist</button>
        <button><Download /> Downloads</button>
        <button><User /> Profile</button>
        <button><LogOut /> Logout</button>
      </nav>
    </div>
  );
}
