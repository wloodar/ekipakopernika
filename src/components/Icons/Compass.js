import React from "react";

const SVG = ({
  style = {},
  fill = "#333",
  width = "100%",
  className = "",
  viewBox = "0 0 64 64"
}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><desc>Made with illustrio</desc>
        <g class="base"><g fill="none" fillRule="evenodd" stroke="none">      
            <path fill="none" d="M27.312,4.688 C21.066,-1.562 10.934,-1.562 4.687,4.688 C-1.563,10.934 -1.563,21.067 4.687,27.317 C10.933,33.562 21.065,33.562 27.312,27.317 C33.562,21.066 33.562,10.938 27.312,4.688 Z M20.242,20.242 L7.516,24.484 L11.758,11.757 L24.484,7.515 L20.242,20.242 Z M10.344,21.656 L13.172,13.172 L18.828,18.828 L10.344,21.656 Z" stroke="none"></path>
        </g></g>
    </svg>
);

export default SVG;
