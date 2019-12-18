import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';

export default function AdminMinority() {
  const [gameData, setGameData] = useState();
  const [question, setQuestion] = useState({
    question: '',
    choice1: '',
    choice2: ''
  });
  const [endTime, setEndTime] = useState(0);

  const addListener = async () => {
    const mafiaRef = db.collection('minority').doc('admin');
    await mafiaRef.onSnapshot(function(doc) {
      setGameData(doc.data());
    });
  };

  const startVote = () => {
    const newEndTime = new Date();
    const minutes = newEndTime.getMinutes() + parseInt(endTime);
    newEndTime.setMinutes(minutes);
    const mafiaRef = db.collection('minority').doc('admin');
    mafiaRef.update({
      endTime: newEndTime,
      question,
      canVote: true,
      showResult: false,
      votePlayers: {},
      vote1: { 1: {}, 2: {}, 3: {}, 4: {} },
      vote2: { 1: {}, 2: {}, 3: {}, 4: {} }
    });
  };

  const checkVote = () => {
    const players = gameData.players;
    const vote1 = gameData.vote1;
    const vote2 = gameData.vote2;
    const score = gameData.score;
    Object.keys(vote1).map(num => {
      const allVote1 = Object.keys(vote1[num]);
      const allVote2 = Object.keys(vote2[num]);
      const winners = allVote1.length <= allVote2.length ? allVote1 : allVote2;
      Object.keys(winners).map(uid => {
        const team = gameData.players[uid].team;
        score[team] += 1;
      });
    });
    const mafiaRef = db.collection('minority').doc('admin');
    mafiaRef.update({ players, score, showResult: true });
  };

  useEffect(() => {
    addListener();
  }, []);

  if (!gameData) {
    return null;
  }

  if (gameData.gameState === 0) {
    return <IdleState />;
  }

  return (
    <React.Fragment>
      <div>
        <div>
          <span>คำถาม:</span>
          <input
            value={question.question}
            onChange={e =>
              setQuestion({ ...question, question: e.target.value })
            }
          />
        </div>
        <div>
          <span>ตัวเลือกที่ 1:</span>
          <input
            value={question.choice1}
            onChange={e =>
              setQuestion({ ...question, choice1: e.target.value })
            }
          />
        </div>
        <div>
          <span>ตัวเลือกที่ 2:</span>
          <input
            value={question.choice2}
            onChange={e =>
              setQuestion({ ...question, choice2: e.target.value })
            }
          />
        </div>
        <div>
          <span>ใส่เวลา</span>
          <input
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            type="number"
          />
        </div>
        <div>
          {!gameData.canVote ? (
            <button onClick={() => startVote()}>เริ่มโหวต</button>
          ) : (
            <button
              onClick={() => {
                const mafiaRef = db.collection('minority').doc('admin');
                mafiaRef.update({ endTime: new Date(), canVote: false });
              }}
            >
              หยุดโหวต
            </button>
          )}
          <button onClick={() => checkVote()}>Show Result</button>
        </div>
      </div>
    </React.Fragment>
  );
}

function IdleState() {
  const startGame = async () => {
    const allPlayers = {};
    await db
      .collection('user')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          allPlayers[doc.id] = doc.data();
          allPlayers[doc.id].lives = 3;
        });
      });
    const mafiaRef = db.collection('minority').doc('admin');
    mafiaRef.update({ gameState: 1, players: allPlayers });
  };
  return (
    <div>
      <button onClick={() => startGame()}>Start Game</button>
    </div>
  );
}
