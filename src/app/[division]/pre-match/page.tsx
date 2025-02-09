'use client';

import { useMatchSubscription, MatchQueuedData, MatchStatus } from '@/hooks/useMatchSubscription';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { countryMap } from '@/lib/constants';

export default function PreMatch() {
  const [currentTeamNumbers, setCurrentTeamNumbers] = useState(['ERR', 'ERR', 'ERR', 'ERR']);
  const [currentTeamCountries, setCurrentTeamCountries] = useState(['ca', 'us', 'us', 'ca']);
  const [currentMatchName, setCurrentMatchName] = useState('ERR');
  const [preloadedVideos, setPreloadedVideos] = useState<{ [key: string]: string }>({});
  const [currentDivision, setCurrentDivision] = useState('rockies');

  const division = useParams().division as "rockies" | "prairies" | "foothills" | "badlands" | "dome";

  const { data, loading, error } = useMatchSubscription(division);

  // Preload videos when team numbers change
  useEffect(() => {
    const preloadVideo = async (teamNumber: string) => {
      try {
        const videoUrl = `/robot/${teamNumber.toUpperCase()}.MP4`;
        console.log(`🔄 Started loading video: ${videoUrl}`);

        // Create a blob URL for the video
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        console.log(`✅ Finished loading video: ${videoUrl}`);

        setPreloadedVideos(prev => ({ ...prev, [teamNumber]: blobUrl }));
      } catch (error) {
        console.error(`❌ Error loading video for team ${teamNumber}:`, error);
      }
    };

    // Only preload if team numbers are valid
    currentTeamNumbers.forEach(teamNumber => {
      if (teamNumber !== 'ERR' && !preloadedVideos[teamNumber]) {
        preloadVideo(teamNumber);
      }
    });

    // Cleanup function to revoke blob URLs
    return () => {
      Object.values(preloadedVideos).forEach(url => URL.revokeObjectURL(url));
    };
  }, [currentTeamNumbers]);

  useEffect(() => {
    if (data?.matchQueued) {

      const dataDivision = data.matchQueued.linked.name.toLowerCase();
      console.log('data division: ', dataDivision);
      setCurrentDivision(dataDivision);

      if (dataDivision !== 'badlands') { // VEX-MS and VEX-HS
        setCurrentTeamNumbers([
          data.matchQueued.blue.teams[0].number,
          data.matchQueued.blue.teams[1].number,
          data.matchQueued.red.teams[0].number,
          data.matchQueued.red.teams[1].number
        ]);
      } else {
        setCurrentTeamNumbers([ // VEX-U
          data.matchQueued.blue.teams[0].number,
          data.matchQueued.blue.teams[0].number,
          data.matchQueued.red.teams[0].number,
          data.matchQueued.red.teams[0].number
        ]);
      }

      if (dataDivision !== 'badlands') { // VEX-MS and VEX-HS
        //@ts-ignore
        setCurrentTeamCountries([countryMap.get(data.matchQueued.blue.teams[0].country), countryMap.get(data.matchQueued.blue.teams[1].country), countryMap.get(data.matchQueued.red.teams[0].country), countryMap.get(data.matchQueued.red.teams[1].country)]);
      } else { // VEX-U
        //@ts-ignore
        setCurrentTeamCountries([countryMap.get(data.matchQueued.blue.teams[0].country), countryMap.get(data.matchQueued.blue.teams[0].country), countryMap.get(data.matchQueued.red.teams[0].country), countryMap.get(data.matchQueued.red.teams[0].country)]);
      }

      const round = data.matchQueued.round;
      const instance = data.matchQueued.instance;
      const number = data.matchQueued.number;
      const append = (round[0] === 'Q' || round[0] === 'P') ? '' : `-${instance}`;
      setCurrentMatchName(`${round[0]}${number}${append}`);
    }
  }, [data]);

  const VideoComponent = ({ teamNumber, className }: { teamNumber: string, className: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoError, setVideoError] = useState(false);

    if (currentDivision === 'badlands') {
      if (teamNumber.includes('%')) {
        teamNumber = teamNumber.replace('%', '-B');
      } else {
        teamNumber = teamNumber.concat('-A');
      }
    }

    useEffect(() => {
      const video = videoRef.current;
      if (video) {
        video.addEventListener('canplay', () => {
          console.log(`🎥 Video ready to play: ${teamNumber}`);
        });
        video.addEventListener('error', () => {
          console.log(`❌ Video failed to load: ${teamNumber}`);
          setVideoError(true);
        });
      }
    }, [teamNumber]);

    if (videoError) {
      return (
        <div className={className}>
          <img
            src="/webp/moo-deng.webp"
            alt="Fallback Robot Image"
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className={className}>
        <video
          ref={videoRef}
          key={teamNumber}
          className="h-full object-cover"
          autoPlay
          loop
          playsInline
          muted
          onError={() => setVideoError(true)}
        >
          {preloadedVideos[teamNumber] ? (
            <source src={preloadedVideos[teamNumber]} type="video/mp4" />
          ) : (
            <source src={`/robot/${teamNumber.toUpperCase()}.MP4`} type="video/mp4" />
          )}
        </video>
      </div>
    );
  };

  if (loading) return <div className='min-h-screen flex-1 bg-green-500'>Loading...</div>;
  if (error) return <div className='min-h-screen flex-1 bg-green-500'>Error: {error.message}</div>;

  return (
    <main>
      <div className="relative w-full max-w-[1920px] h-[1080px] bg-green-400 overflow-hidden mb-12">
        {/* DEBUG  */}
        {/* <div className='absolute top-24 left-1/2 -translate-x-1/2 border-4 border-yellow-300 z-10 overflow-hidden text-yellow-300 bg-black p-2 rounded-xl font-sans'>
          <h1 className='font-bold uppercase text-center'>debug info:</h1>
          <p className='font-bold'>page: PRE-MATCH</p>
          <p className='font-bold'>division: {division.toUpperCase()}</p>
          <p className='font-bold'>game: {currentMatchName}</p>
          <p className='font-bold'>teams: {currentTeamNumbers.slice(0, 2).join(', ')} vs {currentTeamNumbers.slice(2, 4).join(', ')}</p>
          <p className='font-bold'>countries: {currentTeamCountries.slice(0, 2).join(', ')} vs {currentTeamCountries.slice(2, 4).join(', ')}</p>
        </div> */}

        <h1 className='text-black font-bold text-center text-[76px] -mt-2 upper'>{currentMatchName}</h1>

        {/* RED 1 */}
        <div className={`absolute top-[420px] left-[450px] z-30 opacity-100`}>
          <p className='text-white text-[84px] uppercase'>{currentTeamNumbers[2]}</p>
        </div>
        {currentTeamCountries[2] && (
          <div className={'absolute z-30 top-[125px] left-[20px] border-2 border-white rounded-md'}>
            <img
              className='w-[100px]'
              src={`/flag/${currentTeamCountries[0]}.svg`}
              alt="Team Flag"
            />
          </div>
        )}
        <VideoComponent
          teamNumber={currentTeamNumbers[2]}
          className="absolute top-[133px] left-[27px] z-20 w-[430px] h-[390px] overflow-hidden opacity-100"
        />

        {/* RED 2 */}
        <div className={`absolute top-[930px] left-[450px] z-30 opacity-100`}>
          <p className='text-white text-[84px] uppercase'>{currentTeamNumbers[3]}</p>
        </div>
        {currentTeamCountries[3] && (
          <div className={'absolute z-30 bottom-[425px] left-[20px] border-2 border-white rounded-md'}>
            <img
              className='w-[100px]'
              src={`/flag/${currentTeamCountries[1]}.svg`}
              alt="Team Flag"
            />
          </div>
        )}
        <VideoComponent
          teamNumber={`${currentDivision !== 'badlands' ? currentTeamNumbers[3] : `${currentTeamNumbers[2]}%`}`}
          className="absolute bottom-[74px] left-[27px] z-20 w-[430px] h-[390px] overflow-hidden opacity-100"
        />

        {/* BLUE 1 */}
        <div className={`absolute top-[420px] right-[425px] z-30 opacity-100`}>
          <p className='text-white text-[84px] uppercase'>{currentTeamNumbers[0]}</p>
        </div>
        {currentTeamCountries[0] && (
          <div className={'absolute z-30 top-[125px] right-[20px] border-2 border-white rounded-md'}>
            <img
              className='w-[100px]'
              src={`/flag/${currentTeamCountries[2]}.svg`}
              alt="Team Flag"
            />
          </div>
        )}
        <VideoComponent
          teamNumber={currentTeamNumbers[0]}
          className="absolute top-[133px]  right-[24px] z-20 w-[430px] h-[390px] overflow-hidden opacity-100"
        />

        {/* BLUE 2 */}
        <div className={`absolute top-[930px] right-[425px] z-30 opacity-100`}>
          <p className='text-white text-[84px] uppercase'>{currentTeamNumbers[1]}</p>
        </div>
        {currentTeamCountries[1] && (
          <div className={'absolute z-30 bottom-[425px] right-[20px] border-2 border-white rounded-md'}>
            <img
              className='w-[100px]'
              src={`/flag/${currentTeamCountries[1]}.svg`}
              alt="Team Flag"
            />
          </div>
        )}
        <VideoComponent
          teamNumber={`${currentDivision !== 'badlands' ? currentTeamNumbers[1] : `${currentTeamNumbers[0]}%`}`}
          className="absolute bottom-[74px] right-[24px] z-20 w-[430px] h-[390px] overflow-hidden opacity-100"
        />
      </div>
    </main>
  );
}