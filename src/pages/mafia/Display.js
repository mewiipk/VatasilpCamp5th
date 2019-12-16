import React, { useState, useEffect } from 'react';
import firebase, { db } from '../../Firebase';

export default function DisplayMafia(props) {
  const { uid } = props;
  const [gameData, setGameData] = useState();
  const [select, setSelect] = useState([]);

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
      <div className="display-mafia">Hi peepssssss</div>
      <p>{gameData.isOpen ? 'เปิิดโหวต' : 'ปิิดโหวต'}</p>

      <p>
        {gameData.isShown ? (
          <HighestVote gameData={gameData} />
        ) : (
          'ขอนับคะแนนโหวตแปปนึงน้า'
        )}
      </p>
    </React.Fragment>
  );
}

function HighestVote(props) {
  const { gameData } = props;
  const newPlayers = [...gameData.players];
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
