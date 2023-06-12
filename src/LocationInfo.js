import React from "react";
import { useContext } from "react";
import { GameContext } from "./GameContext";

export default function LocationInfo(props) {
  const { actualCountry, actualCity } = useContext(GameContext);
  return (
    <div
      style={{ width: "200px", height: "150px" }}
      className="flex flex-col bg-white rounded-3xl items-center bg-opacity-[0.88]"
    >
      <p className="text-xl font-bold pb-2 pt-5">Location Info</p>
      <p className="p-2">Country: {actualCountry}</p>
      <p className="p-2">City: {actualCity}</p>
    </div>
  );
}
