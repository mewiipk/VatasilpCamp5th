import React, { useState, useEffect } from 'react';

import { db } from '../../Firebase';

export default function FourElementsDisplay() {
  const [gameData, setGameData] = useState();
  const [remainTime, setRemainTime] = useState();

  const addListener = async () => {
    const mafiaRef = db.collection('fourElements').doc('admin');
    await mafiaRef.onSnapshot(function(doc) {
      setGameData(doc.data());
    });
  };

  useEffect(() => {
    addListener();
  }, []);

  const getRemainTime = (now, time) => {
    const distance = time - now;
    const min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const sec = Math.floor((distance % (1000 * 60)) / 1000);
    return { min, sec };
  };

  useEffect(() => {
    if (gameData) {
      const endTime = new Date(gameData.endTime.toDate());
      const codeTime = new Date(gameData.codeTime.toDate());
      const interval = setInterval(() => {
        const now = new Date().getTime();
        setRemainTime({
          end: getRemainTime(now, endTime),
          code: getRemainTime(now, codeTime)
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainTime, gameData]);

  if (!gameData) {
    return null;
  }

  return (
    <React.Fragment>
      <div>Display</div>
      {remainTime ? (
        remainTime.end.min >= 0 && remainTime.end.sec >= 0 ? (
          <div>
            {remainTime.end.min} {remainTime.end.sec}
          </div>
        ) : (
          <p>หมดเวลา</p>
        )
      ) : null}
      {remainTime && remainTime.end.min >= 0 && remainTime.end.sec >= 0 ? (
        remainTime.code.min >= 0 && remainTime.code.sec >= 0 ? (
          <div>
            {remainTime.code.min} {remainTime.code.sec}
          </div>
        ) : (
          <p>ใส่ Code ได้</p>
        )
      ) : null}
      {gameData.showTop3 && <Top3 players={gameData.players} />}
      {gameData.showBottom3 && <Bottom3 players={gameData.players} />}
    </React.Fragment>
  );
}

function Top3({ players }) {
  const top3players = Object.values(players).sort(function(a, b) {
    return a.money - b.money;
  });

  return (
    <div>
      <p>Top 3 Players</p>
      <ol>
        {top3players.slice(0, 3).map(player => {
          return <li key={player.uid}>{player.name}</li>;
        })}
      </ol>
    </div>
  );
}

function Bottom3({ players }) {
  const bottom3players = Object.values(players).sort(function(a, b) {
    return b.money - a.money;
  });

  return (
    <div>
      <p>Bottom 3 Players</p>
      <ol>
        {bottom3players.slice(0, 3).map(player => {
          return <li key={player.uid}>{player.name}</li>;
        })}
      </ol>
    </div>
  );
}
