import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { Modal } from 'antd';

export default function FourElements({ uid }) {
  const [gameData, setGameData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [canCode, setCanCode] = useState();
  const [code, setCode] = useState('');

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
    return distance > 0;
  };

  useEffect(() => {
    if (gameData) {
      const endTime = new Date(gameData.endTime.toDate());
      const codeTime = new Date(gameData.codeTime.toDate());
      const interval = setInterval(() => {
        const now = new Date().getTime();
        setCanCode(
          getRemainTime(now, endTime) && !getRemainTime(now, codeTime)
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameData]);

  if (!gameData) {
    return null;
  }

  if (gameData.gameState === 0) {
    return <p>เกมนี้ยังไม่เริ่ม กรุณารอสักครู่</p>;
  }

  return (
    <React.Fragment>
      <Modal
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <div>
          <p>{gameData.players[uid].element}</p>
          <div>
            <p>ตอนนี้มีเงินอยู่</p>
            <p>{gameData.players[uid].money} บาท</p>
          </div>
        </div>
      </Modal>
      <div>
        <button onClick={() => setShowModal(true)}>ดูเผ่า</button>
        {canCode ? (
          !gameData.sentPlayers[uid] ? (
            <div>
              <p>ใส่ Code</p>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const mafiaRef = db.collection('fourElements').doc('admin');
                  const groups = gameData.groups;
                  const sentPlayers = gameData.sentPlayers;
                  sentPlayers[uid] = true;
                  if (gameData.groups[code]) {
                    const group = [...gameData.groups[code]];
                    group.push(gameData.players[uid]);
                    groups[code] = group;
                  } else {
                    groups[code] = [gameData.players[uid]];
                  }
                  mafiaRef.update({ groups, sentPlayers });
                }}
              >
                <input value={code} onChange={e => setCode(e.target.value)} />
                <button type="submit">Send</button>
              </form>
            </div>
          ) : (
            <p>คุณได้ส่งรหัสเรียบร้อยแล้ว</p>
          )
        ) : null}
        {gameData.players[uid].history && (
          <div>
            <p>ผลของรอบที่แล้ว</p>
            <p>รอบที่แล้วคุณจับคู่กับ</p>
            <ol>
              {gameData.players[uid].history.group.map(player => {
                if (player.uid === uid) return null;
                return <li key={player.uid}>{player.name}</li>;
              })}
            </ol>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
