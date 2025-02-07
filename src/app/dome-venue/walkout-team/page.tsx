'use client';

import { useEffect, useRef, useState } from 'react';
import { teamToContryMap } from '@/lib/constants';

export default function Home() {
  const tripleVideoRef = useRef<HTMLVideoElement>(null);
  const [currentState, setCurrentState] = useState(0);
  const [teamColor, setTeamColor] = useState('RED-1');
  const [team, setTeam] = useState('210Y');
  const [teamName, setTeamName] = useState('it worked yesterday');

  const states = ['IDLE READY', 'PLAYING', 'IDLE ENDED'];

  const videoFileName = (teamName: string) => {
    return `/${teamName.toLowerCase()}.mp4`;
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
  }, [teamColor, currentState]);

  useEffect(() => {
    const video = tripleVideoRef.current;
    if (video) {
      video.load();
      setCurrentState(0);
    }
  }, [teamColor]);

  return (
    <main>
      <div className="relative w-full max-w-[1920px] h-[1080px] bg-green-500 overflow-hidden mb-12">
        {/* DEBUG  */}
        <div className='absolute top-4 left-4 z-10 overflow-hidden text-yellow-300 bg-black p-2 rounded-xl font-sans'>
          <h1 className='font-bold uppercase'>debug info:</h1>
          <p className='font-bold'>page: WALKOUT</p>
          <p className='font-bold'>division: {division.toUpperCase()}</p>
          <p className='font-bold'>team: {teamColor}</p>
          <p className='font-bold'>mode: {states[currentState]}</p>
        </div>

        {/* 1 X 3 INDIVIDUAL VIDEO */}
        <div className={`bottom-0 right-0 bg-green-500 overflow-hidden ${currentState === 0 ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-[1920px] overflow-hidden">
            <video
              ref={tripleVideoRef}
              className="w-[1920px] h-[1080px] object-cover scale-[1]"
              playsInline
              muted
              onEnded={() => {
                setCurrentState(2);
              }}
            >
              <source src={videoFileName(teamColor)} type="video/mp4" />
            </video>
          </div>
        </div>


        {/* BANNER */}
        {/* <div className={`absolute left-0 bottom-[160px] z-50 h-[200px] w-[620px] rounded-none ${teamColor.startsWith('RED') ? 'bg-[#e81d2d]' : 'bg-[#0476be]'}`}>
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
        </div> */}
      </div>
    </main>
  );
}