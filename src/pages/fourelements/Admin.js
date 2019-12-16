import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import { db } from '../../Firebase';
import { codeCheckRound1 } from './utils/codeCheck';

const GAME_STATE = {
  IDLE: 0,
  START: 1
};

export default function AdminElements() {
  const [gameData, setGameData] = useState();
  const [endTime, setEndTime] = useState(0);
  const [codeTime, setCodeTime] = useState(0);

  const addListener = async () => {
    const mafiaRef = db.collection('fourElements').doc('admin');
    await mafiaRef.onSnapshot(function(doc) {
      setGameData(doc.data());
    });
  };

  useEffect(() => {
    addListener();
  }, []);

  if (!gameData) {
    return null;
  }

  if (gameData.gameState === GAME_STATE.IDLE) {
    return <IdleState />;
  }

  const addTimer = () => {
    const newEndTime = new Date();
    console.log({ codeTime, endTime });
    const minutes = newEndTime.getMinutes() + parseInt(endTime);
    newEndTime.setMinutes(minutes);
    const newCodeTime = new Date();
    const cminutes = newCodeTime.getMinutes() + parseInt(codeTime);
    newCodeTime.setMinutes(cminutes);
    const mafiaRef = db.collection('fourElements').doc('admin');
    mafiaRef.update({ endTime: newEndTime, codeTime: newCodeTime });
  };

  const resetTimer = () => {
    const now = new Date();
    const mafiaRef = db.collection('fourElements').doc('admin');
    mafiaRef.update({ endTime: now, codeTime: now });
  };

  return (
    <React.Fragment>
      <div className="admin-elements">Admin four elements</div>
      <div>
        <span>ใส่เวลา</span>
        <input
          value={codeTime}
          onChange={e => setCodeTime(e.target.value)}
          type="number"
        />
        <input
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          type="number"
        />
        <button onClick={() => addTimer()}>Start Timer</button>
      </div>
      <div>
        <button onClick={() => resetTimer()}>Reset Timer</button>
      </div>
      <div>
        <p>Round</p>
        <Radio.Group
          onChange={e => {
            const mafiaRef = db.collection('fourElements').doc('admin');
            mafiaRef.update({ gameRound: e.target.value });
          }}
          value={gameData.gameRound}
        >
          <Radio.Button value={1}>1</Radio.Button>
          <Radio.Button value={2}>2</Radio.Button>
          <Radio.Button value={3}>3</Radio.Button>
          <Radio.Button value={4}>4</Radio.Button>
          <Radio.Button value={5}>5</Radio.Button>
          <Radio.Button value={6}>Bonus</Radio.Button>
        </Radio.Group>
      </div>
      <button>Reset Score</button>
      <CheckCode />
    </React.Fragment>
  );
}

function IdleState() {
  const checkAllRandom = allPlayers => {
    const checkElements = {
      fire: 0,
      water: 0,
      earth: 0,
      wind: 0
    };
    const allUid = Object.keys(allPlayers);
    allUid.map(uid => {
      const element = allPlayers[uid].element;
      checkElements[element] += 1;
    });
    console.log(checkElements);
  };

  const randomTeam = async () => {
    const allPlayers = {};
    await db
      .collection('user-test')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          allPlayers[doc.id] = doc.data();
        });
      });
    const allUid = Object.keys(allPlayers);
    const MAX_PERSON_PER_ELEMENT = Math.ceil(allUid.length / 4);
    const elements = ['fire', 'water', 'earth', 'wind'];
    const checkElements = {
      fire: MAX_PERSON_PER_ELEMENT,
      water: MAX_PERSON_PER_ELEMENT,
      earth: MAX_PERSON_PER_ELEMENT,
      wind: MAX_PERSON_PER_ELEMENT
    };
    allUid.map(uid => {
      const randInt = Math.floor(Math.random() * elements.length);
      const element = elements[randInt];
      allPlayers[uid].element = element;
      allPlayers[uid].money = 0;
      checkElements[element] -= 1;
      if (checkElements[element] <= 0) {
        elements.splice(randInt, 1);
      }
    });
    checkAllRandom(allPlayers);
    const mafiaRef = db.collection('fourElements').doc('admin');
    mafiaRef.update({ gameState: GAME_STATE.START, players: allPlayers });
  };

  return (
    <div>
      <h1>Ready for this?</h1>
      <button onClick={() => randomTeam()}>Random Team</button>
    </div>
  );
}

function CheckCode() {
  const players = {
    '1': {
      uid: '1',
      name: 'Titoo',
      element: 'earth',
      money: 0
    },
    '2': {
      uid: '2',
      name: 'Titoo2',
      element: 'earth',
      money: 0
    },
    '3': {
      uid: '3',
      name: 'Titoo3',
      element: 'earth',
      money: 0
    }
  };
  const group = Object.values(players);
  const newPlayers = codeCheckRound1(players, group);

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Element</th>
          <th>Money</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(newPlayers).map((key, i) => {
          const { name, element, money } = newPlayers[key];
          return (
            <tr key={key}>
              <td>{i + 1}</td>
              <td>{name}</td>
              <td>{element}</td>
              <td>{money}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
