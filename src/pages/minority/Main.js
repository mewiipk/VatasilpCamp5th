import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';

export default function MainMinority({ uid }) {
  const [gameData, setGameData] = useState();

  const addListener = async () => {
    const mafiaRef = db.collection('minority').doc('admin');
    await mafiaRef.onSnapshot(function(doc) {
      setGameData(doc.data());
    });
  };

  useEffect(() => {
    addListener();
  }, []);

  const onVote = vote => {
    const mafiaRef = db.collection('minority').doc('admin');
    const votePlayers = gameData.votePlayers;
    votePlayers[uid] = vote;
    if (vote === 1) {
      const vote1 = [...gameData.vote1];
      vote1.push(uid);
      mafiaRef.update({ vote1, votePlayers });
    } else {
      const vote2 = [...gameData.vote2];
      vote2.push(uid);
      mafiaRef.update({ vote2, votePlayers });
    }
  };

  if (!gameData) {
    return null;
  }

  if (gameData.gameState === 0) {
    return <p>รอก่อนนะ . . .</p>;
  }

  if (gameData.players[uid].lives === 0) {
    return <p>คุณหมดสิทธิโหวต</p>;
  }

  console.log(gameData.canVote);
  return (
    <div className="main-minority">
      <p>พลังชีวิต: {gameData.players[uid].lives}</p>
      {gameData.canVote ? (
        !gameData.votePlayers[uid] ? (
          <div>
            <button onClick={() => onVote(1)}>
              {gameData.question.choice1}
            </button>
            <button onClick={() => onVote(2)}>
              {gameData.question.choice2}
            </button>
          </div>
        ) : (
          <div>
            <p>คุณได้โหวตเรียบร้อยแล้ว</p>
            <p>
              โหวตของคุณคือ{' '}
              {gameData.votePlayers[uid] === 1
                ? gameData.question.choice1
                : gameData.question.choice2}
            </p>
          </div>
        )
      ) : null}
    </div>
  );
}
