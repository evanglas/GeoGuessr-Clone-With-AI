import React from "react";
import { useState, useContext } from "react";
import GuessMap from "./GuessMap";
import { GameContext } from "./GameContext";
import GuessResults from "./GuessResults";
import LocationInfo from "./LocationInfo";

export default function ScoreBar(props) {
  const { round, userRoundWins, aiRoundWins } = useContext(GameContext);
  return (
    <div className="absolute z-10 top-2 h-fit w-full flex flex-row justify-center items-center">
      <div className="p-1 mr-2 bg-green-300 text-2xl">
        User: {userRoundWins}
      </div>
      <div className="pl-2 pr-2 pt-1 pb-1 w-fit bg-white text-center text-2xl bg-opacity-80 whitespace-nowrap">
        Round {round}
      </div>
      <div className="p-1 ml-2 bg-red-300 text-2xl">AI: {aiRoundWins}</div>
    </div>
  );
}
