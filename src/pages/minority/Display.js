import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';

export default function DisplayMinority() {
  const [gameData, setGameData] = useState();
  const [remainTime, setRemainTime] = useState();

  const addListener = async () => {
    const mafiaRef = db.collection('minority').doc('admin');
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
      const interval = setInterval(() => {
        const now = new Date().getTime();
        setRemainTime(getRemainTime(now, endTime));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainTime, gameData]);

  if (!gameData) {
    return null;
  }

  if (gameData.showResult) {
    return (
      <div>
        <div>
          <p>ผลโหวต</p>
          {Object.keys(gameData.vote1).map(num => {
            return (
              <div>
                <p>กลุ่มย่อยที่ {num}</p>
                <p>
                  {gameData.question.choice1}:{' '}
                  {Object.keys(gameData.vote1[num]).length}
                </p>
                <p>
                  {gameData.question.choice2}:{' '}
                  {Object.keys(gameData.vote2[num]).length}
                </p>
              </div>
            );
          })}
        </div>
        <div>
          <p>คะแนนแต่ละทีม</p>
          {Object.keys(gameData.score).map(num => {
            return (
              <p>
                ทีมที่ {num}: {gameData.score[num]} คะแนน
              </p>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div>Display</div>
      {remainTime ? (
        remainTime.min >= 0 && remainTime.sec >= 0 ? (
          <div>
            {remainTime.min} {remainTime.sec}
          </div>
        ) : (
          <p>หมดเวลา</p>
        )
      ) : null}
      <div>
        <div>
          <span>คำถาม: </span>
          <div>{gameData.question.question}</div>
        </div>
        <div>
          <span>ตัวเลือกที่ 1: </span>
          <div>{gameData.question.choice1}</div>
        </div>
        <div>
          <span>ตัวเลือกที่ 2: </span>
          <div>{gameData.question.choice2}</div>
        </div>
      </div>
    </React.Fragment>
  );
}
