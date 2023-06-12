import React from "react";
import { useState, useEffect, useContext } from "react";
import GoogleMapReact from "google-map-react";
import { GameContext } from "./GameContext";
import GuessResults from "./GuessResults";

var userGuessMarker = null;
var guessMap = null;
var googleMaps = null;
var aiGuessMarker = null;
var actualLocationMarker = null;
var userActualLine = null;
var aiActualLine = null;
var userGuessInfoWindow = null;

var lineSymbol = {
  path: "M 0,-1 0,1",
  strokeOpacity: 1,
  scale: 4,
};

const startCoords = { lat: 48.2062, lng: 14.4941 };

export default function GuessMap(props) {
  // const {
  //   userGuess,
  //   setUserGuess,
  //   aiGuess,
  //   setAiGuess,
  //   actualLocation,
  //   setActualLocation,
  // } = useContext(GameContext);

  const {
    showingResults,
    actualLocation,
    userGuess,
    setUserGuess,
    setUserGuessDistance,
    userGuessDistance,
    currentAIGuess,
    showingAIGuess,
    setMaps,
  } = useContext(GameContext);

  useEffect(() => {
    if (showingAIGuess) {
      console.log("Showing AI Guess Changed");
      setAIGuessMarker();
    }
  }, [showingAIGuess]);
  const drawUserLine = (c1, c2) => {
    userActualLine = new googleMaps.Polyline({
      path: [c1, c2],
      geodisic: true,
      strokeOpacity: 0,
      icons: [{ icon: lineSymbol, offset: "0", repeat: "20px" }],
      map: guessMap,
    });
  };

  const drawAILine = (c1, c2) => {
    aiActualLine = new googleMaps.Polyline({
      path: [c1, c2],
      geodisic: true,
      strokeOpacity: 0,
      icons: [{ icon: lineSymbol, offset: "0", repeat: "20px" }],
      map: guessMap,
    });
  };

  const setActualMarker = () => {
    if (!actualLocationMarker) {
      // console.log(actualLocation);
      actualLocationMarker = new googleMaps.Marker({
        position: actualLocation,
        map: guessMap,
        label: { text: "A", color: "black", fontSize: "20px" },
      });
    } else {
      actualLocationMarker.setPosition(actualLocation);
      actualLocationMarker.setMap(guessMap);
    }
  };

  const setAIGuessMarker = () => {
    if (!aiGuessMarker) {
      aiGuessMarker = new googleMaps.Marker({
        position: currentAIGuess,
        map: guessMap,
        label: { text: "AI", color: "black", fontSize: "20px" },
      });
    } else {
      console.log("This is current AI Guess: " + currentAIGuess);
      aiGuessMarker.setPosition(currentAIGuess);
      aiGuessMarker.setMap(guessMap);
    }
  };

  const removeMapComponent = (component) => {
    if (component) {
      component.setMap(null);
    }
  };

  const showUserGuessInfo = () => {
    if (!userGuessInfoWindow) {
      userGuessInfoWindow = new googleMaps.InfoWindow({
        content: userGuessDistance.toString(),
      });
      userGuessInfoWindow.open(guessMap, userActualLine);
    }
  };

  useEffect(() => {
    if (showingResults) {
      drawUserLine(userGuess, actualLocation);
      drawAILine(currentAIGuess, actualLocation);
      setAIGuessMarker();
      setActualMarker();
      guessMap.setCenter(actualLocation);
      // showUserGuessInfo();
    } else {
      removeMapComponent(actualLocationMarker);
      removeMapComponent(userGuessMarker);
      removeMapComponent(aiGuessMarker);
      removeMapComponent(userActualLine);
      removeMapComponent(aiActualLine);
    }
    // console.log("Using effect");
  }, [showingResults]);

  // const [userGuessMarker, setUserGuessMarker] = useState(null);
  // console.log("Guess Map Rendered");

  const handleApiLoaded = async (map, maps) => {
    guessMap = map;
    googleMaps = maps;
    const spherical = await googleMaps.importLibrary("geometry");
    setMaps(maps);
  };

  function onMapClicked(event) {
    const uGuess = { lat: event.lat, lng: event.lng };
    setUserGuess(uGuess);
    console.log(uGuess, actualLocation);
    const uADist = googleMaps.geometry.spherical.computeDistanceBetween(
      uGuess,
      actualLocation
    );
    setUserGuessDistance(uADist);
    // console.log(uADist);
    if (userGuessMarker) {
      // console.log("Moving Guess Marker");
      userGuessMarker.setPosition({ lat: event.lat, lng: event.lng });
      userGuessMarker.setMap(guessMap);
    } else {
      userGuessMarker = new googleMaps.Marker({
        position: { lat: event.lat, lng: event.lng },
        map: guessMap,
      });
    }
  }

  return (
    <div className="h-full">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
        defaultCenter={startCoords}
        defaultZoom={2}
        onClick={onMapClicked}
        yesIWantToUseGoogleMapApiInternals={true}
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      ></GoogleMapReact>
    </div>
  );
}
