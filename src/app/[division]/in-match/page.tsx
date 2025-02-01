'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

export default function InMatch() {
  const [currentTeamNames, setCurrentTeamNames] = useState(['210Y', '210Z', '210X', '210W']);
  const [currentTeamCountries, setCurrentTeamCountries] = useState(['ca', 'us', 'us', 'ca']);
  const [currentTeamRanks, setCurrentTeamRanks] = useState([2, 89, 20, 1]);
  const [autoBonus, setAutoBonus] = useState([false, true]);
  const [currentScore, setCurrentScore] = useState([100, 23]);
  const [currentMatchState, setCurrentMatchState] = useState('DRIVER');
  const [currentTimerValue, setCurrentTimerValue] = useState(120);
  const [currentMatchName, setCurrentMatchName] = useState('Q10');

  const division = useParams().division as string;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setCurrentScore((prev) => [prev[0] + 5, prev[1]]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setCurrentScore((prev) => [Math.max(0, prev[0] - 1), prev[1]]);
          break;
        case 'w':
          e.preventDefault();
          setCurrentScore((prev) => [prev[0], prev[1] + 25]);
          break;
        case 's':
          e.preventDefault();
          setCurrentScore((prev) => [prev[0], Math.max(0, prev[1] - 1)]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // function to format seconds to mm:ss
  const formatSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Split the current scores into individual digits for per-digit animation
  const redScoreDigits = currentScore[0].toString().split('');
  const blueScoreDigits = currentScore[1].toString().split('');

  return (
    <main>
      <div className="relative w-full max-w-[1920px] h-[1080px] bg-green-400 overflow-hidden mb-12">
        {/* DEBUG  */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 border-4 border-yellow-300 z-10 overflow-hidden text-yellow-300 bg-black p-2 rounded-xl font-sans">
          <h1 className="font-bold uppercase text-center">debug info:</h1>
          <p className="font-bold">page: IN-MATCH</p>
          <p className="font-bold">division: {division.toUpperCase()}</p>
          <p className="font-bold">game: {currentMatchName}</p>
          <p className="font-bold">
            teams: {currentTeamNames.slice(0, 2).join(', ')} vs{' '}
            {currentTeamNames.slice(2, 4).join(', ')}
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
        </div>

        {/* MATCH NAME */}
        <div className="absolute bottom-[40px] left-[400px] w-[160px] h-[55px] z-20 opacity-100">
          <p className="text-black text-[48px] uppercase text-center mx-auto my-auto">
            {currentMatchName}
          </p>
        </div>

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

        {/* BLUE SCORE - Modified for per-digit animation */}
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


        {/* RED 1 RANK */}
        <div className="absolute bottom-[103px] right-[411px] w-[40px] h-[40px] z-20 opacity-100 flex items-center justify-center">
          <p className="text-black text-[36px] font-extrabold uppercase text-center">
            {currentTeamRanks[0]}
          </p>
        </div>
        {/* RED 1 TEAM NAME */}
        <div className="absolute bottom-[87px] right-[460px] z-20 opacity-100 flex items-center justify-center">
          <p className="text-white text-[48px] font-bold uppercase text-right tracking-wider">
            {currentTeamNames[0]}
          </p>
        </div>
        {/* RED 1 FLAG */}
        <div className="absolute bottom-[110px] right-[345px] z-20 opacity-100">
          <img
            className="w-[55px] border-2 border-white"
            src={`/flag/${currentTeamCountries[0]}.svg`}
          />
        </div>

        {/* RED 2 RANK */}
        <div className="absolute bottom-[48px] right-[411px] w-[40px] h-[40px] z-20 opacity-100 flex items-center justify-center">
          <p className="text-black text-[36px] font-extrabold uppercase text-center">
            {currentTeamRanks[1]}
          </p>
        </div>
        {/* RED 2 TEAM NAME */}
        <div className="absolute bottom-[31px] right-[460px] z-20 opacity-100 flex items-center justify-center">
          <p className="text-white text-[48px] font-bold uppercase text-left tracking-wider">
            {currentTeamNames[1]}
          </p>
        </div>
        {/* RED 2 FLAG */}
        <div className="absolute bottom-[55px] right-[345px] z-20 opacity-100">
          <img
            className="w-[55px] border-2 border-white"
            src={`/flag/${currentTeamCountries[1]}.svg`}
          />
        </div>

        {/* BLUE 1 RANK */}
        <div className="absolute bottom-[103px] left-[632px] w-[40px] h-[40px] z-20 opacity-100 flex items-center justify-center">
          <p className="text-black text-[36px] font-extrabold uppercase text-center">
            {currentTeamRanks[2]}
          </p>
        </div>
        {/* BLUE 1 TEAM NAME */}
        <div className="absolute bottom-[87px] left-[680px] z-20 opacity-100 flex items-center justify-center">
          <p className="text-white text-[48px] font-bold uppercase text-left tracking-wider">
            {currentTeamNames[2]}
          </p>
        </div>
        {/* BLUE 1 FLAG */}
        <div className="absolute bottom-[110px] left-[565px] z-20 opacity-100">
          <img
            className="w-[55px] border-2 border-white"
            src={`/flag/${currentTeamCountries[2]}.svg`}
          />
        </div>

        {/* BLUE 2 RANK */}
        <div className="absolute bottom-[48px] left-[632px] w-[40px] h-[40px] z-20 opacity-100 flex items-center justify-center">
          <p className="text-black text-[36px] font-extrabold uppercase text-center">
            {currentTeamRanks[3]}
          </p>
        </div>
        {/* BLUE 2 TEAM NAME */}
        <div className="absolute bottom-[31px] left-[680px] z-20 opacity-100 flex items-center justify-center">
          <p className="text-white text-[48px] font-bold uppercase text-right tracking-wider">
            {currentTeamNames[3]}
          </p>
        </div>
        {/* BLUE 2 FLAG */}
        <div className="absolute bottom-[55px] left-[565px] z-20 opacity-100">
          <img
            className="w-[55px] border-2 border-white"
            src={`/flag/${currentTeamCountries[3]}.svg`}
          />
        </div>

        {/* MATCH STATE + TIMER */}
        <div className="absolute bottom-[162px] left-[947px] w-[250px] h-[52px] z-20 opacity-100 flex items-center justify-center">
          <p className="text-black text-[48px] font-bold uppercase text-center tracking-wider">
            {currentMatchState}
            {currentTimerValue ? ` ${formatSeconds(currentTimerValue)}` : ''}
          </p>
        </div>
      </div>
    </main>
  );
}