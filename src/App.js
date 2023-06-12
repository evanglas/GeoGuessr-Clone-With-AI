/* eslint-disable default-case */
import logo from "./logo.svg";
import "./App.css";
import GoogleMapReact from "google-map-react";
import StreetView from "./StreetView";
import MapGroup from "./MapGroup";
import Geocode from "react-geocode";
import ScoreBar from "./ScoreBar";

import React, {
  setState,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import { GameContext } from "./GameContext";
import euroCityCoords from "./euro_cities.json";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_KEY;

const getNextEuroCity = () => {
  return getNextLocation(euroCityCoords);
};

const getNextEuroCoords = (nextCity) => {
  const cityName = nextCity.City;
  return { lat: nextCity.Latitude, lng: nextCity.Longitude };
};

const getNextLocation = (locations) => {
  return locations[Math.floor(Math.random() * euroCityCoords.length)];
};

function App() {
  // Approaches: use context for game context (including when guessing, etc)
  // Have App own the map component then pass as prop to next subcomponent to avoid prop drilling
  // Above seems to be general pattern - don't let div barriers break actual relationships by just passing as props
  const [divBottom, setBottom] = useState(100);
  const [divLeft, setLeft] = useState(10);
  const [showingResults, setShowingResults] = useState(false);
  const [showingAIGuess, setShowingAIGuess] = useState(false);
  const [round, setRound] = useState(1);
  const [maps, setMaps] = useState(null);

  const [actualLocation, setActualLocation] = useState(null);
  const [actualCountry, setActualCountry] = useState(null);
  const [actualCity, setActualCity] = useState(null);
  const [nextCity, setNextCity] = useState(null);
  const [nextLocation, setNextLocation] = useState(
    getNextEuroCoords(getNextEuroCity())
  );

  const [userGuessDistance, setUserGuessDistance] = useState(null);
  const [userGuessCountry, setUserGuessCountry] = useState(null);
  const [userGuess, setUserGuess] = useState(null);
  const [userTotalScore, setUserTotalScore] = useState(0);
  const [userRoundScore, setUserRoundScore] = useState(0);

  const [currentAIGuess, setCurrentAIGuess] = useState(null);
  const [nextAIGuess, setNextAIGuess] = useState(null);
  const [currentAIGuessDistance, setCurrentAIGuessDistance] = useState(null);
  const [nextAIGuessDistance, setNextAIGuessDistance] = useState(null);
  const [currentAIGuessCountry, setCurrentAIGuessCountry] = useState(null);
  const [aiTotalScore, setAITotalScore] = useState(0);
  const [aiRoundScore, setAIRoundScore] = useState(0);
  const [userRoundWins, setUserRoundWins] = useState(0);
  const [aiRoundWins, setAIRoundWins] = useState(0);

  var prevCenter = null;

  const getGuess = async (coordinates) => {
    console.log("Getting next AI Guess");
    const api_key = process.env.OTHER_KEY;
    const url = "https://awh0r0d7x3.execute-api.us-east-1.amazonaws.com/Test";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": api_key },
      body: JSON.stringify({
        lat: coordinates["lat"],
        long: coordinates["lng"],
      }),
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    console.log("successful API call");
    console.log(data);
    const nAIGuess = {
      lat: parseFloat(data["lat"]),
      lng: parseFloat(data["long"]),
    };
    setNextAIGuess(nAIGuess);
    if (maps) {
      const nextAIADist = maps.geometry.spherical.computeDistanceBetween(
        nAIGuess,
        coordinates
      );
      setNextAIGuessDistance(nextAIADist);
    }
  };

  const getGeoInfo = async (coordinates) => {
    const response = await Geocode.fromLatLng(coordinates.lat, coordinates.lng);
    console.log(response);
    let country, city;
    for (let i = 0; i < response.results[0].address_components.length; i++) {
      for (
        let j = 0;
        j < response.results[0].address_components[i].types.length;
        j++
      ) {
        switch (response.results[0].address_components[i].types[j]) {
          case "country":
            country = response.results[0].address_components[i].long_name;
            break;
          case "locality":
            city = response.results[0].address_components[i].long_name;
            break;
        }
      }
    }
    return { country: country, city: city };
  };

  const queryLocations = async (user, ai, actual) => {
    const userInfo = await getGeoInfo(user);
    setUserGuessCountry(userInfo.country);
    const aiInfo = await getGeoInfo(ai);
    setCurrentAIGuessCountry(aiInfo.country);
    const actualInfo = await getGeoInfo(actual);
    setActualCountry(actualInfo.country);
    // setActualCity(actualInfo.city);
    return [userInfo.country, aiInfo.country, actualInfo.country];
    console.log("User Country" + userInfo.country);
  };

  const getRoundScore = (guessDistance, guessCountry, acCountry) => {
    // Can tune divisor of guessDistance to determine point allocation for given distance
    return (
      500 *
      (Math.exp(-guessDistance / 2000000) + (guessCountry == acCountry ? 1 : 0))
    );
  };

  // Sets the round and total scores after a round takes place
  const setScores = (uCountry, aiCountry, uDist, aiDist, acCountry) => {
    console.log(
      "Setting scores: ",
      uCountry,
      aiCountry,
      uDist,
      aiDist,
      acCountry
    );
    const uRoundScore = Math.round(getRoundScore(uDist, uCountry, acCountry));
    const aRoundScore = Math.round(getRoundScore(aiDist, aiCountry, acCountry));
    setUserRoundScore(uRoundScore);
    setAIRoundScore(aRoundScore);
    setUserTotalScore(userTotalScore + uRoundScore);
    setAITotalScore(aiTotalScore + aRoundScore);
    uRoundScore >= aRoundScore
      ? setUserRoundWins(userRoundWins + 1)
      : setAIRoundWins(aiRoundWins + 1);
    // console.log("User Round Score: ", uRoundScore);
  };

  // Asynchronous function that prepares necessary info for round results
  const prepareResults = async () => {
    let aiADist = currentAIGuessDistance;
    if (!currentAIGuessDistance) {
      aiADist = await maps.geometry.spherical.computeDistanceBetween(
        currentAIGuess,
        actualLocation
      );
      setCurrentAIGuessDistance(aiADist);
    }
    const [uC, aiC, acC] = await queryLocations(
      userGuess,
      currentAIGuess,
      actualLocation
    );
    setScores(uC, aiC, userGuessDistance, aiADist, acC);
  };

  useEffect(() => {
    setMapPosition(showingResults);
    if (showingResults) {
      prepareResults();

      const next_city = getNextEuroCity();
      const new_loc = getNextEuroCoords(next_city);

      setNextCity(next_city["City"]);
      setNextLocation(new_loc);
      getGuess(new_loc);
    } else if (!currentAIGuess) {
      // console.log("Running find actual location");
      const acCity = getNextEuroCity();
      const acLocation = getNextEuroCoords(acCity);

      const nCity = getNextEuroCity();
      const nLocation = getNextEuroCoords(nCity);

      setActualCity(acCity["City"]);
      setActualLocation(acLocation);

      setNextCity(nCity["City"]);
      setNextLocation(nLocation);

      getGuess(acLocation);
    } else {
      const nl1 = nextLocation;
      setActualLocation(nextLocation);
      setActualCity(nextCity);
      // setActualLocation(nl1);
      // setCurrentAIGuess(null);
      setCurrentAIGuess(nextAIGuess);
      setCurrentAIGuessDistance(nextAIGuessDistance);

      getGuess(nl1);
      setShowingAIGuess(false);
    }
  }, [showingResults]);

  useEffect(() => {
    console.log("Maps loaded");
  }, [maps]);

  useEffect(() => {
    console.log("Next AI Guess Changed " + nextAIGuess);
    if (!currentAIGuess) {
      const na1 = nextAIGuess;
      setCurrentAIGuess(na1);
    }
  }, [nextAIGuess]);

  useEffect(() => {
    if (currentAIGuess != null)
      console.log(
        "Current AI Guess Changed " +
          currentAIGuess.lat +
          " " +
          currentAIGuess.lng
      );
  }, [currentAIGuess]);

  useEffect(() => {
    console.log("Next AI Guess Distance Changed " + nextAIGuessDistance);
    if (!currentAIGuessDistance) {
      const nai1 = nextAIGuessDistance;
      setCurrentAIGuessDistance(nai1);
    }
  }, [nextAIGuessDistance]);

  useEffect(() => {
    console.log("Current AI Guess Distance Changed " + currentAIGuessDistance);
  }, [currentAIGuessDistance]);

  const setMapPosition = (inCenter) => {
    if (inCenter) {
      setBottom(window.innerHeight / 2 - 330);
      setLeft(window.innerWidth / 2 - 500);
    } else {
      setBottom(20);
      setLeft(20);
    }
  };

  return (
    <GameContext.Provider
      value={{
        showingResults,
        setShowingResults,
        userGuess,
        setUserGuess,
        currentAIGuess,
        setCurrentAIGuess,
        actualLocation,
        setActualLocation,
        userGuessDistance,
        setUserGuessDistance,
        currentAIGuessDistance,
        setCurrentAIGuessDistance,
        nextAIGuess,
        nextAIGuessDistance,
        userGuessCountry,
        currentAIGuessCountry,
        setNextAIGuessDistance,
        setNextAIGuess,
        showingAIGuess,
        setShowingAIGuess,
        actualCountry,
        actualCity,
        round,
        setRound,
        setUserTotalScore,
        setAITotalScore,
        userTotalScore,
        setMaps,
        aiTotalScore,
        userRoundScore,
        aiRoundScore,
        userRoundWins,
        aiRoundWins,
        round,
      }}
    >
      <div className="h-screen w-screen relative overflow-hidden">
        <StreetView />
        <div
          className="z-10 p-0 flex flex-col justify-center items-center transition-all h-72 absolute"
          style={{
            bottom: `${divBottom}px`,
            left: `${divLeft}px`,
            width: showingResults ? "1000px" : "384px",
            height: showingResults ? "700px" : "288px",
          }}
        >
          <MapGroup />
        </div>
        <ScoreBar />
      </div>
    </GameContext.Provider>
  );
}

export default App;
