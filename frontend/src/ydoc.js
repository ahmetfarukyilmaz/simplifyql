import { WebrtcProvider } from "y-webrtc";
import { Doc } from "yjs";

const ydoc = new Doc();
new WebrtcProvider("yjs-demo", ydoc, {
  signalling: ["wss://simplifyql-m49v.vercel.app"],
});

export default ydoc;
