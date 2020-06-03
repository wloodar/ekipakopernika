import React from "react";

const SVG = ({
  style = {},
  fill = "#333",
  width = "100%",
  className = "",
  viewBox = "0 0 64 64"
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70"><desc>Made with illustrio</desc>
  
  <g class="base"><g stroke="none" fill={fill}>
      
      <path d="M28,2 C28,0.895 27.105,0 26,0 L2,0 C0.896,0 0,0.895 0,2 L0,30 C0,31.105 0.896,32 2,32 L26,32 C27.105,32 28,31.105 28,30 L28,2 Z M6,6 L12,6 L12,14 L6,14 L6,6 Z M22,26 L6,26 L6,24 L22,24 L22,26 Z M22,20 L6,20 L6,18 L22,18 L22,20 Z M22,14 L16,14 L16,12 L22,12 L22,14 Z M22,8 L16,8 L16,6 L22,6 L22,8 Z" transform="translate(21 19)" stroke="none"></path>
    </g></g></svg>
);

export default SVG;
