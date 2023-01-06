import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  onNodesDelete,
} from "reactflow";

import { edgesMap } from "useEdgesStateSynced";
import { nodesMap } from "useNodesStateSynced";
import create from "zustand";

import { initialEdges, initialNodes } from "./nodes";

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  id: 1,
  edgeId: 1,
  getId: () => `node-${get().id++}`,
  getEdgeId: () => `edge-${get().edgeId++}`,
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
    nodesMap.set(node.id, node);
  },
  deleteNode: (node) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== node.id),
    });
    nodesMap.set(node.id, node);
  },
  hideNodes: (nodes) => {
    set({
      nodes: get().nodes.map((n) => {
        if (nodes.includes(n)) {
          n.hidden = true;
        }
        return n;
      }),
    });
    nodes.forEach((node) => {
      nodesMap.set(node.id, node);
    });
  },
  showNodes: (nodes) => {
    set({
      nodes: get().nodes.map((n) => {
        if (nodes.includes(n)) {
          n.hidden = false;
        }
        return n;
      }),
    });
    nodes.forEach((node) => {
      nodesMap.set(node.id, node);
    });
  },
  setNodes: (nodes) => {
    set({
      nodes: nodes,
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    // if there is already an edge between the two nodes, don't create a new one
    if (
      get().edges.find(
        (edge) =>
          (edge.source === connection.target &&
            edge.target === connection.source) ||
          (edge.source === connection.source &&
            edge.target === connection.target)
      )
    ) {
      return;
    }

    // dont create an edge if the source and target are the same
    if (connection.source === connection.target) {
      return;
    }

    set({
      edges: addEdge(
        {
          ...connection,
          id: get().getEdgeId(),
          type: "floating",
          markerEnd: "one",
          markerStart: "one",
          animated: true,
          data: {
            relationship: "one-one",
          },
        },

        get().edges
      ),
    });
  },
  selectedNode: null,
  setSelectedNode: (node) => {
    set({
      selectedNode: node,
    });
  },
  setEdges: (edges) => {
    set({
      edges: edges,
    });
  },

  disableEdgeAnimations: (value) => {
    set({
      edges: get().edges.map((edge) => {
        edge.animated = !value;
        return edge;
      }),
    });
  },
}));

export default useStore;
