import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../Firebase';

const IDENTITY = {
  mafia: 'mafia',
  people: 'people'
};

export default function AdminMafia() {
  const [gameData, setGameData] = useState();
  const nameRef = useRef();
  const [identity, setIdentity] = useState(IDENTITY.people);

  const addListener = async () => {
    const mafiaRef = db.collection('mafia').doc('admin');
    await mafiaRef.onSnapshot(function(doc) {
      setGameData(doc.data());
    });
  };

  useEffect(() => {
    addListener();
  }, []);

  const changeVoteStatus = isOpen => {
    const mafiaRef = db.collection('mafia').doc('admin');
    mafiaRef.update({ isOpen });
  };

  const changeShownStatus = isShown => {
    const mafiaRef = db.collection('mafia').doc('admin');
    mafiaRef.update({ isShown });
  };

  console.log(gameData);

  if (!gameData) {
    return <p>โหลดแปป</p>;
  }

  return (
    <React.Fragment>
      <div className="admin-mafia">Admin eng ja</div>

      <div className="add-name">
        <input ref={nameRef} placeholder="ใส่ชื่อ" />
        <select value={identity} onChange={e => setIdentity(e.target.value)}>
          <option value={IDENTITY.mafia}>Mafia</option>
          <option value={IDENTITY.people}>People</option>
        </select>
        <button
          disabled={gameData.players.length >= 12}
          onClick={() => {
            const newPlayers = [...gameData.players];
            newPlayers.push({
              name: nameRef.current.value,
              vote: 0,
              identity,
              status: 'alive'
            });
            const mafiaRef = db.collection('mafia').doc('admin');
            mafiaRef.update({ players: newPlayers });
          }}
        >
          เพิ่มชื่อ
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Identity</th>
            <th>Vote</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {gameData.players &&
            gameData.players.map((player, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{player.name}</td>
                  <td>{player.identity}</td>
                  <td>{player.vote}</td>
                  <td>{player.status}</td>
                  <td>
                    <button
                      disabled={player.status === 'die'}
                      onClick={() => {
                        const newPlayers = [...gameData.players];
                        newPlayers[i].status = 'die';
                        const mafiaRef = db.collection('mafia').doc('admin');
                        mafiaRef.update({ players: newPlayers });
                      }}
                    >
                      Die!
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="voting-status">
        <p>{gameData.isOpen ? 'เปิิดโหวต' : 'ปิิดโหวต'}</p>
        <button onClick={() => changeVoteStatus(true)}>Open Vote</button>
        <button onClick={() => changeVoteStatus(false)}>Close Vote</button>
        <button
          onClick={() => {
            let newPlayers = [...gameData.players];
            newPlayers = newPlayers.map(player => {
              return { ...player, vote: 0 };
            });
            const mafiaRef = db.collection('mafia').doc('admin');
            mafiaRef.update({ players: newPlayers, voters: [] });
          }}
        >
          Reset Vote
        </button>
      </div>

      <div className="result">
        <p>
          {gameData.isShown ? (
            <HighestVote gameData={gameData} />
          ) : (
            'ขอนับคะแนนโหวตแปปนึงน้า'
          )}
        </p>
        <button onClick={() => changeShownStatus(true)}>Show Result</button>
        <button onClick={() => changeShownStatus(false)}>Close Result</button>
      </div>
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
