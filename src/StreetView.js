import React from "react";
import GoogleMapReact from "google-map-react";
import { useEffect, useContext } from "react";
import { GameContext } from "./GameContext";

var sv = null;

export default function StreetView(props) {
  const { actualLocation } = useContext(GameContext);

  useEffect(() => {
    if (sv) {
     sv.setPosition(actualLocation);
    }
  }, [actualLocation]);
  const defaultProps = {
    center: { lat: 40.44065, lng: -79.99595 },
    zoom: 10,
  };
  const handleApiLoaded = (map, maps) => {
    sv = map.getStreetView();
    sv.setOptions({
      position: actualLocation,
      visible: true,
      motionTracking: false,
      enableCloseButton: false,
      motionTrackingControl: false,
      fullScreenControl: false,
      addressControl: false,
      showRoadLabels: false,
      radius: 10000
    });
  };
  return (
    <div className="h-full w-full">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      ></GoogleMapReact>
    </div>
  );
}
