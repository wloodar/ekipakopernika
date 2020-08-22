import React from "react";

const SVG = ({
  style = {},
  fill = "#000",
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
        <g>
            <g>
                <path d="M52,26c0-0.2,0-0.4,0-0.5C52,16.4,44.6,9,35.5,9c-5.9,0-11.3,3.2-14.2,8.2c-0.6-0.1-1.2-0.2-1.8-0.2
                    C14,17,9.5,21.2,9,26.6C3.7,28.3,0,33.3,0,39c0,7.2,5.8,13,13,13h14h0V38.2h-5l10-10.6l10,10.6h-5V52h14c7.2,0,13-5.8,13-13
                    C64,32.2,58.7,26.5,52,26z"/>
            </g>
        </g>
    </g>
    </svg>
);

export default SVG;
