import React, { useState, useEffect } from "react";

import { db } from "../../Firebase";

export default function FourElementsDisplay() {
  const [gameData, setGameData] = useState();
  const [remainTime, setRemainTime] = useState();

  const addListener = async () => {
    const mafiaRef = db.collection("fourElements").doc("admin");
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
      const codeTime = new Date(gameData.codeTime.toDate());
      const interval = setInterval(() => {
        const now = new Date().getTime();
        setRemainTime({
          end: getRemainTime(now, endTime),
          code: getRemainTime(now, codeTime)
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainTime, gameData]);

  if (!gameData) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="content-container">
        <div className="fourelements">
          <h1>รวมเผ่า</h1>
          {remainTime ? (
            remainTime.end.min >= 0 && remainTime.end.sec >= 0 ? (
              <div className="timer-container">
                <div>
                  <p>
                    เหลือเวลาอีกทั้งหมด{" "}
                    <span>
                      {remainTime.end.min}:{remainTime.end.sec}
                    </span>{" "}
                    นาทีก่อนหมดเวลา
                  </p>
                  {remainTime.code.min >= 0 && remainTime.code.sec >= 0 ? (
                    <div>
                      <p>
                        เหลือเวลาอีก{" "}
                        <span>
                          {remainTime.code.min}:{remainTime.code.sec}
                        </span>{" "}
                        นาทีจึงจะสามารถใส่ code ได้
                      </p>
                    </div>
                  ) : (
                    <p className="send-code">
                      ตอนนี้คุณสามารถใส่ Code ได้แล้ว กด Send
                      เพื่อยืนยันการจับกลุ่มก่อนหมดเวลา
                    </p>
                  )}
                </div>

                <div className="condition">
                  {(() => {
                    switch (gameData.gameRound) {
                      case 1:
                        return <p><span>โจทย์ : </span>จับกลุ่ม 3 คน เผ่าเดียวกันหมด</p>;
                      case 2:
                        return <p><span>โจทย์ : </span>จับกลุ่ม 3 คน เผ่าต่างกันทั้งหมด</p>;
                      case 3:
                        return <p><span>โจทย์ : </span>จับกลุ่ม 4 คน เผ่าเดียวกันหมด</p>;
                      case 4:
                        return <p><span>โจทย์ : </span>จับกลุ่ม 4 คน เผ่าต่างกันทั้งหมด</p>;
                      case 5:
                        return (
                          <p><span>โจทย์ : </span>จับกลุ่ม 4 คน มี 2 เผ่า เผ่าละ 2 คน</p>
                        );
                      case 6:
                        return (
                          <p><span>โจทย์ : </span>จับกลุ่มกี่คนก็ได้ เผ่าเดียวกันหมด</p>
                        );
                      default:
                        return null;
                    }
                  })()}
                </div>
                <div className="reward">
                  {(() => {
                    switch (gameData.gameRound) {
                      case 1:
                        return <p>ทำสำเร็จ <span>+1,000 / คน</span></p>;
                      case 2:
                        return <p>ทำสำเร็จ <span>+1,000 / คน</span></p>;
                      case 3:
                        return <p>ทำสำเร็จ <span>+1,000 / คน</span></p>;
                      case 4:
                        return <p>ทำสำเร็จ <span>+1,000 / คน</span></p>;
                      case 5:
                        return <p>ทำสำเร็จ <span>+1,000 / คน</span></p>;
                      case 6:
                        return <p>ทำสำเร็จได้คนละ <span>+1,000 x จำนวนคนทั้งหมด / คน</span></p>;
                      default:
                        return null;
                    }
                  })()}
                </div>
                <div className="special">
                  {(() => {
                    switch (gameData.gameRound) {
                      case 1:
                        return (
                          <div>
                            <p>
                              <span>เงื่อนไขพิเศษ : </span>มี 1 คนต่างจากพวก อีก 2คนเหมือนกัน
                            </p>
                              <p>คนที่ต่าง <span>+2,000</span> | อีก 2 คนที่เหมือนกัน <span>-1,000 / คน</span></p>
                          </div>
                        );
                      case 2:
                        return (
                          <div>
                            <p><span>เงื่อนไขพิเศษ : </span>มี 2 คนที่เหมือนกัน</p>
                            <p>2 คนที่เผ่าเดียวกัน <span>+2,000 / คน</span> | อีก 1 คนที่ต่าง <span>-1,000</span></p>
                          </div>
                        );
                      case 3:
                        return (
                          <div>
                            <p>
                            <span>เงื่อนไขพิเศษ : </span>มี 1 คนต่างจากพวก อีก 3คนเหมือนกัน
                            </p>
                            <p>คนที่ต่าง <span>+1,000</span> | อีก 3 คนที่เหมือนกัน <span>-1,000</span> / คน</p>
                          </div>
                        );
                      case 4:
                        return (
                          <div>
                            <p>
                            <span>เงื่อนไขพิเศษ : </span>มี 2 คนที่เผ่าเดียวกัน อีก 2คนที่เหลืออยู่คนละเผ่า
                            </p>
                            <p>2 คนที่เผ่าเดียวกัน <span>+2,000 / คน</span> | อีก 2 คนที่ต่างกัน <span>-1,000 / คน</span></p>
              
                          </div>
                        );
                      case 5:
                        return (
                          <div>
                            <p>
                            <span>เงื่อนไขพิเศษ : </span>มี 3 คนที่เผ่าเดียวกัน อีก 1คนไม่เข้าพวก
                            </p>
                            <p>3 คนที่เหมือนกัน <span>+2,000 / คน</span> | 1 คนที่ต่าง <span>-2,000</span></p>
                          </div>
                        );
                      case 6:
                        return (
                          <div>
                            <p>
                            <span>เงื่อนไขพิเศษ : </span>มี 1 คนที่แตกต่างจากพวกทั้งหมด
                            </p>
                            <p>คนที่ต่าง <span>+2,000 x จำนวนคนทั้งหมด</span> | คนที่เหลือ <span>-1,000 x จำนวนคนทั้งหมด / คน</span></p>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })()}
                </div>
              </div>
            ) : (
              <p>หมดเวลา</p>
            )
          ) : null}
          {gameData.showTop3 && <Top3 players={gameData.players} />}
          {gameData.showBottom3 && <Bottom3 players={gameData.players} />}
        </div>
      </div>
    </React.Fragment>
  );
}

function Top3({ players }) {
  const top3players = Object.values(players).sort(function(a, b) {
    return b.money - a.money;
  });

  return (
    <div className = "three">
      <p className = "topic">Top 3 Players</p>
      <ol>
        {top3players.slice(0, 3).map(player => {
          return <li key={player.uid}>{player.name}</li>;
        })}
      </ol>
    </div>
  );
}

function Bottom3({ players }) {
  const bottom3players = Object.values(players).sort(function(a, b) {
    return a.money - b.money;
  });

  return (
    <div className = "three">
      <p className = "topic">Bottom 3 Players</p>
      <ol>
        {bottom3players.slice(0, 3).map(player => {
          return <li key={player.uid}>{player.name}</li>;
        })}
      </ol>
    </div>
  );
}
