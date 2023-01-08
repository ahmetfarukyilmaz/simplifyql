import { addEdge, applyNodeChanges, applyEdgeChanges } from "reactflow";

import { edgesMap } from "useEdgesStateSynced";
import { nodesMap } from "useNodesStateSynced";
import { v4 as uuidv4 } from "uuid";
import create from "zustand";

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create((set, get) => ({
  autoSave: false,
  disableAutoSave: () => {
    set({
      autoSave: false,
    });
  },
  enableAutoSave: () => {
    set({
      autoSave: true,
    });
  },
  autoSavedObjectId: null,
  setAutoSavedObjectId: (id) => {
    set({
      autoSavedObjectId: id,
    });
  },
  nodes: [],
  edges: [],
  id: uuidv4(),
  edgeId: uuidv4(),
  getId: () => `node-${uuidv4()}`,
  getEdgeId: () => `edge-${uuidv4()}`,
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
    nodesMap.set(node.id, node);
  },
  hideNodes: (nodes) => {
    set({
      nodes: get().nodes.map((n) => {
        if (nodes.includes(n)) {
          n.hidden = true;
          nodesMap.set(n.id, n);
        }
        return n;
      }),
    });
  },
  showNodes: (nodes) => {
    set({
      nodes: get().nodes.map((n) => {
        if (nodes.includes(n)) {
          n.hidden = false;
          nodesMap.set(n.id, n);
        }
        return n;
      }),
    });
  },
  setNodes: (nodes) => {
    // check if nodes are already in the store
    nodes.forEach((node) => {
      if (!nodesMap.has(node.id)) {
        nodesMap.set(node.id, node);
      }
    });
    set({
      nodes: nodes,
    });
  },
  // delete all nodes and edges and update the store
  deleteAll: () => {
    set({
      nodes: [],
      edges: [],
    });
    nodesMap.clear();
    edgesMap.clear();
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
    get().edges.forEach((edge) => {
      edgesMap.set(edge.id, edge);
    });
  },
  selectedNode: null,
  setSelectedNode: (node) => {
    set({
      selectedNode: node,
    });
  },
  setEdges: (edges) => {
    // check if edges are already in the store
    edges.forEach((edge) => {
      if (!edgesMap.has(edge.id)) {
        edgesMap.set(edge.id, edge);
      }
    });

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
