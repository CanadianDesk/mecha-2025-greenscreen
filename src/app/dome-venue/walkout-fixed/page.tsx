'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { teamToContryMap } from '@/lib/constants';

export default function Home() {
  const tripleVideoRef = useRef<HTMLVideoElement>(null);
  const [teamColor, setTeamColor] = useState('RED-1'); // RED-1, RED-2, BLUE-1, BLUE-2
  const [team, setTeam] = useState('210Y'); // eg. 210Y, 210B, 210G, 210R
  const [teamName, setTeamName] = useState('it worked yesterday'); // eg. 'it worked yesterday', 



  const videoFileName = (teamColor: string) => {
    return `/${teamColor.toLowerCase()}.mp4`;
  };

  const division = 'dome';

  useEffect(() => {
    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      const currentVideo = tripleVideoRef.current;
      if (!currentVideo) return;
      const command = event.data as string;

      if (!command.startsWith(division)) return;

      switch (command) {
        case `${division}-red-1`:
        case `${division}-red-2`:
        case `${division}-blue-1`:
        case `${division}-blue-2`: {
          const newTeam = command.replace(`${division}-`, '').toUpperCase();
          if (teamColor !== newTeam) {
            setTeamColor(newTeam);
          }
          break;
        }
      }
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
  }, [teamColor]);

  return (
    <main className='flex flex-row'>
      {/* LEFT LEFT LEFT */}
      <div className="relative w-full max-w-[1920px] h-[1080px] bg-green-400 overflow-hidden mb-12">
        {/* DEBUG  */}
        <div className="absolute top-4 left-4 z-10 overflow-hidden text-yellow-300 bg-black p-2 rounded-xl font-sans">
          <h1 className="font-bold uppercase">debug info:</h1>
          <p className="font-bold">page: WALKOUT</p>
          <p className="font-bold">division: DOME (VENUE)</p>
          <p className="font-bold">team color: {teamColor}</p>
          <p className="font-bold">team name: {team}</p>
        </div>

        {/* 1 X 3 INDIVIDUAL VIDEO - SHOW LAST FRAME */}
        <div className="w-[1300px] h-[1000px] absolute bottom-0 left-0 bg-green-500 overflow-hidden opacity-100">
          <div className="w-[1300px] overflow-hidden">
            <video
              ref={tripleVideoRef}
              className="w-[1300px] h-[1000px] object-cover scale-[1]"
              playsInline
              muted
            >
              <source src={videoFileName(teamColor)} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* BOT VIDEO */}
        <div className="absolute top-[150px] right-[0] z-20 w-[640px] overflow-hidden opacity-100">
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

        {/* BANNER */}
        <div className={`absolute right-0 bottom-[160px] z-50 h-[200px] w-[620px] rounded-none ${teamColor.startsWith('RED') ? 'bg-[#e81d2d]' : 'bg-[#0476be]'}`}>
          <div className='ml-24 flex flex-row'>
            <div className='text-white font-saira text-[96px] uppercase'>
              {team}
            </div>
            <div className='my-auto ml-8'>
              <img
                className='w-[100px] z-50 border-2 border-white rounded-md'
                src={`/flag/${teamToContryMap.get(team) || 'ca'}.svg`}
                alt="Canada"
              />
            </div>
          </div>
          <div className='text-white text-[42px] overflow-hidden -mt-4 tracking-wider ml-24 uppercase'>
            {teamName}
          </div>
        </div>
      </div>

      {/* RIGHT RIGHT RIGHT */}
      <div className="relative w-full max-w-[1920px] h-[1080px] bg-green-400 overflow-hidden mb-12">
        {/* 1 X 3 INDIVIDUAL VIDEO - SHOW LAST FRAME */}
        <div className="w-[1300px] h-[1000px] absolute bottom-0 right-0 bg-green-500 overflow-hidden opacity-100">
          <div className="w-[1300px] overflow-hidden">
            <video
              ref={tripleVideoRef}
              className="w-[1300px] h-[1000px] object-cover scale-[1]"
              playsInline
              muted
            >
              <source src={videoFileName(teamColor)} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* BOT VIDEO */}
        <div className="absolute top-[150px] left-[0] z-20 w-[640px] overflow-hidden opacity-100">
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

        {/* BANNER */}
        <div className={`absolute left-0 bottom-[160px] z-50 h-[200px] w-[620px] rounded-none ${teamColor.startsWith('RED') ? 'bg-[#e81d2d]' : 'bg-[#0476be]'}`}>
          <div className='ml-24 flex flex-row'>
            <div className='text-white font-saira text-[96px] uppercase'>
              {team}
            </div>
            <div className='my-auto ml-8'>
              <img
                className='w-[100px] z-50 border-2 border-white rounded-md'
                src={`/flag/${teamToContryMap.get(team) || 'ca'}.svg`}
                alt="Canada"
              />
            </div>
          </div>
          <div className='text-white text-[42px] overflow-hidden -mt-4 tracking-wider ml-24 uppercase'>
            {teamName}
          </div>
        </div>
      </div>
    </main>
  );
}