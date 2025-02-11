'use client';

import { useParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { useScoreSubscription } from '@/hooks/useScoreSubscription';
import { useMatchStatusUpdated } from '@/hooks/useMatchStatusUpdated';
import { countryMap } from '@/lib/constants';
import { MatchStatus } from '@/hooks/useMatchSubscription';

export default function InMatch() {
  // [B1, B2, R1, R2]
  // BADLANDS -> [B1, XX, R1, XX]
  const [currentTeamNumbers, setCurrentTeamNumbers] = useState(['210Y', '210Z', '210X', '223930H']);
  const [currentTeamCountries, setCurrentTeamCountries] = useState(['ca', 'us', 'us', 'ca']);
  const [currentTeamRanks, setCurrentTeamRanks] = useState(['', '', '', '']);
  const [autonomousWinPoint, setAutonomousWinPoint] = useState([true, false]);
  const [autoBonus, setAutoBonus] = useState([false, true]);
  const [currentScore, setCurrentScore] = useState([23, 100]);
  const [currentMatchState, setCurrentMatchState] = useState<MatchStatus>(MatchStatus.UNKNOWN);
  const [currentStateEndTime, setCurrentStateEndTime] = useState(0);
  const [currentTimerValue, setCurrentTimerValue] = useState('120');
  const [currentMatchName, setCurrentMatchName] = useState('Q10');
  const [currentTime, setCurrentTime] = useState(Date.now());


  const division = useParams().division as "rockies" | "prairies" | "foothills" | "badlands" | "dome";

  const { data: scoreData, loading, error } = useScoreSubscription(division);
  // console.log('scoreData', scoreData);

  const { data: matchStatusData, loading: matchStatusLoading, error: matchStatusError } = useMatchStatusUpdated(division);
  // console.log('matchStatusData', matchStatusData);

  // on score data update
  useEffect(() => {
    if (scoreData?.scoreUpdated) {
      const dataDivision = scoreData.scoreUpdated.match.linked.name.toLowerCase();
      // PROBABLY MOVE TO MATCH STATUS UPDATE
      if (dataDivision === 'badlands') { // VEX-U
        //@ts-ignore
        setCurrentTeamCountries([countryMap.get(scoreData.scoreUpdated.match.blue.teams[0].country), countryMap.get(scoreData.scoreUpdated.match.blue.teams[0].country), countryMap.get(scoreData.scoreUpdated.match.red.teams[0].country), countryMap.get(scoreData.scoreUpdated.match.red.teams[0].country)]);
      } else { // VEX-MS and VEX-HS
        //@ts-ignore
        setCurrentTeamCountries([countryMap.get(scoreData.scoreUpdated.match.blue.teams[0].country), countryMap.get(scoreData.scoreUpdated.match.blue.teams[1].country), countryMap.get(scoreData.scoreUpdated.match.red.teams[0].country), countryMap.get(scoreData.scoreUpdated.match.red.teams[1].country)]);
      }

      // TODO: RANKS

      setAutonomousWinPoint([scoreData.scoreUpdated.blue.wp, scoreData.scoreUpdated.red.wp]);

      const bothAutonBonus = scoreData.scoreUpdated.blue.auton && scoreData.scoreUpdated.red.auton;
      setAutoBonus([!bothAutonBonus && scoreData.scoreUpdated.blue.auton, !bothAutonBonus && scoreData.scoreUpdated.red.auton]);

      setCurrentScore([scoreData.scoreUpdated.blue.score, scoreData.scoreUpdated.red.score]);
    }
  }, [scoreData]);

  useEffect(() => {
    if (matchStatusData?.matchStatusUpdated) {
      const dataDivision = matchStatusData.matchStatusUpdated.linked.name.toLowerCase();
      if (dataDivision === 'badlands') { // VEX-U
        setCurrentTeamNumbers([
          matchStatusData.matchStatusUpdated.blue.teams[0].number,
          matchStatusData.matchStatusUpdated.blue.teams[0].number,
          matchStatusData.matchStatusUpdated.red.teams[0].number,
          matchStatusData.matchStatusUpdated.red.teams[0].number
        ]);
      } else {
        setCurrentTeamNumbers([ // VEX-MS and VEX-HS
          matchStatusData.matchStatusUpdated.blue.teams[0].number,
          matchStatusData.matchStatusUpdated.blue.teams[1].number,
          matchStatusData.matchStatusUpdated.red.teams[0].number,
          matchStatusData.matchStatusUpdated.red.teams[1].number
        ]);
      }

      if (dataDivision === 'badlands') { // VEX-U
        //@ts-ignore
        setCurrentTeamCountries([countryMap.get(matchStatusData.matchStatusUpdated.blue.teams[0].country), countryMap.get(matchStatusData.matchStatusUpdated.blue.teams[0].country), countryMap.get(matchStatusData.matchStatusUpdated.red.teams[0].country), countryMap.get(matchStatusData.matchStatusUpdated.red.teams[0].country)]);
      } else { // VEX-MS and VEX-HS
        //@ts-ignore
        setCurrentTeamCountries([countryMap.get(matchStatusData.matchStatusUpdated.blue.teams[0].country), countryMap.get(matchStatusData.matchStatusUpdated.blue.teams[1].country), countryMap.get(matchStatusData.matchStatusUpdated.red.teams[0].country), countryMap.get(matchStatusData.matchStatusUpdated.red.teams[1].country)]);
      }

      setCurrentMatchState(matchStatusData.matchStatusUpdated.status);

      setCurrentStateEndTime(matchStatusData.matchStatusUpdated.endTime);


      const round = matchStatusData.matchStatusUpdated.round;
      const instance = matchStatusData.matchStatusUpdated.instance;
      const number = matchStatusData.matchStatusUpdated.number;
      const append = (round[0] === 'Q' || round[0] === 'P') ? '' : `-${instance}`;
      setCurrentMatchName(`${round} ${number}${append}`);
    }
  }, [matchStatusData]);


  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     switch (e.key) {
  //       case 'ArrowUp':
  //         e.preventDefault();
  //         setCurrentScore((prev) => [prev[0] + 5, prev[1]]);
  //         break;
  //       case 'ArrowDown':
  //         e.preventDefault();
  //         setCurrentScore((prev) => [Math.max(0, prev[0] - 1), prev[1]]);
  //         break;
  //       case 'w':
  //         e.preventDefault();
  //         setCurrentScore((prev) => [prev[0], prev[1] + 25]);
  //         break;
  //       case 's':
  //         e.preventDefault();
  //         setCurrentScore((prev) => [prev[0], Math.max(0, prev[1] - 1)]);
  //         break;
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => window.removeEventListener('keydown', handleKeyDown);
  // }, []);



  // function to format seconds to mm:ss
  const formatSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);

    return () => clearInterval(interval);
  }, []); // Empty dependency array so it only runs once on mount


  const getCurrentTimerValueInSeconds = () => {
    // current time minus end time of match / 1000 to convert to seconds

    console.log('currentStateEndTime: ', currentStateEndTime);
    console.log('Date.now(): ', Date.now());
    return (Math.round(Math.ceil(currentStateEndTime * 1000 - Date.now())) / 1000);
  };

  useEffect(() => {
    const timerValue = getCurrentTimerValueInSeconds();
    console.log('timerValue: ', timerValue);
    if (timerValue >= 0) {
      setCurrentTimerValue(formatSeconds(timerValue));
    } else {
      setCurrentTimerValue('0:00');
    }
  }, [currentTime]);

  // Split the current scores into individual digits for per-digit animation
  const redScoreDigits = currentScore[0].toString().split('');
  const blueScoreDigits = currentScore[1].toString().split('');

  if (loading) return <div className='min-h-screen flex-1 bg-green-500'>Loading (score)...</div>;
  if (matchStatusLoading) return <div className='min-h-screen flex-1 bg-green-500'>Loading (match status)...</div>;
  if (error) return <div className='min-h-screen flex-1 bg-green-500'>Error (score): {error.message}</div>;
  if (matchStatusError) return <div className='min-h-screen flex-1 bg-green-500'>Error (match status): {matchStatusError.message}</div>;

  return (
    <main>
      <div className="relative w-full max-w-[1920px] h-[1080px] bg-green-500 overflow-hidden mb-12">
        {/* DEBUG  */}
        {/* <div className="absolute top-24 left-1/2 -translate-x-1/2 border-4 border-yellow-300 z-10 overflow-hidden text-yellow-300 bg-black p-2 rounded-xl font-sans">
          <h1 className="font-bold uppercase text-center">debug info:</h1>
          <p className="font-bold">page: IN-MATCH</p>
          <p className="font-bold">division: {division.toUpperCase()}</p>
          <p className="font-bold">game: {currentMatchName}</p>
          <p className="font-bold">
            teams: {currentTeamNumbers.slice(0, 2).join(', ')} vs{' '}
            {currentTeamNumbers.slice(2, 4).join(', ')}
          </p>
          <p className="font-bold">
            countries: {currentTeamCountries.slice(0, 2).join(', ')} vs{' '}
            {currentTeamCountries.slice(2, 4).join(', ')}
          </p>
          <p className="font-bold">
            ranks: {currentTeamRanks.slice(0, 2).join(', ')} vs{' '}
            {currentTeamRanks.slice(2, 4).join(', ')}
          </p>
          <p className="font-bold">
            auto bonus: {autoBonus[0] ? 'yes' : 'no'} vs {autoBonus[1] ? 'yes' : 'no'}
          </p>
          <p className="font-bold">
            score: {currentScore[0]} vs {currentScore[1]}
          </p>
          <p className="font-bold"><br />press arrow keys or w/s to change score<br />press 'd' to hide this window</p>
        </div> */}

        {/* MATCH NAME */}
        <div className="absolute bottom-[40px] left-[400px] w-[160px] h-[55px] z-20 opacity-100">
          <p className="text-black text-[48px] uppercase text-center mx-auto my-auto">
            {currentMatchName}
          </p>
        </div>
        {/* BLUE SCORE */}
        {(currentMatchState.toString() === 'AUTON' || (currentMatchState.toString() === 'DRIVER' && getCurrentTimerValueInSeconds() > 0.1)) && (
          <div className={`absolute bottom-0 left-[1080px] z-20 opacity-100`}>
            <motion.div className="flex text-white text-[124px] uppercase text-left">
              <AnimatePresence mode="popLayout">
                {String(currentScore[0]).split('').map((digit, index) => (
                  <motion.span
                    key={`red-${index}-${digit}`}
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    layout
                  >
                    {digit}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* DIVISION ICON */}
        <img
          className='absolute bottom-[45px] left-[430px] w-[175px] z-20 opacity-100'
          src={`/png/${division}.png`}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />

        {/* RED SCORE */}
        {(currentMatchState.toString() === 'AUTON' || (currentMatchState.toString() === 'DRIVER' && getCurrentTimerValueInSeconds() > 0.1)) && (
          <div className={`absolute bottom-0 right-[870px] z-20 opacity-100`}>
            <motion.div className="flex text-white text-[124px] uppercase text-right">
              <AnimatePresence mode="popLayout">
                {String(currentScore[1]).split('').map((digit, index) => (
                  <motion.span
                    key={`blue-${index}-${digit}`}
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    layout
                  >
                    {digit}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}


        {/* RED 1 RANK */}
        <div className={`absolute right-[411px] w-[40px] h-[40px] z-20 opacity-100 flex items-center justify-center ${division === 'badlands' ? 'bottom-[78px]' : 'bottom-[103px]'}`}>
          <p className="text-black text-[36px] font-extrabold uppercase text-center">
            {currentTeamRanks[2]}
          </p>
        </div>
        {/* BLUE 1 TEAM NAME */}
        <div className={`absolute right-[460px] z-20 opacity-100 flex items-center justify-center ${division === 'badlands' ? 'bottom-[61px]' : 'bottom-[87px]'}`}>
          <p className="text-white text-[48px] font-bold uppercase text-right tracking-wider">
            {currentTeamNumbers[0]}
          </p>
        </div>
        {/* BLUE 1 FLAG */}
        <div className={`absolute right-[345px] z-20 opacity-100 ${division === 'badlands' ? 'bottom-[84px]' : 'bottom-[110px]'}`}>
          <img
            className="w-[55px] border-2 border-white"
            src={`/flag/${currentTeamCountries[0]}.svg`}
          />
        </div>

        {division !== 'badlands' && (
          <>
            {/* BLUE 2 RANK */}
            <div className="absolute bottom-[48px] right-[411px] w-[40px] h-[40px] z-20 opacity-100 flex items-center justify-center">
              <p className="text-black text-[36px] font-extrabold uppercase text-center">
                {currentTeamRanks[1]}
              </p>
            </div>
            {/* BLUE 2 TEAM NAME */}
            <div className="absolute bottom-[31px] right-[460px] z-20 opacity-100 flex items-center justify-center">
              <p className="text-white text-[48px] font-bold uppercase text-left tracking-wider">
                {currentTeamNumbers[1]}
              </p>
            </div>
            {/* BLUE 2 FLAG */}
            <div className="absolute bottom-[55px] right-[345px] z-20 opacity-100">
              <img
                className="w-[55px] border-2 border-white"
                src={`/flag/${currentTeamCountries[1]}.svg`}
              />
            </div>
          </>
        )}


        {/* RED 1 RANK */}
        <div className={`absolute left-[632px] w-[40px] h-[40px] z-20 opacity-100 flex items-center justify-center ${division === 'badlands' ? 'bottom-[78px]' : 'bottom-[103px]'}`}>
          <p className="text-black text-[36px] font-extrabold uppercase text-center">
            {currentTeamRanks[2]}
          </p>
        </div>
        {/* RED 1 TEAM NAME */}
        <div className={`absolute left-[680px] z-20 opacity-100 flex items-center justify-center ${division === 'badlands' ? 'bottom-[61px]' : 'bottom-[87px]'}`}>
          <p className="text-white text-[48px] font-bold uppercase text-left tracking-wider">
            {currentTeamNumbers[2]}
          </p>
        </div>
        {/* RED 1 FLAG */}
        <div className={`absolute bottom-[110px] left-[565px] z-20 opacity-100 ${division === 'badlands' ? 'bottom-[84px]' : 'bottom-[110px]'}`}>
          <img
            className="w-[55px] border-2 border-white"
            src={`/flag/${currentTeamCountries[2]}.svg`}
          />
        </div>

        {division !== 'badlands' && (
          <>
            {/* RED 2 RANK */}
            <div className="absolute bottom-[48px] left-[632px] w-[40px] h-[40px] z-20 opacity-100 flex items-center justify-center">
              <p className="text-black text-[36px] font-extrabold uppercase text-center">
                {currentTeamRanks[3]}
              </p>
            </div>
            {/* RED 2 TEAM NAME */}
            <div className="absolute bottom-[31px] left-[680px] z-20 opacity-100 flex items-center justify-center">
              <p className="text-white text-[48px] font-bold uppercase text-right tracking-wider">
                {currentTeamNumbers[3]}
              </p>
            </div>
            {/* RED 2 FLAG */}
            <div className="absolute bottom-[55px] left-[565px] z-20 opacity-100">
              <img
                className="w-[55px] border-2 border-white"
                src={`/flag/${currentTeamCountries[3]}.svg`}
              />
            </div>
          </>
        )}
        {/* MATCH STATE + TIMER */}
        <div className="absolute bottom-[162px] left-[947px] w-[250px] h-[52px] z-20 opacity-100 flex items-center justify-center bg-white">
          <p className="text-black text-[48px] font-bold uppercase text-center tracking-wider">
            {currentMatchState.toString() !== 'UNKNOWN' ? currentMatchState.toString() : ''}
            {(currentMatchState.toString() === 'AUTON' || currentMatchState.toString() === 'DRIVER') &&
              ` ${currentTimerValue}`
            }
          </p>
        </div>

        {/* RED AUTO BONUS */}
        {autoBonus[1] && (
          <div className="absolute bottom-[162px] left-[561px] w-[189px] h-[40px] z-20 opacity-100 flex items-center justify-center bg-[#e81d2d] rounded-none">
            <p className="text-white text-[36px] uppercase text-center pt-1">
              AUTO BONUS
            </p>
          </div>
        )}

        {/* blue AUTO BONUS */}
        {autoBonus[0] && (
          <div className="absolute bottom-[162px] right-[335px] w-[189px] h-[40px] z-20 opacity-100 flex items-center justify-center bg-[#0476be]  rounded-none">
            <p className="text-white text-[36px] uppercase text-center pt-1">
              AUTO BONUS
            </p>
          </div>
        )}

        {autonomousWinPoint[1] && (
          <svg
            className='absolute w-[45px] left-[836px] bottom-[106px] z-20 opacity-100'
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
          </svg>
        )}

        {autonomousWinPoint[0] && (
          <svg
            className='absolute w-[45px] left-[1265px] bottom-[106px] z-20 opacity-100'
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
          </svg>
        )}

        {/* BG BOXES */}
        {/* <div className='absolute bottom-[39px] left-[561px] w-[512px] h-[123px] z-0 opacity-100 bg-[#0476be] rounded-none'></div>
        <div className='absolute bottom-[39px] right-[335px] w-[512px] h-[123px] z-0 opacity-100 bg-[#e81d2d] rounded-none'></div> */}

      </div>
    </main>
  );
}