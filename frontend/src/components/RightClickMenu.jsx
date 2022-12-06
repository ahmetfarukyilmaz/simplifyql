import { useCallback } from 'react'
import { AttributeNode } from 'nodes'
import shallow from 'zustand/shallow'

import useStore from 'store/store'

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  getId: state.getId,
})

export default function RightClickMenu({ menu }) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    getId,
  } = useStore(selector, shallow)
  const onCreateTable = () => {
    const newNode = {
      id: getId(),
      type: 'TableNode',
      position: { x: menu.x, y: menu.y },
      data: { label: 'Table' },
    }
    addNode(newNode)
  }
  const onCreateAttribute = () => {
    const selectedNode = nodes.find((n) => n.selected === true)
    const newNode = {
      id: getId(),
      type: 'AttributeNode',
      parentNode: selectedNode.id,
      extent: 'parent',
      position: { x: menu.x, y: menu.y },
      hidden: true,
      data: { label: 'Attribute' },
    }
    addNode(newNode)
  }

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          top: menu.y,
          left: menu.x,
          display: menu.visible ? 'flex' : 'none',
          flexDirection: 'column',
          zIndex: 100,
        }}
      >
        <div
          onClick={onCreateTable}
          style={{
            backgroundColor: 'red',
            cursor: 'pointer',
          }}
        >
          Create Table
        </div>
        <div
          onClick={onCreateAttribute}
          style={{
            backgroundColor: 'red',
            cursor: 'pointer',
          }}
        >
          Create Attribute
        </div>
      </div>
    </div>
  )
}
