import { Menu, Item } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

import useStore from "store/store";
import shallow from "zustand/shallow";

const MENU_ID = "relationship-menu";

const selector = (state) => ({
  edges: state.edges,
  setEdges: state.setEdges,
});

export default function RelationshipMenu(props) {
  const { edges, setEdges } = useStore(selector, shallow);

  const handleRelationship = (markerStart, markerEnd) => {
    // get the edge with selected
    const edge = edges.find((edge) => edge.selected);
    // update markerStart and markerEnd if they are not null
    if (markerStart) edge.markerStart = markerStart;
    if (markerEnd) edge.markerEnd = markerEnd;
    setEdges([...edges]);
  };

  return (
    <Menu id={MENU_ID} theme="dark">
      <Item onClick={() => handleRelationship("one", "one")}>One To One</Item>
      <Item onClick={() => handleRelationship("one", "target-many")}>
        One To Many
      </Item>
      <Item onClick={() => handleRelationship("source-many", "target-many")}>
        Many To Many
      </Item>
    </Menu>
  );
}
