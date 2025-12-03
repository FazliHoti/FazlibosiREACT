
import React from 'react';

const downloads = [
  { id: 1, title: 'Song X' },
  { id: 2, title: 'Song Y' },
];

export default function Downloads() {
  return (
    <div className="downloads-view">
      {downloads.map(download => (
        <div key={download.id} className="download-item">
          <div className="download-icon"></div>
          <div className="download-details">{download.title}</div>
          <button>Download</button>
        </div>
      ))}
    </div>
  );
}
