import React from "react";
import { useContext } from "react";
import { GameContext } from "./GameContext";

export default function GuessMap() {
  const {
    userGuessDistance,
    currentAIGuessDistance,
    currentAIGuessCountry,
    userGuessCountry,
    actualCountry,
    userTotalScore,
    aiTotalScore,
    userRoundScore,
    aiRoundScore,
    userRoundWins,
    aiRoundWins,
  } = useContext(GameContext);

  return (
    <div
      style={{ width: "640px", height: "150px" }}
      className="flex flex-row items-center bg-white rounded-3xl justify-evenly bg-opacity-[0.88]"
    >
      <div>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="pr-4 underline">Guesser</th>
              <th className="pr-4 underline whitespace-nowrap">
                Distance (km)
              </th>
              <th className="pr-4 underline">Country</th>
              <th className="underline whitespace-nowrap">Round Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>User</td>
              <td>{(Math.round(userGuessDistance / 10) / 100).toString()}</td>
              <td>{userGuessCountry}</td>
              <td>{userRoundScore}</td>
            </tr>
            <tr>
              <td>AI</td>
              <td>
                {(Math.round(currentAIGuessDistance / 10) / 100).toString()}
              </td>
              <td>{currentAIGuessCountry}</td>
              <td>{aiRoundScore}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col justify-center items-center w-52 pb-3">
        <div
          className="text-4xl"
          style={{
            color:
              userGuessDistance  < currentAIGuessDistance
                ? "green"
                : "red",
          }}
        >
          {userGuessDistance  < currentAIGuessDistance
            ? "Round Win!"
            : "Round Loss!"}
        </div>
        <div>
          User: {userTotalScore} AI: {aiTotalScore}
        </div>
      </div>
    </div>
  );
}
