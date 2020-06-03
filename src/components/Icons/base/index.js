import React from "react";

import CheckmarkCircle from "../CheckmarkCircle";
import CrossCircle from '../CrossCircle';
import Upload from '../Upload';
import UploadCloud from '../UploadCloud';
import Article from '../Article';
import Image from '../Image';

const Icon = props => {
  switch (props.name) {
    case "checkmarkcircle":
      return <CheckmarkCircle {...props} />;
    case "crosscircle":
      return <CrossCircle {...props} />;
    case "upload":
      return <Upload {...props} />;
    case "uploadcloud":
      return <UploadCloud {...props} />;
    case "article":
      return <Article {...props} />;
    case "image":
      return <Image {...props} />;
    default:
      return;
  }
};

export default Icon;
