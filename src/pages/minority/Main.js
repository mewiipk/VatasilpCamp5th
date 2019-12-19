import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { Radio } from 'antd';

export default function MainMinority({ uid }) {
  const [gameData, setGameData] = useState();
  const [vote, setVote] = useState();

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
    const group = gameData.players[uid].group;
    setVote(null);
    if (vote === 1) {
      return db.runTransaction(function(transaction) {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(mafiaRef).then(function(mafiaDoc) {
          if (!mafiaDoc.exists) {
            throw 'Document does not exist!';
          }
          const votePlayers = gameData.votePlayers;
          votePlayers[uid] = vote;
          const vote1 = mafiaDoc.data().vote1;
          vote1[group][uid] = vote;
          mafiaRef.update({ vote1, votePlayers });
          transaction.update(mafiaRef, {
            vote1,
            votePlayers
          });
        });
      });
    } else {
      return db.runTransaction(function(transaction) {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(mafiaRef).then(function(mafiaDoc) {
          if (!mafiaDoc.exists) {
            throw 'Document does not exist!';
          }
          const votePlayers = gameData.votePlayers;
          votePlayers[uid] = vote;
          const vote2 = mafiaDoc.data().vote2;
          vote2[group][uid] = vote;
          mafiaRef.update({ vote2, votePlayers });
          transaction.update(mafiaRef, {
            vote2,
            votePlayers
          });
        });
      });
    }
  };

  if (!gameData) {
    return null;
  }

  if (gameData.gameState === 0) {
    return <p>รอก่อนนะ . . .</p>;
  }

  if (!gameData.players[uid].group) {
    return <SelectGroup uid={uid} />;
  }

  console.log(gameData.canVote);
  return (
    <div className="main-minority">
      {/* <p>พลังชีวิต: {gameData.players[uid].lives}</p> */}
      {gameData.canVote ? (
        !gameData.votePlayers[uid] ? (
          <div>
            <Radio.Group onChange={e => setVote(e.target.value)} value={vote}>
              <Radio.Button value={1}>{gameData.question.choice1}</Radio.Button>
              <Radio.Button value={2}>{gameData.question.choice2}</Radio.Button>
            </Radio.Group>
            <button onClick={() => onVote(vote)} disabled={!vote}>
              โหวต
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
      ) : (
        <div>
          <p>กรุณารอการโหวตอีกสักครู่</p>
        </div>
      )}
    </div>
  );
}

function SelectGroup({ uid }) {
  const [group, setGroup] = useState(1);
  const [team, setTeam] = useState(1);

  const submitVote = () => {
    const mafiaRef = db.collection('minority').doc('admin');
    return db.runTransaction(function(transaction) {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(mafiaRef).then(function(mafiaDoc) {
        if (!mafiaDoc.exists) {
          throw 'Document does not exist!';
        }
        const players = mafiaDoc.data().players;
        players[uid].team = team;
        players[uid].group = group;
        transaction.update(mafiaRef, {
          players
        });
      });
    });
  };

  return (
    <div>
      <div>
        <p>เลือกทีม</p>
        <Radio.Group onChange={e => setTeam(e.target.value)} value={team}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
            <Radio.Button value={num}>{num}</Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <div>
        <p>เลือกกลุ่มย่อย</p>
        <Radio.Group onChange={e => setGroup(e.target.value)} value={group}>
          {[1, 2, 3, 4].map(num => (
            <Radio.Button value={num}>{num}</Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <button onClick={() => submitVote()}>ยืนยัน</button>
    </div>
  );
}
