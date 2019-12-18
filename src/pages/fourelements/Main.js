import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { Modal } from 'antd';

export default function FourElements({ uid }) {
  const [gameData, setGameData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [remainTime, setRemainTime] = useState();
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
    const min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const sec = Math.floor((distance % (1000 * 60)) / 1000);
    return { min, sec, distance };
  };

  useEffect(() => {
    if (gameData) {
      const endTime = new Date(gameData.endTime.toDate());
      const codeTime = new Date(gameData.codeTime.toDate());
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const end = getRemainTime(now, endTime);
        const code = getRemainTime(now, codeTime);
        setRemainTime({
          end,
          code
        });
        setCanCode(end.distance > 0 && code.distance <= 0);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainTime, gameData]);

  if (!gameData) {
    return null;
  }

  if (gameData.gameState === 0) {
    return <p className="wait">เกมนี้ยังไม่เริ่ม กรุณารอสักครู่</p>;
  }

  return (
    <React.Fragment>
      <Modal
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <div className="player-info">
          <p>
            เผ่าของคุณคือเผ่า <span>{gameData.players[uid].element}</span>
          </p>
          <div>
            <p>
              ตอนนี้คุณมีเงินอยู่ <span>{gameData.players[uid].money}</span> บาท
            </p>
          </div>
        </div>
      </Modal>
      <div className="content-container">
        <div className="fourelements">
          <h1>รวมเผ่า</h1>
          <p>
            สามารถกดปุ่มดูเผ่า เพื่อดูเผ่าของคุณและจำนวนเงินที่มีอยู่ แต่ระวัง
            อาจจะมีคนแอบมองอยู่ก็ได้นะ
          </p>
          <button className="see-info" onClick={() => setShowModal(true)}>
            ดูเผ่า
          </button>
          {remainTime && remainTime.end.min >= 0 && remainTime.end.sec >= 0 && (
            <div className="timer-container">
              <div>
                {remainTime.end.min} {remainTime.end.sec}
              </div>
              {remainTime.code.min >= 0 && remainTime.code.sec >= 0 ? (
                <div>
                  {remainTime.code.min} {remainTime.code.sec}
                </div>
              ) : (
                <p>ใส่ Code ได้</p>
              )}
            </div>
          )}
          {canCode ? (
            !gameData.sentPlayers[uid] ? (
              <div className="input-code">
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
                  <input
                    className="input-here"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                  />
                  <button className="submit-code" type="submit">
                    Send
                  </button>
                </form>
              </div>
            ) : (
              <p>คุณได้ส่งรหัสเรียบร้อยแล้ว</p>
            )
          ) : null}
          {gameData.gameRound > 1 ? (
            gameData.players[uid].history[gameData.gameRound - 2] ? (
              <div>
                <p>ผลของรอบที่แล้ว</p>
                <p>รอบที่แล้วคุณจับคู่กับ</p>
                <ol>
                  {gameData.players[uid].history[
                    gameData.gameRound - 2
                  ].group.map(player => {
                    if (player.uid === uid) return null;
                    return <li key={player.uid}>{player.name}</li>;
                  })}
                </ol>
              </div>
            ) : (
              <div>
                <p>รอบที่แล้ว คุณไม่ได้จับกลุ่ม หรืออาจจะจับไม่ครบ</p>
              </div>
            )
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
}
