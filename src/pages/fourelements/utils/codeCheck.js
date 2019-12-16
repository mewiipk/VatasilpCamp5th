//Player เป็น object ของ player ทุกคน / group คือ array ของคนที่กรอกโค้ดเดียวกัน
export function codeCheckRound1(players, group) {
  let newPlayers = players;
  let elements = {};
  group.map((player, i) => {
    //ดักว่าเกิน 3 คน
    if (i > 2) {
      return;
    }
    const element = player.element;
    if (!elements[element]) {
      elements[element] = [];
    }
    elements[element].push(player.uid);
  });
  const allElements = Object.keys(elements);
  if (allElements.length === 1) {
    const elementSame = allElements[0];
    elements[elementSame].map(uid => {
      newPlayers[uid].money += 1000;
    });
  } else if (allElements.length === 2) {
    const elementSame =
      elements[allElements[0]].length === 1 ? allElements[1] : allElements[0];
    const elementDiff =
      elementSame === allElements[1] ? allElements[0] : allElements[1];
    elements[elementSame].map(uid => {
      newPlayers[uid].money -= 1000;
    });
    elements[elementDiff].map(uid => {
      newPlayers[uid].money += 2000;
    });
  }
  return newPlayers;
}

export function codeCheckRound2(players, group) {
  //Code here...
}

export function codeCheckRound3(players, group) {
  //Code here...
}

export function codeCheckRound4(players, group) {
  //Code here...
}

export function codeCheckRound5(players, group) {
  //Code here...
}

export function codeCheckBonusRound(players, group) {
  //Code here...
}
