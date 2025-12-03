import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Featured from './components/Featured';
import RecentSongs from './components/RecentSongs';
import Playlist from './components/Playlist';
import Downloads from './components/Downloads';
import FullPlayer from './components/FullPlayer';
import './style.css';

function App() {
  const [playerOpen, setPlayerOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar />
      <MobileNav />
      <main className="main-content-area">
        <Featured />
        <RecentSongs />
        <Playlist />
        <Downloads />
      </main>
      {playerOpen && <FullPlayer onClose={() => setPlayerOpen(false)} />}
    </div>
  );
}

export default App;
