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
	<g id="XMLID_34_">
		<g>
			<g>
				<path d="M32,64C14.4,64,0,49.6,0,32S14.4,0,32,0s32,14.4,32,32S49.6,64,32,64z M32,4C16.6,4,4,16.6,4,32s12.6,28,28,28
					s28-12.6,28-28S47.4,4,32,4z"/>
			</g>
		</g>
	</g>
	<g>
		<g>
			<g>
				<rect x="19.3" y="30" transform="matrix(0.7071 0.7071 -0.7071 0.7071 32 -13.2548)" width="25.5" height="4"/>
			</g>
		</g>
		<g>
			<g>
				<rect x="30" y="19.3" transform="matrix(0.7071 0.7071 -0.7071 0.7071 32 -13.2548)" width="4" height="25.5"/>
			</g>
		</g>
	</g>
</g>
    </svg>
);

export default SVG;
