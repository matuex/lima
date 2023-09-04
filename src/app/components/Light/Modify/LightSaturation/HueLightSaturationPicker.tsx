"use client";

import './huelightsaturationpicker.css'
import { useEffect, useRef, useState } from 'react';
import throttle from 'lodash.throttle';

export default function HueLightSaturationPicker(props: { light: string, currentSaturation: number, enable:boolean }) {

   // track the color picked by the user
   const [pickSaturation, setSaturation] = useState(props?.currentSaturation);

   useEffect(() => { 
      setSaturation(props?.currentSaturation)
    }, [props?.currentSaturation]);

    const updateLight = (saturation:number) => {

       // make a PUT call to the Hue API
       const bodyData = { 
         sat: saturation
      };

      fetch(process.env.NEXT_PUBLIC_HUE_API_ADDRESS + '/api/' + process.env.NEXT_PUBLIC_HUE_API_USERNAME + '/lights/' + props?.light + '/state', {
         method: 'PUT', 
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(bodyData)
      })
      .then(response => response.json())
      .then(data => {
         if (data[0]?.error) {
            /* the Hue V1 API returns a 200 code even when there is an error
            so we need to check the error object of the response to detect
            a failure */
            console.error('Error:', data[0]?.error?.description);
         }
      })
      .catch(error => {
         console.error('Error:', error);
      });

    }

    /* 
    because the onchange event of the input element fires many events,
    we throttle the amount of API requests.
    inspiration: https://stackblitz.com/edit/react-lodash-throttle?file=src%2FApp.js
    */

    const makeApiRequestThrottled = useRef(throttle(updateLight, 100));

    const handleChange = (event:any) => {
      setSaturation(parseInt(event?.target?.value))
      makeApiRequestThrottled.current(parseInt(event?.target?.value));
    };

   return (
      <div>
         S <input type="range" className="hue-light-saturation-picker" min="0" max="254" value={pickSaturation} onChange={handleChange} disabled={!props?.enable}  />
      </div>
     )
}