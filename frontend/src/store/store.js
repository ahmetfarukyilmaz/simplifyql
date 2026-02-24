import { addEdge, applyNodeChanges, applyEdgeChanges } from "reactflow";

import { edgesMap } from "useEdgesStateSynced";
import { nodesMap } from "useNodesStateSynced";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

const useStore = create((set, get) => ({
  // Auto-save state
  autoSave: false,
  autoSavedObjectId: null,
  disableAutoSave: () => set({ autoSave: false }),
  enableAutoSave: () => set({ autoSave: true }),
  setAutoSavedObjectId: (id) => set({ autoSavedObjectId: id }),

  // Node/edge state
  nodes: [],
  edges: [],
  selectedNode: null,

  getId: () => `node-${uuidv4()}`,
  getEdgeId: () => `edge-${uuidv4()}`,

  setSelectedNode: (node) => set({ selectedNode: node }),

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
    nodesMap.set(node.id, node);
  },

  hideNodes: (nodesToHide) => {
    set({
      nodes: get().nodes.map((n) => {
        if (nodesToHide.includes(n)) {
          n.hidden = true;
          nodesMap.set(n.id, n);
        }
        return n;
      }),
    });
  },

  showNodes: (nodesToShow) => {
    set({
      nodes: get().nodes.map((n) => {
        if (nodesToShow.includes(n)) {
          n.hidden = false;
          nodesMap.set(n.id, n);
        }
        return n;
      }),
    });
  },

  setNodes: (nodes) => {
    nodes.forEach((node) => {
      if (!nodesMap.has(node.id)) {
        nodesMap.set(node.id, node);
      }
    });
    set({ nodes });
  },

  setEdges: (edges) => {
    edges.forEach((edge) => {
      if (!edgesMap.has(edge.id)) {
        edgesMap.set(edge.id, edge);
      }
    });
    set({ edges });
  },

  deleteAll: () => {
    set({ nodes: [], edges: [] });
    nodesMap.clear();
    edgesMap.clear();
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    const edges = get().edges;

    // Prevent duplicate edges
    const edgeExists = edges.find(
      (edge) =>
        (edge.source === connection.target && edge.target === connection.source) ||
        (edge.source === connection.source && edge.target === connection.target),
    );
    if (edgeExists) return;

    // Prevent self-connections
    if (connection.source === connection.target) return;

    set({
      edges: addEdge(
        {
          ...connection,
          id: get().getEdgeId(),
          type: "floating",
          markerEnd: "one",
          markerStart: "one",
          animated: true,
          data: { relationship: "one-one" },
        },
        edges,
      ),
    });
    get().edges.forEach((edge) => {
      edgesMap.set(edge.id, edge);
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
