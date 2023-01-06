import { useEffect, useState, useMemo } from "react";
import { Handle } from "reactflow";

import {
  Paper,
  TextInput,
  Collapse,
  SimpleGrid,
  ActionIcon,
} from "@mantine/core";
import { IconArrowAutofitDown } from "@tabler/icons";
import { TABLE_HEIGHT, TABLE_WIDTH, TABLE_CONTENT_MIN_HEIGHT } from "constants";
import { AttributeNode } from "nodes";
import useStore from "store/store";
import { nodesMap } from "useNodesStateSynced";
import { UpdateAttributeNodePositions } from "utils/calculateNodePosition";
import shallow from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  hideNodes: state.hideNodes,
  showNodes: state.showNodes,
  selectedNode: state.selectedNode,
  setNodes: state.setNodes,
});

const handleStyle = {
  width: "100%",
  height: "100%",
  background: "transparent",
  position: "absolute",
  top: 0,
  left: 0,
  transform: "none",
  border: "none",
  opacity: 0,
};

function TableNode(props) {
  const { nodes, hideNodes, showNodes, selectedNode } = useStore(
    selector,
    shallow
  );
  const [childNodes, setChildNodes] = useState([]);
  const [opened, setOpened] = useState(true);
  const node = useMemo(() => {
    return nodes.find((n) => n.id === props.id);
  }, [nodes, props.id]);

  const findChildNodesRecursive = (nodeId) => {
    const childNodes = nodes.filter((n) => n.parentNode === nodeId);
    let result = [];
    for (const element of childNodes) {
      result.push(element);
      result = result.concat(findChildNodesRecursive(element.id));
    }
    return result;
  };

  const handleCollapse = () => {
    const recursiveChildNodes = findChildNodesRecursive(props.id);

    if (opened) {
      hideNodes(recursiveChildNodes);
      setOpened(false);
      node.data.collapsed = true;
    } else {
      showNodes(recursiveChildNodes);
      setOpened(true);
      node.data.collapsed = false;
    }
  };

  const onInputChange = (event) => {
    const newNode = {
      ...node,
      data: {
        ...node.data,
        name: event.target.value,
      },
    };

    nodesMap.set(props.id, newNode);
  };

  useEffect(() => {
    const childNodes = nodes.filter((n) => n.parentNode === props.id);
    setChildNodes(childNodes);
    // if TableNode itself is deleted, do not update attribute positions, it will cause error
    if (selectedNode) UpdateAttributeNodePositions(nodes, selectedNode);
  }, [nodes, props.id, selectedNode]);

  return (
    <>
      <Handle style={handleStyle} position="top" id="a" />
      <Handle style={handleStyle} position="right" id="b" />
      <Handle style={handleStyle} position="bottom" id="c" />
      <Handle style={handleStyle} position="left" id="d" />
      <div
        style={{
          margin: "3px",
        }}
      >
        <Paper
          shadow="xs"
          p="lg"
          radius="lg"
          bg="blue"
          sx={{
            borderBottomLeftRadius: opened ? 0 : "lg",
            borderBottomRightRadius: opened ? 0 : "lg",
            height: TABLE_HEIGHT,
            width: TABLE_WIDTH,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            value={node && node.data.name ? node.data.name : ""}
            onChange={onInputChange}
            placeholder="Table Name"
            required
            variant="unstyled"
            sx={{ width: "75%" }}
          />
          <ActionIcon
            onClick={handleCollapse}
            color="blue"
            variant="filled"
            size="lg"
            style={{ position: "absolute", right: 20, top: 20 }}
          >
            <IconArrowAutofitDown color="white" />
          </ActionIcon>
        </Paper>
        <Collapse
          in={
            node && node.data.collapsed !== undefined
              ? !node.data.collapsed
              : true
          }
          transitionDuration={200}
        >
          <Paper
            shadow="xs"
            radius="lg"
            sx={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              minHeight: TABLE_CONTENT_MIN_HEIGHT,
            }}
            p="md"
            withBorder
            bg="white"
          >
            <SimpleGrid
              sx={{
                gridGap: "1rem",
                gridTemplateRows: "repeat(1, 1fr)",
              }}
              cols={1}
            >
              {childNodes.map((node) => (
                <div
                  key={node.id}
                  style={{
                    visibility: "hidden",
                  }}
                >
                  <AttributeNode
                    key={node.id}
                    data={node.data}
                    name={node.data.name}
                    id={node.id}
                    hideNodes={hideNodes}
                  />
                </div>
              ))}
            </SimpleGrid>
          </Paper>
        </Collapse>
      </div>
    </>
  );
}

export default TableNode;
