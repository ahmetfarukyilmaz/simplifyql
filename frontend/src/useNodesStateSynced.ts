import { useCallback, useEffect, useState } from "react";
import {
  applyNodeChanges,
  getConnectedEdges,
  Node,
  NodeAddChange,
  NodeChange,
  NodeResetChange,
  OnNodesChange,
} from "reactflow";
import ydoc from "./ydoc";
import { edgesMap } from "./useEdgesStateSynced";
import shallow from "zustand/shallow";
import useStore from "store/store";
const selector = (state) => ({
  nodes: state.nodes,
  setNodes: state.setNodes,
  onNodesChange: state.onNodesChange,
});
// We are using nodesMap as the one source of truth for the nodes.
// This means that we are doing all changes to the nodes in the map object.
// Whenever the map changes, we update the nodes state.
export const nodesMap = ydoc.getMap<Node>("nodes");

const isNodeAddChange = (change: NodeChange): change is NodeAddChange =>
  change.type === "add";
const isNodeResetChange = (change: NodeChange): change is NodeResetChange =>
  change.type === "reset";

function useNodesStateSynced(): [Node[], OnNodesChange] {
  const { nodes, setNodes } = useStore(selector, shallow);

  // The onNodesChange callback updates nodesMap.
  // When the changes are applied to the map, the observer will be triggered and updates the nodes state.
  const onNodesChanges = useCallback((changes) => {
    const nodes = Array.from(nodesMap.values());

    const nextNodes = applyNodeChanges(changes, nodes);
    changes.forEach((change: NodeChange) => {
      if (!isNodeAddChange(change) && !isNodeResetChange(change)) {
        const node = nextNodes.find((n) => n.id === change.id);
        if (node && change.type !== "remove") {
          nodesMap.set(change.id, node);
        } else if (change.type === "remove") {
          nodesMap.delete(change.id);
          // when a node is removed, we also need to remove the connected edges
          const edges = Array.from(edgesMap.values()).map((e) => e);
          const connectedEdges = getConnectedEdges(nodes, edges);
          connectedEdges.forEach((edge) => edgesMap.delete(edge.id));
        }
      }
    });
  }, []);

  // here we are observing the nodesMap and updating the nodes state whenever the map changes.
  useEffect(() => {
    const observer = () => {
      setNodes(Array.from(nodesMap.values()));
    };

    setNodes(Array.from(nodesMap.values()));
    nodesMap.observe(observer);

    return () => nodesMap.unobserve(observer);
  }, [setNodes]);
  // console log nodes every second

  return [nodes.filter((n) => n), onNodesChanges];
}

export default useNodesStateSynced;
