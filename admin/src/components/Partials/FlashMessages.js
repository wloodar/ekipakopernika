import Noty from 'noty';
import "../../../node_modules/noty/lib/noty.css";  
import "../../../node_modules/noty/lib/themes/mint.css"; 

const showMessage = (props) => {
    return new Noty({ text: props.text, theme: 'mint', type: props.type, timeout: 3000, layout: "bottomRight"}).show();
}

export default showMessage;