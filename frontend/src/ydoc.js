import { WebrtcProvider } from "y-webrtc";
import { Doc } from "yjs";

const ydoc = new Doc();
new WebrtcProvider("yjs-demo", ydoc, {
  signaling: [
    "wss://simplifyql-m49v.vercel.app",
    "wss://demos.yjs.dev",
    "wss://simplifyql.vercel.app",
  ],
});

export default ydoc;
