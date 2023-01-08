import { useEffect, useMemo } from "react";

import { Paper, TextInput } from "@mantine/core";
import {
  ATTRIBUTE_HEIGHT,
  ATTRIBUTE_WIDTH,
  ATTRIBUTE_TEXT_WIDTH,
} from "constants";
import useStore from "store/store";
import { nodesMap } from "useNodesStateSynced";
import { UpdateAttributeConstraintNodePositions } from "utils/calculateNodePosition";
import shallow from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
});

const paperStyles = {
  width: ATTRIBUTE_WIDTH,
  height: ATTRIBUTE_HEIGHT,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: "10px",
  paddingRight: "10px",
  backgroundColor: "#f5f5f5",
};

function AttributeNode(props) {
  const { nodes } = useStore(selector, shallow);

  const node = useMemo(() => {
    return nodes.find((n) => n.id === props.id);
  }, [nodes, props.id]);

  const onInputChange = (event) => {
    const newNode = {
      ...node,
      data: { ...node.data, name: event.target.value },
    };
    nodesMap.set(props.id, newNode);
  };

  useEffect(() => {
    const parentNode = nodes.find((n) => n.id === props.id);
    // if node itself is deleted, do not update attribute positions, it will cause error
    if (parentNode) UpdateAttributeConstraintNodePositions(nodes, parentNode);
  }, [nodes]);

  return (
    <Paper sx={paperStyles} shadow="xs" radius="lg" withBorder>
      <TextInput
        value={node && node.data.name ? node.data.name : ""}
        onChange={onInputChange}
        placeholder="Attribute Name"
        required
        variant="unstyled"
        sx={{ width: ATTRIBUTE_TEXT_WIDTH }}
      />
    </Paper>
  );
}

export default AttributeNode;
