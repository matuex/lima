"use client";

import { useState, useEffect } from "react";
import { useInterval} from '../hooks/useInterval'
import HueLight from "./HueLight";

export default function HueLights() {

   /* this component polls the Hue Bridge V1 API for 'lights' information
   and then renders 'light' child components to visualize them */

   const [lights, setLights] = useState(null)
   /* interval at which to make poll request to the API in milliseconds
   Do not go below 100 as this may overload the Hue Bridge */
   const pollingInterval = 1000;

   function normalizeLightData(data: any) {
      let myLights: unknown[] = [];
      Object.entries(data).forEach((light) => {
         myLights.push(light[1])
      }
      )
      return myLights;
   }

   useInterval(() => {
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
    }, pollingInterval);

  return (
   <>
   {lights ? <div>{lights.map(light =>( <HueLight light={light} key={light?.uniqueid} />))}</div>: <p>Loading...</p>}
   </>
  )
}
