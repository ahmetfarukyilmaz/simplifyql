import { WebrtcProvider } from "y-webrtc";
import { Doc } from "yjs";

const ydoc = new Doc();
new WebrtcProvider("yjs-demo", ydoc);

export default ydoc;
