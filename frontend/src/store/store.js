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

import initialNodes from './nodes'
//import initialEdges from './edges'

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create((set, get) => ({
  nodes: initialNodes,
  id: 3,
  getId: () => `node-${get().id++}`,
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
      edges: addEdge(connection, get().edges),
    })
  },
}))

export default useStore
