import React, { useState, useEffect } from 'react';
import firebase, { db } from '../../Firebase';

export default function DisplayMafia() {
  const [gameData, setGameData] = useState();

  const addListener = async () => {
    const mafiaRef = db.collection('mafia').doc('admin');
    await mafiaRef.onSnapshot(function(doc) {
      setGameData(doc.data());
    });
  };

  useEffect(() => {
    addListener();
  }, []);

  if (!gameData) {
    return <p>โหลดแปป</p>;
  }

  return (
    <React.Fragment>
      <div className="who-is-mafia">
        <div className="mafia-title">
          <h1>เกมมาเฟีย</h1>
        </div>
        <p>
          {gameData.isOpen
            ? 'เปิิดโหวตแล้ว อย่าลืมกด Submit ก่อนปิดโหวตล่ะ'
            : ''}
        </p>

        <p>{gameData.isShown ? <HighestVote gameData={gameData} /> : ''}</p>
      </div>
    </React.Fragment>
  );
}

function HighestVote(props) {
  const { gameData } = props;
  let highestPlayer = 0;
  let highestVote = 0;
  gameData.players.map((player, i) => {
    if (player.vote > highestVote) {
      highestPlayer = i;
      highestVote = player.vote;
    }
  });

  return (
    <p>
      คนที่ถูกโหวตมากที่สุดคือ
      <span>{gameData.players[highestPlayer].name}</span>
      ด้วยคะแนนโหวต
      <span>{gameData.players[highestPlayer].vote}</span>
    </p>
  );
}
