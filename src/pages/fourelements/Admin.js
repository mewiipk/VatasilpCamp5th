import React from 'react';
import { codeCheckBonusRound } from './utils/codeCheck';


export default function AdminElements() {
  return (
    <React.Fragment>
      <div className="admin-elements">Admin four elements</div>
      <CheckCode />
    </React.Fragment>
  );
}

function CheckCode() {
  const players = {
    '1': {
      uid: '1',
      name: 'Titoo',
      element: 'water',
      money: 0
    },
    '2': {
      uid: '2',
      name: 'Titoo2',
      element: 'water',
      money: 0
    },
    '3': {
      uid: '3',
      name: 'Titoo3',
      element: 'wind',
      money: 0
    },
    '4': {
      uid: '4',
      name: 'Titoo4',
      element: 'water',
      money: 0
    },
    '5': {
      uid: '5',
      name: 'Titoo5',
      element: 'water',
      money: 0
    }
  };
  const group = Object.values(players);
  const newPlayers = codeCheckBonusRound(players, group);

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
