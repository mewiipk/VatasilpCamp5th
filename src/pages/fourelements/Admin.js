import React from 'react';
import { codeCheckRound1 } from './utils/codeCheck';

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
      element: 'earth',
      money: 0
    },
    '2': {
      uid: '2',
      name: 'Titoo2',
      element: 'earth',
      money: 0
    },
    '3': {
      uid: '3',
      name: 'Titoo3',
      element: 'earth',
      money: 0
    }
  };
  const group = Object.values(players);
  const newPlayers = codeCheckRound1(players, group);

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
