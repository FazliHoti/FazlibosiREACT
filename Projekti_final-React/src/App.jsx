import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  Upload, Music, ListMusic, X, Home, Download, User, LogOut, 
  Search, Heart, Disc, Sparkles, Mic2, AlignLeft
} from 'lucide-react';

// --- Default Data ---
const INITIAL_SONGS = [
  {
    id: 1,
    title: "Sample Track One",
    artist: "Unknown Artist",
    cover: "/api/placeholder/400/400",
    src: "" 
  },
  {
    id: 2,
    title: "Sample Track Two",
    artist: "Unknown Artist",
    cover: "/api/placeholder/400/400",
    src: "" 
  }
];

const MOCK_DOWNLOADS = [
  { id: 101, title: "Cyberpunk City", artist: "Synthwave Boy", size: "4.2 MB" },
  { id: 102, title: "Ocean Waves", artist: "Nature Sounds", size: "8.1 MB" },
  { id: 103, title: "Lo-Fi Study", artist: "Chill Beats", size: "3.5 MB" },
];

const App = () => {
  // --- Global State ---
  const [view, setView] = useState('home'); // home, downloads, playlist, login, signup
  const [user, setUser] = useState(null); // null or object
  
  // --- Audio State ---
  const [songs, setSongs] = useState(INITIAL_SONGS);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showFullPlayer, setShowFullPlayer] = useState(false); 

  // --- AI State ---
  const [vibeResult, setVibeResult] = useState("");
  const [isAnalyzingVibe, setIsAnalyzingVibe] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  // --- Refs ---
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- Helpers ---
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // --- Gemini API Integration ---
  const apiKey = ""; // API key injected by environment

  const callGemini = async (prompt) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Sorry, I couldn't connect to the AI service right now.";
    }
  };

  const handleVibeCheck = async () => {
    if (songs.length === 0) return;
    setIsAnalyzingVibe(true);
    setVibeResult("");
    
    const songList = songs.map(s => `${s.title} by ${s.artist}`).join(", ");
    const prompt = `I have a music playlist with these songs: ${songList}. Analyze the titles and artists and give me a fun, 1-sentence "Vibe Check" description of this playlist's mood. Be creative, maybe use an emoji.`;

    const result = await callGemini(prompt);
    setVibeResult(result);
    setIsAnalyzingVibe(false);
  };

  const handleGenerateLyrics = async () => {
    const song = songs[currentSongIndex];
    if (!song) return;
    
    setIsGeneratingLyrics(true);
    setShowLyrics(true);
    setLyrics("Generating creative lyrics...");

    const prompt = `Write creative, fictional lyrics for a song titled "${song.title}" by "${song.artist}". Structure it with Verse 1, Chorus, Verse 2, Chorus. Keep it concise.`;

    const result = await callGemini(prompt);
    setLyrics(result);
    setIsGeneratingLyrics(false);
  };

  // --- Effects ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Playback prevented:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Clear lyrics when song changes
  useEffect(() => {
    setLyrics("");
    setShowLyrics(false);
  }, [currentSongIndex]);

  // --- Audio Handlers ---
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newSongs = files.map((file, index) => ({
      id: Date.now() + index,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
      cover: null,
      src: URL.createObjectURL(file)
    }));

    if (songs.length === 2 && songs[0].src === "") {
      setSongs(newSongs);
      setCurrentSongIndex(0);
    } else {
      setSongs([...songs, ...newSongs]);
    }
    
    if (!isPlaying && songs[0].src === "") setIsPlaying(true);
    setView('playlist'); 
    setVibeResult(""); // Clear old vibe check
  };

  const skipForward = () => setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  const skipBack = () => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    }
  };
  const deleteSong = (e, index) => {
    e.stopPropagation();
    const newSongs = songs.filter((_, i) => i !== index);
    setSongs(newSongs);
    if (currentSongIndex >= index && currentSongIndex > 0) setCurrentSongIndex(prev => prev - 1);
  };

  // --- Auth Handlers ---
  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: "Music Lover", email: "user@example.com" });
    setView('home');
  };
  
  const handleSignup = (e) => {
    e.preventDefault();
    setUser({ name: "New User", email: "new@example.com" });
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  // --- CSS Styles ---
  
  const COLOR_WHITE = '#ffffff';
  const COLOR_TEXT_PRIMARY = '#f8fafc';
  const COLOR_TEXT_SECONDARY = '#94a3b8';
  const COLOR_TEXT_ACCENT = '#818cf8';
  const COLOR_BG_DARK = '#0f172a';
  const COLOR_BG_MEDIUM = '#1e293b';
  const COLOR_ACCENT = '#4f46e5';
  const COLOR_ACCENT_HOVER = '#6366f1'; 

  const SIDEBAR_WIDTH = '256px';
  const PLAYER_BAR_HEIGHT_MOBILE = '80px';
  const PLAYER_BAR_HEIGHT_DESKTOP = '96px';

  const styles = {
    colorWhite: COLOR_WHITE,
    colorTextPrimary: COLOR_TEXT_PRIMARY,
    colorTextSecondary: COLOR_TEXT_SECONDARY,
    colorTextAccent: COLOR_TEXT_ACCENT,
    colorBgDark: COLOR_BG_DARK,
    colorBgMedium: COLOR_BG_MEDIUM,
    colorAccent: COLOR_ACCENT,
    colorAccentHover: COLOR_ACCENT_HOVER,

    sidebarWidth: SIDEBAR_WIDTH,
    playerBarHeight: PLAYER_BAR_HEIGHT_MOBILE,

    global: `
        /* Utility Classes */
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .rounded-full { border-radius: 9999px; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-3xl { border-radius: 1.5rem; }
        .truncate { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        
        /* Sidebar Styles */
        .sidebar {
            display: none;
            flex-direction: column;
            width: ${SIDEBAR_WIDTH};
            background-color: ${COLOR_BG_DARK};
            border-right: 1px solid ${COLOR_BG_MEDIUM};
            padding: 1.5rem;
            flex-shrink: 0;
            z-index: 20;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            height: 95;
            overflow-y: auto;
        }

        /* Main Content */
        .main-content-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 100vh;
            position: relative;
            z-index: 10;
            overflow: hidden;
        }
        .main-view-container {
            flex: 1;
            overflow-y: auto;
            -ms-overflow-style: none;
            scrollbar-width: none;
            padding-bottom: ${PLAYER_BAR_HEIGHT_MOBILE};
        }
        .main-view-container::-webkit-scrollbar { display: none; }

        /* Mobile Nav */
        .mobile-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(15, 23, 42, 0.95);
            border-top: 1px solid ${COLOR_BG_MEDIUM};
            padding: 1rem 0;
            display: flex;
            justify-content: space-around;
            z-index: 50;
        }
        
        /* Player Bar */
        .player-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: ${PLAYER_BAR_HEIGHT_MOBILE};
            background-color: rgba(15, 23, 42, 0.95); 
            border-top: 1px solid ${COLOR_BG_MEDIUM};
            z-index: 40;
            padding: 0 0.5rem;
            margin-left: 3rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        /* Responsive Desktop Styles */
        @media (min-width: 768px) {
            .sidebar { display: flex; }
            .mobile-nav { display: none; }
            .main-content-area { margin-left: ${SIDEBAR_WIDTH}; }
            .player-bar { left: ${SIDEBAR_WIDTH}; height: ${PLAYER_BAR_HEIGHT_DESKTOP}; }
            .main-view-container { padding-bottom: ${PLAYER_BAR_HEIGHT_DESKTOP}; }
            .controls-desktop { display: flex !important; }
            .controls-mobile { display: none !important; }
        }

        @keyframes pulse-bar { 0%, 100% { height: 100%; } 50% { height: 50%; } }
        .animated-bar { animation: pulse-bar 0.8s ease-in-out infinite; }
        .animation-delay-75 { animation-delay: 0.075s; }
        .animation-delay-150 { animation-delay: 0.150s; }
        
        /* Sparkle Animation for AI Buttons */
        @keyframes sparkle { 0% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(1); } }
        .ai-button:hover svg { animation: sparkle 1s infinite; }

        input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: #475569; border-radius: 2px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 12px; width: 12px; border-radius: 50%; background: ${COLOR_ACCENT}; cursor: pointer; margin-top: -4px; }
    `
  };

  // --- Components ---

  const Sidebar = () => (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', color: styles.colorTextAccent }}>
        <Disc size={32} />
        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '-0.05em', color: styles.colorWhite }}>SonicWave</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 0.9 }}>
        {[
          { key: 'home', icon: Home, label: 'Home' },
          { key: 'playlist', icon: ListMusic, label: 'My Playlist' },
          { key: 'downloads', icon: Download, label: 'Downloads' }
        ].map(({ key, icon: Icon, label }) => (
          <button 
            key={key}
            onClick={() => setView(key)} 
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              transition: 'background-color 0.2s, color 0.2s',
              backgroundColor: view === key ? styles.colorAccent : 'transparent',
              color: view === key ? styles.colorWhite : styles.colorTextSecondary,
              cursor: 'pointer',
              border: 'none',
              fontWeight: 500
            }}
            onMouseEnter={(e) => { if (view !== key) e.currentTarget.style.backgroundColor = styles.colorBgMedium; e.currentTarget.style.color = styles.colorWhite; }}
            onMouseLeave={(e) => { if (view !== key) e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = styles.colorTextSecondary; }}
          >
            <Icon size={20} /> {label}
          </button>
        ))}
      </nav>

      {user ? (
        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: `1px solid ${styles.colorBgMedium}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(to tr, #6366f1, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: styles.colorWhite }}>
              {user.name[0]}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: styles.colorWhite }} className="truncate">{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }} className="truncate">Free Plan</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#f87171', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: `1px solid ${styles.colorBgMedium}` }}>
          <button onClick={() => setView('login')} style={{ width: '100%', padding: '0.5rem', backgroundColor: styles.colorBgMedium, color: styles.colorTextPrimary, borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.2s', border: 'none', cursor: 'pointer', marginBottom: '0.5rem' }}>
            Log In
          </button>
          <button onClick={() => setView('signup')} style={{ width: '100%', padding: '0.5rem', backgroundColor: styles.colorAccent, color: styles.colorWhite, borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.2s', border: 'none', cursor: 'pointer' }}>
            Sign Up
          </button>
        </div>
      )}
    </div>
  );

  const MobileNav = () => (
    <div className="mobile-nav">
      {[
        { key: 'home', icon: Home },
        { key: 'playlist', icon: ListMusic },
        { key: 'downloads', icon: Download },
        { key: user ? 'home' : 'login', icon: User }
      ].map(({ key, icon: Icon }) => (
        <button 
          key={key}
          onClick={() => setView(key)} 
          style={{ color: (view === key || (['login', 'signup'].includes(view) && key === 'login')) ? styles.colorTextAccent : styles.colorTextSecondary }}
        >
          <Icon size={24} />
        </button>
      ))}
    </div>
  );

  const AuthView = ({ type }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', maxWidth: '448px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Disc size={64} style={{ color: '#6366f1', margin: '0 auto', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: styles.colorWhite, marginBottom: '0.5rem' }}>{type === 'login' ? 'Welcome Back' : 'Join SonicWave'}</h2>
        <p style={{ color: styles.colorTextSecondary }}>Manage your local music library efficiently.</p>
      </div>
      <form onSubmit={type === 'login' ? handleLogin : handleSignup} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Email</label>
          <input type="email" required style={{ width: '100%', backgroundColor: styles.colorBgMedium, border: `1px solid #334155`, borderRadius: '0.75rem', padding: '0.75rem', color: styles.colorWhite, outline: 'none' }} placeholder="you@example.com" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Password</label>
          <input type="password" required style={{ width: '100%', backgroundColor: styles.colorBgMedium, border: `1px solid #334155`, borderRadius: '0.75rem', padding: '0.75rem', color: styles.colorWhite, outline: 'none' }} placeholder="••••••••" />
        </div>
        <button type="submit" style={{ width: '100%', backgroundColor: styles.colorAccent, color: styles.colorWhite, fontWeight: 'bold', padding: '0.75rem', borderRadius: '0.75rem', transition: 'background-color 0.2s', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)' }}>
          {type === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', color: styles.colorTextSecondary, fontSize: '0.875rem' }}>
        {type === 'login' ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setView(type === 'login' ? 'signup' : 'login')} style={{ color: styles.colorTextAccent, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          {type === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </div>
    </div>
  );

  const HomeView = () => (
    <div style={{ padding: '1.5rem 1.5rem 8rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: styles.colorWhite }}>Discover</h1>
          <p style={{ color: styles.colorTextSecondary }}>Listen to your local files in style.</p>
        </div>
        <div className="flex-center rounded-full" style={{ width: '2.5rem', height: '2.5rem', backgroundColor: styles.colorBgMedium, color: styles.colorTextSecondary }}>
           <Search size={20} />
        </div>
      </header>

      {/* Featured Banner */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '1.5rem', background: 'linear-gradient(to right, #4f46e5, #9333ea)', padding: '2rem', color: styles.colorWhite, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>NEW FEATURE</div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Local Playback</h2>
          <p style={{ marginBottom: '1.5rem', color: '#c7d2fe' }}>Upload your own MP3 files directly from your device and create custom playlists instantly.</p>
          <button 
            onClick={() => fileInputRef.current.click()}
            style={{ backgroundColor: styles.colorWhite, color: styles.colorAccent, padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 'bold', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}
          >
            <Upload size={20} /> Upload Songs
          </button>
        </div>
        <Music style={{ position: 'absolute', bottom: '-2.5rem', right: '-2.5rem', color: 'rgba(255, 255, 255, 0.1)', width: '300px', height: '300px' }} />
      </div>

      {/* Recent Grid */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: styles.colorWhite, marginBottom: '1rem' }}>Recently Added</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {songs.slice(0, 5).map((song, i) => (
            <div 
              key={song.id} 
              onClick={() => { setCurrentSongIndex(i); setIsPlaying(true); }} 
              style={{ backgroundColor: styles.colorBgMedium, padding: '1rem', borderRadius: '1rem', transition: 'background-color 0.2s', cursor: 'pointer' }}
            >
              <div style={{ aspectRatio: '1/1', backgroundColor: styles.colorBgDark, borderRadius: '0.75rem', marginBottom: '0.75rem', overflow: 'hidden', position: 'relative' }} className="flex-center">
                 {song.cover ? <img src={song.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Music size={40} style={{ color: '#475569' }} />}
              </div>
              <h4 style={{ fontWeight: 'bold', color: styles.colorWhite }} className="truncate">{song.title}</h4>
              <p style={{ fontSize: '0.875rem', color: styles.colorTextSecondary }} className="truncate">{song.artist}</p>
            </div>
          ))}
          {/* Add Tile */}
          <div onClick={() => fileInputRef.current.click()} style={{ border: `2px dashed #334155`, borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: styles.colorTextSecondary, cursor: 'pointer', minHeight: '160px' }}>
            <Upload size={32} />
            <span style={{ fontWeight: 'bold' }}>Add New</span>
          </div>
        </div>
      </div>
    </div>
  );

  const PlaylistView = () => (
    <div style={{ padding: '1.5rem 1.5rem 8rem 1.5rem', maxWidth: '896px', margin: '0 auto' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: styles.colorWhite }}>Your Library</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
            {/* ✨ AI Vibe Check Button */}
            <button 
                onClick={handleVibeCheck}
                disabled={isAnalyzingVibe}
                className="ai-button"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #6366f1, #d946ef)', color: styles.colorWhite, borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', transition: 'all 0.2s', border: 'none', cursor: 'pointer', opacity: isAnalyzingVibe ? 0.7 : 1 }}
            >
                {isAnalyzingVibe ? 'Analyzing...' : <><Sparkles size={16} fill="currentColor" /> Vibe Check</>}
            </button>
            <button onClick={() => fileInputRef.current.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: styles.colorBgMedium, color: styles.colorWhite, borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.2s', border: 'none', cursor: 'pointer' }}>
                <Upload size={18} /> Import
            </button>
        </div>
       </div>

       {/* AI Vibe Result Banner */}
       {vibeResult && (
           <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(217,70,239,0.2) 100%)', borderRadius: '1rem', border: '1px solid rgba(99,102,241,0.3)', color: styles.colorWhite, animation: 'fadeIn 0.5s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold', color: '#e879f9' }}>
                    <Sparkles size={18} /> AI Vibe Analysis
                </div>
                <p style={{ fontStyle: 'italic', lineHeight: '1.5' }}>"{vibeResult}"</p>
           </div>
       )}

       <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '1.5rem', overflow: 'hidden', border: `1px solid rgba(30, 41, 59, 0.5)` }}>
        {songs.map((song, index) => (
            <div 
                key={song.id}
                onClick={() => { setCurrentSongIndex(index); setIsPlaying(true); }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderBottom: `1px solid rgba(30, 41, 59, 0.5)`,
                    transition: 'background-color 0.2s',
                    cursor: 'pointer',
                    backgroundColor: currentSongIndex === index ? 'rgba(69, 10, 103, 0.2)' : 'transparent'
                }}
            >
                <div style={{ width: '2rem', textAlign: 'center', color: styles.colorTextSecondary, fontFamily: 'monospace', fontSize: '0.875rem' }}>{index + 1}</div>
                <div style={{ width: '3rem', height: '3rem', backgroundColor: '#334155', borderRadius: '0.5rem', flexShrink: 0, position: 'relative' }} className="flex-center">
                    {song.cover ? <img src={song.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Music size={20} style={{ color: styles.colorTextSecondary }} />}
                    {currentSongIndex === index && isPlaying && (
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', gap: '2px', height: '12px', alignItems: 'flex-end' }}>
                                <div className="animated-bar" style={{ width: '4px', backgroundColor: styles.colorTextAccent, height: '100%' }}></div>
                                <div className="animated-bar animation-delay-75" style={{ width: '4px', backgroundColor: styles.colorTextAccent, height: '66.666%' }}></div>
                                <div className="animated-bar animation-delay-150" style={{ width: '4px', backgroundColor: styles.colorTextAccent, height: '100%' }}></div>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 'bold', color: currentSongIndex === index ? styles.colorTextAccent : styles.colorWhite }} className="truncate">{song.title}</div>
                    <div style={{ fontSize: '0.875rem', color: styles.colorTextSecondary }} className="truncate">{song.artist}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button style={{ padding: '0.5rem', color: styles.colorTextSecondary, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer' }} onClick={(e) => deleteSong(e, index)}>
                        <X size={18} />
                    </button>
                    <button style={{ padding: '0.5rem', color: styles.colorTextSecondary, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Heart size={18} />
                    </button>
                </div>
            </div>
        ))}
        {songs.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: styles.colorTextSecondary }}>
                <Music size={48} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.5 }} />
                <p>Your library is empty. Upload some tunes!</p>
            </div>
        )}
       </div>
    </div>
  );

  const DownloadsView = () => (
    <div style={{ padding: '1.5rem 1.5rem 8rem 1.5rem', maxWidth: '768px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: styles.colorWhite, marginBottom: '0.5rem' }}>Downloads</h1>
      <p style={{ color: styles.colorTextSecondary, marginBottom: '2rem' }}>Manage your offline tracks.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {MOCK_DOWNLOADS.map(item => (
            <div key={item.id} style={{ backgroundColor: styles.colorBgMedium, padding: '1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', border: `1px solid #334155` }}>
                <div className="flex-center rounded-lg" style={{ width: '3rem', height: '3rem', backgroundColor: 'rgba(69, 10, 103, 0.5)', color: styles.colorTextAccent }}>
                    <Download size={20} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: styles.colorWhite }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: styles.colorTextSecondary }}>{item.artist} • {item.size}</div>
                </div>
                <button style={{ padding: '0.25rem 0.75rem', backgroundColor: '#334155', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', color: '#cbd5e1', border: 'none' }}>
                    Downloaded
                </button>
            </div>
        ))}
        <div style={{ padding: '1rem', borderRadius: '0.75rem', border: `2px dashed ${styles.colorBgMedium}`, textAlign: 'center', color: styles.colorTextSecondary, fontSize: '0.875rem', marginTop: '1rem' }}>
            Songs played from local upload are cached in browser memory only.
        </div>
      </div>
    </div>
  );

  const FullPlayerOverlay = () => {
    if (!showFullPlayer) return null;
    const song = songs[currentSongIndex];
    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', animation: 'fadeIn 0.3s' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
            <button onClick={() => setShowFullPlayer(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', color: styles.colorWhite, border: 'none', cursor: 'pointer' }}>
                <X size={24} />
            </button>
            
            {/* Song Cover / Lyrics Area */}
            <div style={{ width: '100%', maxWidth: '384px', height: '384px', marginBottom: '2rem', position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                 {showLyrics ? (
                    <div style={{ width: '100%', height: '100%', backgroundColor: styles.colorBgMedium, overflowY: 'auto', padding: '2rem', textAlign: 'center' }} className="scrollbar-hide">
                         <h3 style={{color: '#d946ef', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}><Sparkles size={16}/> Generated Lyrics</h3>
                         {isGeneratingLyrics ? (
                            <div style={{color: styles.colorTextSecondary, marginTop: '2rem'}}>Listening to the AI muse...</div>
                         ) : (
                            <div style={{whiteSpace: 'pre-line', lineHeight: '1.8', color: styles.colorWhite}}>{lyrics}</div>
                         )}
                    </div>
                 ) : (
                    song?.cover ? <img src={song.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to br, #6366f1, #9333ea)' }}><Music size={80} style={{ color: 'rgba(255, 255, 255, 0.5)' }} /></div>
                 )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '448px', width: '100%' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: styles.colorWhite, marginBottom: '0.5rem' }} className="truncate">{song?.title || "No Song"}</h2>
                <p style={{ fontSize: '1.125rem', color: styles.colorTextSecondary }} className="truncate">{song?.artist}</p>
            </div>
            
            {/* ✨ AI Lyrics Button */}
            <div style={{ marginBottom: '2rem' }}>
                <button 
                    onClick={showLyrics ? () => setShowLyrics(false) : handleGenerateLyrics} 
                    className="ai-button"
                    style={{ background: showLyrics ? styles.colorBgMedium : 'linear-gradient(135deg, #d946ef, #6366f1)', border: 'none', padding: '0.5rem 1rem', borderRadius: '2rem', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showLyrics ? <><Disc size={16}/> Show Art</> : <><Mic2 size={16}/> Generate Lyrics</>}
                </button>
            </div>

            <div style={{ width: '100%', maxWidth: '448px', marginBottom: '2rem' }}>
                 <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => { const t = parseFloat(e.target.value); audioRef.current.currentTime = t; setCurrentTime(t); }} style={{ width: '100%' }} />
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: styles.colorTextSecondary, fontFamily: 'monospace', marginTop: '0.25rem' }}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                 </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <button onClick={skipBack} style={{ color: '#d1d5db', background: 'none', border: 'none', cursor: 'pointer' }}><SkipBack size={40} /></button>
                <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: '5rem', height: '5rem', backgroundColor: styles.colorWhite, color: styles.colorBgDark, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)' }}>
                    {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" style={{ marginLeft: '4px' }} />}
                </button>
                <button onClick={skipForward} style={{ color: '#d1d5db', background: 'none', border: 'none', cursor: 'pointer' }}><SkipForward size={40} /></button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '320px' }}>
                <Volume2 size={20} style={{ color: styles.colorTextSecondary }} />
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ flex: 1, height: '4px' }} />
            </div>
        </div>
    );
  };

  const BottomPlayerBar = () => {
    if (['login', 'signup'].includes(view)) return null; 
    
    const song = songs[currentSongIndex];
    return (
        <div className="player-bar">
            {/* Song Info (Click to expand) */}
            <div onClick={() => setShowFullPlayer(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, cursor: 'pointer', maxWidth: '50%' }}>
                <div style={{ width: '3rem', height: '3rem', backgroundColor: styles.colorBgMedium, borderRadius: '0.5rem', flexShrink: 0 }} className="flex-center">
                     {song?.cover ? <img src={song.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3730a3' }}><Music size={20} style={{ color: '#a5b4fc' }} /></div>}
                </div>
                <div style={{ minWidth: 0, maxWidth: '100%' }}>
                    <div style={{ fontWeight: 'bold', color: styles.colorWhite, fontSize: '0.875rem' }} className="truncate">{song?.title || "Select a song"}</div>
                    <div style={{ fontSize: '0.75rem', color: styles.colorTextSecondary }} className="truncate">{song?.artist || "Artist"}</div>
                </div>
            </div>

            {/* Controls (Desktop) */}
            <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flex: 1, maxWidth: '448px' }} className="controls-desktop">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={skipBack} style={{ color: styles.colorTextSecondary, background: 'none', border: 'none', cursor: 'pointer' }}><SkipBack size={20} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} style={{ width: '2.5rem', height: '2.5rem', backgroundColor: styles.colorWhite, color: styles.colorBgDark, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s', border: 'none', cursor: 'pointer' }}>
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: '4px' }} />}
                    </button>
                    <button onClick={skipForward} style={{ color: styles.colorTextSecondary, background: 'none', border: 'none', cursor: 'pointer' }}><SkipForward size={20} /></button>
                </div>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>
                    <span>{formatTime(currentTime)}</span>
                    <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => { const t = parseFloat(e.target.value); audioRef.current.currentTime = t; setCurrentTime(t); }} style={{ flex: 1, height: '4px' }} />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

             {/* Controls (Mobile - Simple) */}
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '0.5rem' }} className="controls-mobile">
                <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} style={{ width: '2.5rem', height: '2.5rem', border: `1px solid #475569`, color: styles.colorWhite, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', cursor: 'pointer' }}>
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: '3px' }} />}
                </button>
             </div>

            {/* Volume (Desktop) */}
            <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem', width: '128px', justifyContent: 'flex-end' }} className="controls-desktop">
                <Volume2 size={18} style={{ color: styles.colorTextSecondary }} />
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ width: '80px', height: '4px' }} />
            </div>
        </div>
    );
  };

  // --- Main Render ---
  return (
    <div className="App">
      {/* Inject Global Styles */}
      <style>{styles.global}</style>
      
      {/* Background Ambience (simple color blobs) */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '800px', height: '800px', backgroundColor: 'rgba(69, 10, 103, 0.2)', borderRadius: '50%', filter: 'blur(3rem)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', backgroundColor: 'rgba(99, 102, 241, 0.2)', borderRadius: '50%', filter: 'blur(3rem)' }}></div>
      </div>

      <Sidebar />

      <main className="main-content-area">
        <div className="main-view-container">
            {view === 'login' && <AuthView type="login" />}
            {view === 'signup' && <AuthView type="signup" />}
            {view === 'home' && <HomeView />}
            {view === 'playlist' && <PlaylistView />}
            {view === 'downloads' && <DownloadsView />}
        </div>
      </main>

      <MobileNav />
      <BottomPlayerBar />
      <FullPlayerOverlay />

      {/* Hidden Global Audio & Input */}
      <audio
        ref={audioRef}
        src={songs[currentSongIndex]?.src}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={skipForward}
      />
      <input 
        type="file" 
        multiple 
        accept="audio/*" 
        style={{ display: 'none' }} 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
      />
    </div>
  );
};

export default App;