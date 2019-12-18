import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';

export default function WhoIsMafia(props) {
  const { uid } = props;
  const [gameData, setGameData] = useState();
  const [select, setSelect] = useState([]);

  const addListener = async () => {
    const mafiaRef = db.collection('mafia').doc('admin');
    await mafiaRef.onSnapshot(function(doc) {
      setGameData(doc.data());
    });
  };

  const submitVote = () => {
    const mafiaRef = db.collection('mafia').doc('admin');
    return db.runTransaction(function(transaction) {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(mafiaRef).then(function(mafiaDoc) {
        if (!mafiaDoc.exists) {
          throw 'Document does not exist!';
        }

        // Add one person to the city population.
        // Note: this could be done without a transaction
        //       by updating the population using FieldValue.increment()
        let newPlayers = [...mafiaDoc.data().players];
        newPlayers = newPlayers.map(player => {
          if (select.includes(player.name)) {
            return { ...player, vote: player.vote + 1 };
          }
          return player;
        });
        const newVoters = mafiaDoc.data().voters;
        newVoters[uid] = true;
        transaction.update(mafiaRef, {
          players: newPlayers,
          voters: newVoters
        });
        setSelect([]);
      });
    });
  };

  useEffect(() => {
    addListener();
  }, []);

  if (!gameData) {
    return <p>โหลดแปป</p>;
  }

  if (gameData.voters[uid]) {
    return <p>รอโหวตรอบต่อไปน้าา</p>;
  }
  return (
    <React.Fragment>
      <div className="who-is-mafia">
        <div className="mafia-title">
          <h1>เกมมาเฟีย</h1>
          <p>กติกาฟัง MC อธิบายเอานะจ๊ะ</p>
        </div>
        <p className="voting-status">
          {gameData.isOpen
            ? 'เปิดให้โหวตแล้วจ้า อย่าลืมกด Submit ก่อนปิดโหวตนะ'
            : 'ปิิดโหวตแล้วจ้า มาลุ้นกันดีกว่าว่าเราจะจับคนร้ายได้หรือไม่'}
        </p>
        <div className="voting-area">
          {gameData.isOpen && (
            <React.Fragment>
              {gameData.players.map((player, i) => {
                if (player.status === 'die') {
                  return null;
                }
                return (
                  <div>
                    <button
                      className={`candidates${
                        select.includes(player.name) ? ' selected' : ''
                      }`}
                      disabled={
                        select.length >= gameData.selectNumber &&
                        !select.includes(player.name)
                      }
                      onClick={() => {
                        if (select.includes(player.name)) {
                          const index = select.indexOf(player.name);
                          const newSelect = [...select];
                          newSelect.splice(index, 1);
                          setSelect(newSelect);
                        } else {
                          const newSelect = [...select];
                          newSelect.push(player.name);
                          setSelect(newSelect);
                        }
                      }}
                    >
                      {player.name}
                    </button>
                  </div>
                );
              })}
              <button
                className="submit"
                disabled={select.length < gameData.selectNumber}
                onClick={() => submitVote()}
              >
                Submit Vote
              </button>
            </React.Fragment>
          )}
          {/* {select.map(name => (
          <span>คุณได้เลือกโหวตให้กับ {name}</span>
        ))} */}
        </div>
      </div>
    </React.Fragment>
  );
}
