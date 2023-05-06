import React from "react";

import Home from '../Home';
import Users from '../Users';
import Calendar from '../Calendar';
import Block from '../Block';
import Feed1 from '../Feed1';
import Pending from '../Pending';
import Photo from '../Photo';
import Image from '../Image';
import Plus from '../Plus';
import PlusColor from '../PlusColor';
import Close from '../Close';
import Messages from '../Messages';
import MessagesCircle from '../MessageCircle';
import Paperclip from '../Paperclip';
import Download from '../Download';
import Edit1 from '../Edit1';
import Eye from '../Eye';
import EyeOff from '../EyeOff';
import Trash from '../Trash'; 
import Lock from '../Lock';
import Slack from '../Slack';
import Moon from '../Moon';
import ArrowLeft from '../ArrowLeft';
import About from '../About';

const Icon = props => {
  switch (props.name) {
    case "home":
      return <Home {...props} />;
    case "users":
      return <Users {...props} />;
    case "calendar":
      return <Calendar {...props} />;
    case "block":
      return <Block {...props} />;
    case "feed1":
      return <Feed1 {...props} />;
    case "pending":
      return <Pending {...props} />;
    case "photo":
      return <Photo {...props} />;
    case "image":
      return <Image {...props} />;
    case "plus":
      return <Plus {...props} />;
    case "close":
      return <Close {...props} />;
    case "pluscolor":
      return <PlusColor {...props} />;
    case "messages":
      return <Messages {...props} />;
    case "messagescircle":
      return <MessagesCircle {...props} />;
    case "paperclip":
      return <Paperclip {...props} />;
    case "download":
      return <Download {...props} />;
    case "edit1":
      return <Edit1 {...props} />;
    case "eye":
      return <Eye {...props} />;
    case "eyeoff":
      return <EyeOff {...props} />;
    case "trash":
      return <Trash {...props} />;
    case "lock":
      return <Lock {...props} />;
    case "slack":
      return <Slack {...props} />;
    case "moon":
      return <Moon {...props} />;
    case "arrowleft":
      return <ArrowLeft {...props} />;
    case "about":
      return <About {...props} />;
    default:
      return;
  }
};

export default Icon;
