//Player เป็น object ของ player ทุกคน / group คือ array ของคนที่กรอกโค้ดเดียวกัน
export function codeCheckRound1(players, group) {
  let newPlayers = players;
  let elements = {};
  group.map((player, i) => {
    //ดักว่าเกิน 3 คน
    if (i > 2) {
      break;
    }
    const element = player.element;
    if (!elements[element]) {
      elements[element] = [];
    }
    elements[element].push(player.uid);
  });
  const allElements = Object.keys(elements);
  switch (allElements.length) {
    case 1: {
      const elementSame = allElements[0];
      newPlayers = newPlayers.map(player => {
        if (elements[elementSame].includes(player.uid)) {
          return { ...player, money: player.money + 1000 };
        }
        return player;
      });
    }
    case 2: {
      const elementSame =
        elements[allElements[0]].length === 1 ? allElements[1] : allElements[0];
      const elementDiff =
        elementSame === allElements[1] ? allElements[0] : allElements[1];
      newPlayers = newPlayers.map(player => {
        if (elements[elementSame].includes(player.uid)) {
          return { ...player, money: player.money - 1000 };
        } else if (elements[elementDiff].includes(player.uid)) {
          return { ...player, money: player.money + 2000 };
        }
        return player;
      });
    }
  }
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
