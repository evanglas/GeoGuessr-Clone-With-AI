import React from "react";
import { useState, useContext } from "react";
import GuessMap from "./GuessMap";
import { GameContext } from "./GameContext";
import GuessResults from "./GuessResults";
import LocationInfo from "./LocationInfo";

export default function MapGroup(props) {
  const {
    setCurrentAIGuess,
    setCurrentAIGuessDistance,
    showingResults,
    setShowingResults,
    nextAIGuess,
    nextAIGuessDistance,
    setNextAIGuessDistance,
    setNextAIGuess,
    currentAIGuess,
    currentAIGuessDistance,
    setShowingAIGuess,
    actualCountry,
    actualCity,
    round,
    setRound,
    setUserTotalScore,
    setAITotalScore,
  } = useContext(GameContext);

  const onLearnMore = () => {
    window.open(
      "http://google.com/search?q=" + actualCity + ", " + actualCountry
    );
  };

  const onShowResults = () => {
    if (currentAIGuess) {
      const na1 = currentAIGuess;
      const na2 = currentAIGuessDistance;
      setCurrentAIGuess(na1);
      setCurrentAIGuessDistance(na2);
      if (!showingResults) {
        setNextAIGuess(null);
        setNextAIGuessDistance(null);
      } else {
        setRound(round + 1);
      }
      setShowingResults(!showingResults);
    }
    console.log("Round: ", round);
  };

  const onSeeAIGuess = () => {
    if (currentAIGuess) {
      const ca = currentAIGuess;
      setShowingAIGuess(true);
      setCurrentAIGuess(ca);
    }
    // console.log(nextAIGuess);
  };
  return (
    <div className="h-full w-full">
      <div className="flex flex-col">
        <div
          style={{
            width: showingResults ? "100%" : "100%",
            height: showingResults ? "700px" : "224px",
          }}
          className="rounded-2xl overflow-hidden"
        >
          {showingResults && (
            <div
              style={{ left: "25px", width: "900px" }}
              className="flex flex-row z-10 absolute bottom-10 justify-around"
            >
              <GuessResults />
              <LocationInfo />
            </div>
          )}
          <GuessMap />
        </div>
        <div className="flex flex-row justify-evenly pt-3">
          {showingResults && (
            <button
              onClick={onLearnMore}
              className="w-fit p-3 bg-white rounded-full transition-all hover:scale-105"
            >
              Learn More About Location
            </button>
          )}
          <button
            onClick={onShowResults}
            className="w-fit p-3 bg-white rounded-full hover:scale-105 transition-all"
          >
            {showingResults ? "Play Again" : "See Results"}
          </button>
          {!showingResults && (
            <button
              onClick={onSeeAIGuess}
              style={{
                backgroundColor: currentAIGuess ? "lightgreen" : "lightgray",
              }}
              className="w-fit p-3 rounded-full hover:scale-105 transition-all"
            >
              See AI Guess
            </button>
          )}
          {showingResults && (
            <button
              onClick={onSeeAIGuess}
              className="w-fit p-3 bg-white rounded-full transition-all hover:scale-105"
            >
              <a
                href="https://gitlab.oit.duke.edu/wyl6/geoguessr"
                target="_blank"
              >
                Repository
              </a>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
