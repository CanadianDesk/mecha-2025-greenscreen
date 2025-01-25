'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const tripleVideoRef = useRef<HTMLVideoElement>(null);
  const [currentState, setCurrentState] = useState(0);
  const [teamName, setTeamName] = useState('RED-1');

  const states = ['IDLE READY', 'PLAYING', 'IDLE ENDED'];

  const videoFileName = (teamName: string) => {
    return `/${teamName.toLowerCase()}.mp4`;
  };

  useEffect(() => {
    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      const currentVideo = tripleVideoRef.current;
      if (!currentVideo) return;

      switch (event.data) {
        case 'play-red-1':
        case 'play-red-2':
        case 'play-blue-1':
        case 'play-blue-2': {
          const newTeam = event.data.replace('play-', '').toUpperCase();

          if (teamName !== newTeam) {
            setTeamName(newTeam);
            currentVideo.currentTime = 0;
            currentVideo.loop = false;
            setCurrentState(0);
          } else if (currentState === 0) {
            setCurrentState(1);
            currentVideo.play();
          }
          break;
        }
      }
    };

    return () => {
      eventSource.close();
    };
  }, [teamName, currentState]);

  // Handle video source updates
  useEffect(() => {
    const video = tripleVideoRef.current;
    if (video) {
      video.load(); // Reload video when source changes
      setCurrentState(0);
    }
  }, [teamName]);

  return (
    <main>
      <div className="relative w-full max-w-[1920px] h-[1080px] bg-green-400 overflow-hidden mb-12">
        {/* DEBUG  */}
        <div className='absolute top-4 left-4 z-10 overflow-hidden'>
          <h1 className='text-white font-bold text-4xl upper'>debug info:</h1>
          <p className='text-white font-bold text-3xl'>team: {teamName}<br></br> mode: {states[currentState]}</p>
        </div>

        {/* 1 X 3 INDIVIDUAL VIDEO */}
        <div className="w-[1300px] h-[1000px] absolute bottom-0 right-0 bg-green-500 overflow-hidden">
          <div className="w-[1300px] overflow-hidden">
            <video
              ref={tripleVideoRef}
              className="w-[1300px] h-[1000px] object-cover scale-[1]"
              playsInline
              muted
              onEnded={() => {
                setCurrentState(2);
              }}
            >
              <source src={videoFileName(teamName)} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* BOT VIDEO */}
        <div className="absolute top-[400px] left-[0] z-20 w-[640px] overflow-hidden">
          <video
            className="w-[640px] h-[600px] object-cover"
            autoPlay
            loop
            playsInline
            muted
          >
            <source src="/3388N.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </main>
  );
}