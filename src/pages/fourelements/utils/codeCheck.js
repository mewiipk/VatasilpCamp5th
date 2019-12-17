import { all } from 'q';

//Player เป็น object ของ player ทุกคน / group คือ array ของคนที่กรอกโค้ดเดียวกัน
export function codeCheckRound1(players, group, code) {
  let newPlayers = players;
  let elements = {}; //มีดินน้ำลมไฟกี่อัน
  group.map((player, i) => {
    //ดักว่าเกิน 3 คน
    if (i > 2) {
      return;
    }
    const element = player.element;
    newPlayers[player.uid].history = {
      code,
      group
    };
    if (!elements[element]) {
      elements[element] = [];
    }
    elements[element].push(player.uid);
  });
  if (group.length < 3) {
    return newPlayers;
  }

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

export function codeCheckRound2(players, group, code) {
  let newPlayers = players;
  let elements = {};
  group.map((player, i) => {
    //ดักว่า 3 คนไม่เหมือนกัน
    if (i > 2) {
      return;
    }
    const element = player.element;
    newPlayers[player.uid].history = {
      code,
      group
    };
    if (!elements[element]) {
      elements[element] = [];
    }
    elements[element].push(player.uid);
  });
  if (group.length < 3) {
    return newPlayers;
  }

  const allElements = Object.keys(elements);
  if (allElements.length === 3) {
    for (let i = 0; i < 3; i++) {
      elements[allElements[i]].map(uid => {
        newPlayers[uid].money += 1000;
      });
    }
  } else if (allElements.length === 2) {
    const elementSame =
      elements[allElements[0]].length === 1 ? allElements[1] : allElements[0];
    const elementDiff =
      elementSame === allElements[1] ? allElements[0] : allElements[1];
    elements[elementSame].map(uid => {
      newPlayers[uid].money += 2000;
    });
    elements[elementDiff].map(uid => {
      newPlayers[uid].money -= 1000;
    });
  }
  return newPlayers;
}

export function codeCheckRound3(players, group, code) {
  let newPlayers = players;
  let elements = {}; //มีดินน้ำลมไฟกี่อัน
  group.map((player, i) => {
    //ดักว่าเกิน 4 คน
    if (i > 3) {
      return;
    }
    const element = player.element;
    newPlayers[player.uid].history = {
      code,
      group
    };
    if (!elements[element]) {
      elements[element] = [];
    }
    elements[element].push(player.uid);
  });
  if (group.length < 4) {
    return newPlayers;
  }

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
      newPlayers[uid].money += 1000;
    });
  }
  return newPlayers;
}

export function codeCheckRound4(players, group, code) {
  let newPlayers = players;
  let elements = {}; //มีดินน้ำลมไฟกี่อัน
  group.map((player, i) => {
    //ดักว่าเกิน 4 คน
    if (i > 3) {
      return;
    }
    const element = player.element;
    newPlayers[player.uid].history = {
      code,
      group
    };
    if (!elements[element]) {
      elements[element] = [];
    }
    elements[element].push(player.uid);
  });
  if (group.length < 4) {
    return newPlayers;
  }

  const allElements = Object.keys(elements);
  if (allElements.length === 4) {
    for (let i = 0; i < 4; i++) {
      elements[allElements[i]].map(uid => {
        newPlayers[uid].money += 1000;
      });
    }
  } else if (allElements.length === 3) {
    let elementSame = null;
    let elementDiff1 = null;
    let elementDiff2 = null;
    if (elements[allElements[0]].length !== 1) {
      elementSame = allElements[0];
      elementDiff1 = allElements[1];
      elementDiff2 = allElements[2];
    } else if (elements[allElements[1]].length !== 1) {
      elementSame = allElements[1];
      elementDiff1 = allElements[0];
      elementDiff2 = allElements[2];
    } else if (elements[allElements[2]].length !== 1) {
      elementSame = allElements[2];
      elementDiff1 = allElements[0];
      elementDiff2 = allElements[1];
    }
    elements[elementSame].map(uid => {
      newPlayers[uid].money += 2000;
    });
    elements[elementDiff1].map(uid => {
      newPlayers[uid].money -= 1000;
    });
    elements[elementDiff2].map(uid => {
      newPlayers[uid].money -= 1000;
    });
  }
  return newPlayers;
}

export function codeCheckRound5(players, group, code) {
  let newPlayers = players;
  let elements = {}; //มีดินน้ำลมไฟกี่อัน
  group.map((player, i) => {
    //ดักว่าเกิน 4 คน
    if (i > 3) {
      return;
    }
    const element = player.element;
    newPlayers[player.uid].history = {
      code,
      group
    };
    if (!elements[element]) {
      elements[element] = [];
    }
    elements[element].push(player.uid);
  });
  if (group.length < 4) {
    return newPlayers;
  }

  const allElements = Object.keys(elements);
  if (allElements.length === 2) {
    let elementSame = null;
    let elementDiff = null;
    if (
      elements[allElements[0]].length === 2 &&
      elements[allElements[1]].length === 2
    ) {
      for (let i = 0; i < 2; i++) {
        elements[allElements[i]].map(uid => {
          newPlayers[uid].money += 1000;
        });
      }
    } else if (elements[allElements[0]].length === 3) {
      elementSame = allElements[0];
      elementDiff = allElements[1];
      elements[elementSame].map(uid => {
        newPlayers[uid].money += 2000;
      });
      elements[elementDiff].map(uid => {
        newPlayers[uid].money -= 2000;
      });
    } else if (elements[allElements[1]].length === 3) {
      elementSame = allElements[1];
      elementDiff = allElements[0];
      elements[elementSame].map(uid => {
        newPlayers[uid].money += 2000;
      });
      elements[elementDiff].map(uid => {
        newPlayers[uid].money -= 2000;
      });
    }
  }
  return newPlayers;
}

export function codeCheckBonusRound(players, group, code) {
  let newPlayers = players;
  let elements = {}; //มีดินน้ำลมไฟกี่อัน
  group.map((player, i) => {
    const element = player.element;
    newPlayers[player.uid].history = {
      code,
      group
    };
    if (!elements[element]) {
      elements[element] = [];
    }
    elements[element].push(player.uid);
  });
  if (group.length < 2) {
    return newPlayers;
  }

  const allElements = Object.keys(elements);
  console.log(allElements);
  if (allElements.length === 1) {
    const elementSame = allElements[0];
    elements[elementSame].map(uid => {
      newPlayers[uid].money += 1000 * group.length;
    });
  } else if (
    allElements.length === 2 &&
    (elements[allElements[0]].length === 1 ||
      elements[allElements[1]].length === 1)
  ) {
    const elementSame =
      elements[allElements[0]].length === 1 ? allElements[1] : allElements[0];
    const elementDiff =
      elementSame === allElements[1] ? allElements[0] : allElements[1];
    elements[elementSame].map(uid => {
      newPlayers[uid].money -= 1000 * group.length;
    });
    elements[elementDiff].map(uid => {
      newPlayers[uid].money += 2000 * group.length;
    });
  }

  return newPlayers;
}
