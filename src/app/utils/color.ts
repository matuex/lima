function cie2RGB(px: number, py: number, bri: number) {
   
   /* 
   converts a XY color in the CIE color space to RGB.
   method is based on logic from the Hue API documentation, 
   converted to JavaScript.
   https://developers.meethue.com/develop/application-design-guidance/color-conversion-formulas-rgb-to-xy-and-back/ 
   */

   let x = px;
   let y = py;
   let z = 1.0 - x - y;  
   let Y = bri / 255.0;
   let X = (Y / y) * x;
   let Z = (Y / y) * z;

   let r =  X * 1.656492 - Y * 0.354851 - Z * 0.255038;
   let g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
   let b =  X * 0.051713 - Y * 0.121364 + Z * 1.011530;

   r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
   g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
   b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;

   // Convert to [0, 255] range and clamp
   r = Math.min(Math.round(r * 255), 255);
   g = Math.min(Math.round(g * 255), 255);
   b = Math.min(Math.round(b * 255), 255);

   return {
      'r' : r,
      'g' : g,
      'b' : b
   }

}

 function mired2Kelvin(mired: number) {
   // convert a 'mired' color temperature value into Kelvin
   return Math.round((1000000 / mired));
 }

 function kelvin2RGB (temp: number) {
   
   /* 
   converts a kelvin color temperature value into RGB
   source: https://github.com/mattdesl/kelvin-to-rgb
   */

   temp = temp / 100
   var red, blue, green
 
   if (temp <= 66) {
     red = 255
   } else {
     red = temp - 60
     red = 329.698727466 * Math.pow(red, -0.1332047592)
     if (red < 0) {
       red = 0
     }
     if (red > 255) {
       red = 255
     }
   }
 
   if (temp <= 66) {
     green = temp
     green = 99.4708025861 * Math.log(green) - 161.1195681661
     if (green < 0) {
       green = 0
     }
     if (green > 255) {
       green = 255
     }
   } else {
     green = temp - 60
     green = 288.1221695283 * Math.pow(green, -0.0755148492)
     if (green < 0) {
       green = 0
     }
     if (green > 255) {
       green = 255
     }
   }
 
   if (temp >= 66) {
     blue = 255
   } else {
     if (temp <= 19) {
       blue = 0
     } else {
       blue = temp - 10
       blue = 138.5177312231 * Math.log(blue) - 305.0447927307
       if (blue < 0) {
         blue = 0
       }
       if (blue > 255) {
         blue = 255
       }
     }
   }
 
   return [Math.floor(red), Math.floor(green), Math.floor(blue)]
 }

export {cie2RGB, mired2Kelvin, kelvin2RGB};