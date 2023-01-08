import { WebrtcProvider } from "y-webrtc";
import { Doc } from "yjs";

const ydoc = new Doc();
const provider = new WebrtcProvider("yjs-demo", ydoc);

export const awareness = provider.awareness;

awareness.setLocalState({ name: "John Doe", email: "johndoe@gmail.com" });

export default ydoc;
