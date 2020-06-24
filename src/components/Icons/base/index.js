import React from "react";

import CheckmarkCircle from "../CheckmarkCircle";
import CrossCircle from '../CrossCircle';
import Upload from '../Upload';
import UploadCloud from '../UploadCloud';
import Article from '../Article';
import Image from '../Image';

import Compass from '../Compass';
import Categories from '../Categories';

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
    case "compass":
      return <Compass {...props} />;
    case "categories":
      return <Categories {...props} />;
    default:
      return;
  }
};

export default Icon;
