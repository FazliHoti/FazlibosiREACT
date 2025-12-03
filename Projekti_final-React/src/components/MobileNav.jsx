import React from 'react';
import { Home, Music, ListMusic, Download, User } from 'lucide-react';

export default function MobileNav() {
  return (
    <div className="mobile-nav">
      <button><Home /></button>
      <button><Music /></button>
      <button><ListMusic /></button>
      <button><Download /></button>
      <button><User /></button>
    </div>
  );
}
