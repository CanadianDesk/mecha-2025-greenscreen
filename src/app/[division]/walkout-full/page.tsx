'use client';

import { useParams } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { countryMap, teamToContryMap } from '@/lib/constants';
import { useMatchSubscription } from '@/hooks/useMatchSubscription';

export default function Home() {
  const tripleVideoRef = useRef<HTMLVideoElement>(null);
  const [currentState, setCurrentState] = useState(0);
  const [teamColor, setTeamColor] = useState('RED-1');
  const [visibleTeam, setVisibleTeam] = useState('ERR');
  const [visibleCountry, setVisibleCountry] = useState('ERR');
  const [currentTeamNumbers, setCurrentTeamNumbers] = useState(['ERR', 'ERR', 'ERR', 'ERR']);
  const [currentTeamCountries, setCurrentTeamCountries] = useState(['ca', 'us', 'us', 'ca']);
  const [currentTeamNames, setCurrentTeamNames] = useState(['ERR', 'ERR', 'ERR', 'ERR']);
  const [visibleTeamName, setVisibleTeamName] = useState('ERR');

  const states = ['IDLE READY', 'PLAYING', 'IDLE ENDED'];

  const videoFileName = (teamNumber: string) => {
    return `/team/${teamNumber.toUpperCase()}.MP4`;
  };

  const robotFileName = (teamNumber: string) => {
    return `/robot/${teamNumber.toUpperCase()}.MP4`;
  };

  const division = useParams().division as "rockies" | "prairies" | "foothills" | "badlands" | "dome";

  const { data: matchQueuedData, loading, error } = useMatchSubscription(division);



  useEffect(() => {
    if (matchQueuedData?.matchQueued) {
      console.log('data: ', matchQueuedData);


      let newTeamNumbers = [];
      if (division !== 'badlands') { // VEX-MS and VEX-HS
        newTeamNumbers = [
          matchQueuedData.matchQueued.blue.teams[0].number,
          matchQueuedData.matchQueued.blue.teams[1].number,
          matchQueuedData.matchQueued.red.teams[0].number,
          matchQueuedData.matchQueued.red.teams[1].number
        ];


        console.log('Setting new team numbers:', newTeamNumbers); // Add this
        setCurrentTeamNumbers(newTeamNumbers);
      } else {

        newTeamNumbers = [
          matchQueuedData.matchQueued.blue.teams[0].number,
          matchQueuedData.matchQueued.blue.teams[0].number,
          matchQueuedData.matchQueued.red.teams[0].number,
          matchQueuedData.matchQueued.red.teams[0].number
        ];

        console.log('Setting new team numbers:', newTeamNumbers); // Add this
        setCurrentTeamNumbers(newTeamNumbers);
      }
      // Preload robot videos
      newTeamNumbers.forEach(number => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'video';
        link.href = robotFileName(number);
        document.head.appendChild(link);
      });

      // Preload team videos
      newTeamNumbers.forEach(number => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'video';
        link.href = videoFileName(number);
        document.head.appendChild(link);
      });

      if (division !== 'badlands') { // VEX-MS and VEX-HS
        //@ts-ignore
        setCurrentTeamCountries([countryMap.get(matchQueuedData.matchQueued.blue.teams[0].country), countryMap.get(matchQueuedData.matchQueued.blue.teams[1].country), countryMap.get(matchQueuedData.matchQueued.red.teams[0].country), countryMap.get(matchQueuedData.matchQueued.red.teams[1].country)]);
      } else { // VEX-U
        //@ts-ignore
        setCurrentTeamCountries([countryMap.get(matchQueuedData.matchQueued.blue.teams[0].country), countryMap.get(matchQueuedData.matchQueued.blue.teams[0].country), countryMap.get(matchQueuedData.matchQueued.red.teams[0].country), countryMap.get(matchQueuedData.matchQueued.red.teams[0].country)]);
      }

      if (division !== 'badlands') { // VEX-MS and VEX-HS
        setCurrentTeamNames([
          matchQueuedData.matchQueued.blue.teams[0].name,
          matchQueuedData.matchQueued.blue.teams[1].name,
          matchQueuedData.matchQueued.red.teams[0].name,
          matchQueuedData.matchQueued.red.teams[1].name
        ]);
      } else {
        setCurrentTeamNames([ // VEX-U
          matchQueuedData.matchQueued.blue.teams[0].name,
          matchQueuedData.matchQueued.blue.teams[0].name,
          matchQueuedData.matchQueued.red.teams[0].name,
          matchQueuedData.matchQueued.red.teams[0].name
        ]);
      }
    }
  }, [matchQueuedData]);

  useEffect(() => {
    console.log('currentTeamNumbers updated:', currentTeamNumbers);
  }, [currentTeamNumbers]);
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

            console.log('newTeam: ', newTeam);
            console.log('current team numbers:', currentTeamNumbers);

            if (newTeam === 'RED-1') {
              setVisibleTeam(currentTeamNumbers[2]);
              setVisibleCountry(currentTeamCountries[2]);
              setVisibleTeamName(currentTeamNames[2]);
            } else if (newTeam === 'RED-2') {
              console.log('currentTeamNumbers[3]: ', currentTeamNumbers[3]);
              setVisibleTeam(currentTeamNumbers[3]);
              setVisibleCountry(currentTeamCountries[3]);
              setVisibleTeamName(currentTeamNames[3]);
            } else if (newTeam === 'BLUE-1') {
              setVisibleTeam(currentTeamNumbers[0]);
              setVisibleCountry(currentTeamCountries[0]);
              setVisibleTeamName(currentTeamNames[0]);
            } else if (newTeam === 'BLUE-2') {
              setVisibleTeam(currentTeamNumbers[1]);
              setVisibleCountry(currentTeamCountries[1]);
              setVisibleTeamName(currentTeamNames[1]);
            }

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
  }, [teamColor, currentState, currentTeamNumbers, currentTeamCountries, currentTeamNames, division]);

  useEffect(() => {
    const video = tripleVideoRef.current;
    if (video) {
      video.load();
      setCurrentState(0);
    }
  }, [teamColor]);

  if (loading) return <div className='min-h-screen flex-1 bg-green-500'>Loading (match status)...</div>;
  if (error) return <div className='min-h-screen flex-1 bg-green-500'>Error (match status): {error.message}</div>;


  const RobotVideo = ({ teamNumber, className }: { teamNumber: string, className: string }) => {
    const [videoError, setVideoError] = useState(false);

    if (videoError) {
      return (
        <div className={className}>
          <img
            src="/webp/moo-deng.webp"
            alt="Fallback Robot Image"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <video
        key={teamNumber}
        className={className}
        autoPlay
        loop
        playsInline
        muted
        onError={() => setVideoError(true)}
      >
        <source src={robotFileName(teamNumber)} type="video/mp4" />
      </video>
    );
  };

  return (
    <main>
      <div className="relative w-full max-w-[1920px] h-[1080px] bg-green-400 overflow-hidden mb-12">
        {/* DEBUG  */}
        {/* <div className='absolute top-4 left-4 z-10 overflow-hidden text-yellow-300 bg-black p-2 rounded-xl font-sans'>
          <h1 className='font-bold uppercase'>debug info:</h1>
          <p className='font-bold'>page: WALKOUT</p>
          <p className='font-bold'>division: {division.toUpperCase()}</p>
          <p className='font-bold'>team color: {teamColor}</p>
          <p className='font-bold'>visible team: {visibleTeam}</p>
          <p className='font-bold'>visible team name: {visibleTeamName}</p>
          <p className='font-bold'>mode: {states[currentState]}</p>
          <p className='font-bold'>currentTeamNumbers: {currentTeamNumbers.join(', ')}</p>
          <p className='font-bold'>currentTeamCountries: {currentTeamCountries.join(', ')}</p>
          <p className='font-bold'>currentTeamNames: {currentTeamNames.join(', ')}</p>
        </div> */}

        {/* 1 X 3 INDIVIDUAL VIDEO */}
        <div className={`w-[1300px] h-[1000px] absolute bottom-0 right-0 bg-green-500 overflow-hidden ${currentState === 0 ? 'opacity-0' : 'opacity-100'}`}>
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
              <source src={videoFileName(visibleTeam)} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* BOT VIDEO */}
        <div className={`absolute top-[150px] left-[0] z-20 w-[640px] overflow-hidden ${currentState === 0 ? 'opacity-0' : 'opacity-100'}`}>
          <RobotVideo
            teamNumber={visibleTeam}
            className="w-[640px] h-[600px] object-cover"
          />
        </div>
        
        {/* BANNER */}
        <AnimatePresence>
          {currentState === 2 && (
            <motion.div
              initial={{ x: -620 }}
              animate={{ x: 0 }}
              exit={{ x: -620, transition: { duration: 0 } }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              className={`
                absolute left-0 bottom-[160px] z-50 h-[200px] w-[620px] rounded-none
                ${teamColor.startsWith('RED') ? 'bg-[#e81d2d]' : 'bg-[#0476be]'}
              `}
            >
              <div className='ml-24 flex flex-row'>
                <div className='text-white font-saira text-[96px] uppercase'>
                  {visibleTeam}
                </div>
                <div className='my-auto ml-8'>
                  <img
                    className='w-[100px] z-50 border-2 border-white rounded-md'
                    src={`/flag/${countryMap.get(visibleCountry) || 'ca'}.svg`}
                    alt="Canada"
                  />
                </div>
              </div>
              <div className='text-white text-[42px] overflow-hidden -mt-4 tracking-wider ml-24 uppercase'>
                {visibleTeamName}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}