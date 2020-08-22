import React from "react";

const SVG = ({
  style = {},
  fill = "#333",
  width = "100%",
  className = "",
  viewBox = "0 0 64 64"
}) => (
<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70"><desc>Made with illustrio</desc>
  
  <g className="base"><g fillRule="evenodd" stroke="none" fill={fill}>
      
      <path d="M26.775,23.8 L26.775,2.975 C26.775,1.33875 25.43625,0 23.8,0 L2.975,0 C1.33875,0 0,1.33875 0,2.975 L0,23.8 C0,25.43625 1.33875,26.775 2.975,26.775 L23.8,26.775 C25.43625,26.775 26.775,25.43625 26.775,23.8 L26.775,23.8 Z M8.18125,15.61875 L11.9,20.08125 L17.10625,13.3875 L23.8,22.3125 L2.975,22.3125 L8.18125,15.61875 L8.18125,15.61875 Z" transform="translate(21.583 21.583)" stroke="none"></path>
    </g></g></svg>
);

export default SVG;
