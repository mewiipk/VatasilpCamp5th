import React, { useState, useEffect } from "react";
import firebase, { db } from "../../Firebase";

export default function WhoIsMafia(props) {
  const { uid } = props;
  const [gameData, setGameData] = useState();
  const [select, setSelect] = useState([]);

  const addListener = async () => {
    const mafiaRef = db.collection("mafia").doc("admin");
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

  if (gameData.voters.includes(uid)) {
    return <p>รอโหวตรอบต่อไปน้าา</p>;
  }
  return (
    <React.Fragment>
      <div className="who-is-mafia">Who is the Mafia?</div>
      <p>{gameData.isOpen ? "เปิิดโหวต" : "ปิิดโหวต"}</p>
      {gameData.isOpen && (
        <React.Fragment>
          {gameData.players.map((player, i) => {
            if (player.status === 'die') {
                return null
            }  
            return (
              <div>
                <button
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
            disabled={select.length < gameData.selectNumber}
            onClick={() => {
              const mafiaRef = db.collection("mafia").doc("admin");
              let newPlayers = [...gameData.players];
              newPlayers = newPlayers.map(player => {
                if (select.includes(player.name)) {
                  return { ...player, vote: player.vote + 1 };
                }
                return player;
              });
              const newVoters = [...gameData.voters];
              newVoters.push(uid);
              mafiaRef.update({ players: newPlayers, voters: newVoters });
              setSelect([]);
            }}
          >
            Submit Vote
          </button>
        </React.Fragment>
      )}
      {select.map(name => (
        <span>{name}</span>
      ))}
    </React.Fragment>
  );
}
