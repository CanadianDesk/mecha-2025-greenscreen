'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"
/>

export default function PreMatch() {
  const [currentTeamNames, setCurrentTeamNames] = useState(['ERR', 'ERR', 'ERR', 'ERR']);
  const [currentTeamCountries, setCurrentTeamCountries] = useState(['ca', 'us', 'us', 'ca']);
  const [currentMatchName, setCurrentMatchName] = useState('Q10');

  const division = useParams().division as string;

  return (
    <main>
      <div className="relative w-full max-w-[1920px] h-[1080px] bg-green-400 overflow-hidden mb-12">
        {/* DEBUG  */}
        <div className='absolute top-24 left-1/2 -translate-x-1/2 border-4 border-yellow-300 z-10 overflow-hidden text-yellow-300 bg-black p-2 rounded-xl font-sans'>
          <h1 className='font-bold uppercase text-center'>debug info:</h1>
          <p className='font-bold'>page: PRE-MATCH</p>
          <p className='font-bold'>division: {division.toUpperCase()}</p>
          <p className='font-bold'>game: {currentMatchName}</p>
          <p className='font-bold'>teams: {currentTeamNames.slice(0, 2).join(', ')} vs {currentTeamNames.slice(2, 4).join(', ')}</p>
          <p className='font-bold'>countries: {currentTeamCountries.slice(0, 2).join(', ')} vs {currentTeamCountries.slice(2, 4).join(', ')}</p>
        </div>

        <h1 className='text-black font-bold text-center text-[76px] -mt-2 upper'>{currentMatchName}</h1>

        {/* BLUE 1 TEAM TEXT */}
        <div className={`absolute top-[420px] left-[450px] z-30 opacity-100`}>
          <p className='text-white text-[84px] uppercase'>{currentTeamNames[0]}</p>
        </div>
        {/* BLUE 1 FLAG */}
        <div className={'absolute z-30 top-[125px] left-[20px] border-2 border-white rounded-md'}>
          <img
            className='w-[100px]'
            src={`/flag/${currentTeamCountries[0]}.svg`}
            alt="Canada"
          />
        </div>
        {/* BLUE 1 VIDEO */}
        <div className={`absolute top-[133px] left-[27px] z-20 w-[430px] h-[390px] overflow-hidden opacity-100`}>
          <video
            className="h-full object-cover"
            autoPlay
            loop
            playsInline
            muted
          >
            <source src="/3388N.mp4" type="video/mp4" />
          </video>
        </div>

        {/* BLUE 2 TEAM TEXT */}
        <div className={`absolute top-[930px] left-[450px] z-30 opacity-100`}>
          <p className='text-white text-[84px] uppercase'>{currentTeamNames[1]}</p>
        </div>
        {/* BLUE 2 FLAG */}
        <div className={'absolute z-30 bottom-[425px] left-[20px] border-2 border-white rounded-md'}>
          <img
            className='w-[100px]'
            src={`/flag/${currentTeamCountries[1]}.svg`}
            alt="Canada"
          />
        </div>        
        {/* BLUE 2 VIDEO */}
        <div className={`absolute bottom-[74px] left-[27px] z-20 w-[430px] h-[390px] overflow-hidden opacity-100`}>
          <video
            className="h-full object-cover"
            autoPlay
            loop
            playsInline
            muted
          >
            <source src="/3388N.mp4" type="video/mp4" />
          </video>
        </div>

        {/* RED 1 TEAM TEXT */}
        <div className={`absolute top-[420px] right-[425px] z-30 opacity-100`}>
          <p className='text-white text-[84px] uppercase'>{currentTeamNames[2]}</p>
        </div>
        {/* RED 1 FLAG */}
        <div className={'absolute z-30 top-[125px] right-[20px] border-2 border-white rounded-md'}>
          <img
            className='w-[100px]'
            src={`/flag/${currentTeamCountries[2]}.svg`}
            alt="Canada"
          />
        </div>
        {/* RED 1 VIDEO */}
        <div className={`absolute bottom-[74px] right-[24px] z-20 w-[430px] h-[390px] overflow-hidden opacity-100`}>
          <video
            className="h-full object-cover"
            autoPlay
            loop
            playsInline
            muted
          >
            <source src="/3388N.mp4" type="video/mp4" />
          </video>
        </div>

        {/* RED 2 TEAM TEXT */}
        <div className={`absolute top-[930px] right-[425px] z-30 opacity-100`}>
          <p className='text-white text-[84px] uppercase'>{currentTeamNames[3]}</p>
        </div>
        {/* RED 2 FLAG */}
        <div className={'absolute z-30 bottom-[425px] right-[20px] border-2 border-white rounded-md'}>
          <img
            className='w-[100px]'
            src={`/flag/${currentTeamCountries[3]}.svg`}
            alt="Canada"
          />
        </div>
        {/* RED 2 VIDEO */}
        <div className={`absolute top-[133px] right-[24px] z-20 w-[430px] h-[390px] overflow-hidden opacity-100`}>
          <video
            className="h-full object-cover"
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