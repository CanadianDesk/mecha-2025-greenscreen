'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

export default function Home() {
  const tripleVideoRef = useRef<HTMLVideoElement>(null);
  const [team, setTeam] = useState('210Y');
  const [teamName, setTeamName] = useState('it worked yesterday');

  const videoFileName = (team: string) => {
    return `/team/${team.toUpperCase()}.MP4`;
  };

  const division = useParams().division as string;


  useEffect(() => {
    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      const currentVideo = tripleVideoRef.current;
      if (!currentVideo) return;
      const command = event.data as string;

      if (!command.startsWith(division)) return;

      const commandTeamName = command.replace(`${division}-`, '').toUpperCase();
      const disallowedTeamNames = ['RED-1', 'RED-2', 'BLUE-1', 'BLUE-2'];
      if (disallowedTeamNames.includes(commandTeamName)) return;

      setTeam(commandTeamName);

    };

    const video = tripleVideoRef.current;
    if (!video) return;

    // When metadata is loaded, jump to the last frame.
    const handleLoadedMetadata = () => {
      video.currentTime = Math.max(video.duration - 0.01, 0);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      eventSource.close();
    };
  }, [team]);

  return (
    <main>
      <div className="relative w-full max-w-[1920px] h-[1080px] bg-green-400 overflow-hidden mb-12">
        {/* DEBUG  */}
        {/* <div className="absolute top-4 left-4 z-10 overflow-hidden text-yellow-300 bg-black p-2 rounded-xl font-sans">
          <h1 className="font-bold uppercase">debug info:</h1>
          <p className="font-bold">page: WALKOUT</p>
          <p className="font-bold">team: {team}</p>
        </div> */}

        {/* 1 X 3 INDIVIDUAL VIDEO - SHOW LAST FRAME */}
        <div className="w-[1300px] h-[1000px] absolute bottom-0 right-0 bg-green-500 overflow-hidden opacity-100">
          <div className="w-[1300px] overflow-hidden">
            <video
              ref={tripleVideoRef}
              className="w-[1300px] h-[1000px] object-cover scale-[1]"
              playsInline
              muted
            >
              <source src={videoFileName(team)} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* BOT VIDEO */}
        <div className="absolute top-[150px] left-[0] z-20 w-[640px] overflow-hidden opacity-100">
          <video
            className="w-[640px] h-[600px] object-cover"
            key={team}
            autoPlay
            loop
            playsInline
            muted
          >
            <source src={`/robot/${team.toUpperCase()}.MP4`} type="video/mp4" />
          </video>
        </div>

        {/* BANNER */}
        <div className={`absolute left-0 bottom-[160px] z-50 h-[200px] w-[620px] rounded-none bg-gray-700`}>
          <div className='text-white font-saira text-[96px] ml-24 uppercase'>
            {team}
          </div>
          {/* <div className='text-white text-[42px] overflow-hidden -mt-4 tracking-wider ml-24 uppercase'>
            {teamName}
          </div> */}
        </div>
      </div>
    </main>
  );
}