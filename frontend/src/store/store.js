import create from 'zustand'
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow'

import { initialEdges, initialNodes } from './nodes'

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
    })
  },
  deleteNode: (node) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== node.id),
    })
  },
  hideNodes: (nodes) => {
    set({
      nodes: get().nodes.map((n) => {
        if (nodes.includes(n)) {
          n.hidden = true
        }
        return n
      }),
    })
  },
  showNodes: (nodes) => {
    set({
      nodes: get().nodes.map((n) => {
        if (nodes.includes(n)) {
          n.hidden = false
        }
        return n
      }),
    })
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          id: get().getEdgeId(),
          type: 'floating',
        },

        get().edges
      ),
    })
  },
  selectedNode: null,
  setSelectedNode: (node) => {
    set({
      selectedNode: node,
    })
  },
  setEdges: (edges) => {
    set({
      edges: edges,
    })
  },
}))

export default useStore
