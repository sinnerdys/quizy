import React from 'react';

function Leaderboard() {
  const players = [
    { id: 1, name: 'John', score: 1200 },
    { id: 2, name: 'Jane', score: 1100 },
    { id: 3, name: 'Alice', score: 1000 },
  ];

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - {player.score} points
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
