import React from "react";

const SVG = ({
  style = {},
  fill = "#444",
  width = "100%",
  className = "",
  viewBox = "0 0 64 64"
}) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        xmlnsxink="http://www.w3.org/1999/xlink"
        width={width}
        height={width} 
        viewBox={viewBox}
        enableBackground="new 0 0 64 64"
        xmlSpace="preserve"
    >
    <g>
      <g id="XMLID_31_">
        <g>
          <g>
            <path d="M32,64C14.4,64,0,49.6,0,32S14.4,0,32,0s32,14.4,32,32S49.6,64,32,64z M32,4C16.6,4,4,16.6,4,32s12.6,28,28,28
              s28-12.6,28-28S47.4,4,32,4z"/>
          </g>
        </g>
      </g>
      <g>
        <g>
          <polygon points="26,44.8 16.6,35.4 19.4,32.6 26,39.2 44.6,20.6 47.4,23.4 			"/>
        </g>
      </g>
    </g>
    </svg>
);

export default SVG;
