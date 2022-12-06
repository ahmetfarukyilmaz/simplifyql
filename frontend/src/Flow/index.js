import { useState, useRef, useCallback } from 'react'
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Navbar, RightClickMenu } from 'components'
import { Button } from '@mantine/core'
import { TableNode, AttributeNode } from 'nodes'
import useRightClickMenu from 'hooks/useRightClickMenu'
import useStore from 'store/store'
import shallow from 'zustand/shallow'

const nodeTypes = { TableNode: TableNode, AttributeNode: AttributeNode }

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

function Flow() {
  const menu = useRightClickMenu()
  const reactFlowWrapper = useRef(null)
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    selector,
    shallow
  )

  const onNodeClick = (event) => {
    event.preventDefault()
    const node = nodes.find((n) => n.selected === true)
    node.style = { border: '1px solid red' }
    nodes.forEach((n) => {
      if (n.id !== node.id) {
        n.style = { border: 'none' }
      }
    })
  }

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  return (
    <ReactFlowProvider>
      <RightClickMenu menu={menu} />
      <ReactFlow
        ref={reactFlowWrapper}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <Button
        sx={{ position: 'absolute', top: 100, right: 20 }}
        onClick={() => console.log(nodes)}
      >
        Log Nodes
      </Button>
      {/* <Navbar /> */}
    </ReactFlowProvider>
  )
}

export default Flow
