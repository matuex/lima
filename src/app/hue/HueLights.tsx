"use client";

import { useState, useEffect } from "react";

export default function HueLights() {

   const [lights, setLights] = useState([])

   function normalizeLightData(data) {

      let myLights = [];
      Object.entries(data).forEach((light) => 
         myLights.push(light[1])
      )
      return myLights;
   }

   useEffect(() => {
      const fetchLightData = async () => {
         // get light data from local Hue Bridge
         const result = await fetch('http://' + process.env.NEXT_PUBLIC_HUE_IP + '/api/' + process.env.NEXT_PUBLIC_HUE_USERNAME + '/lights');
         // convert network result to JSON
         const data = await result.json()
         // normalize data for rendering
         const normalized = normalizeLightData(data)
         // save result in state
         setLights(normalized);
      };
      fetchLightData();
   }, []);

  return (
   <>
   <h2>Hue lights</h2>
   {lights ?
      <ul>
      {lights.map(light =>(
      <li key={light?.uniqueid}>
         {light?.name} : {light?.productname} ({light?.state?.on? light?.state?.bri : "off"})
      </li>
      ))}
      </ul>: <p>No lights found</p>}
   </>
  )
}
