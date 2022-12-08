import { useRef, useCallback } from 'react'
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@mantine/core'
import { TableNode, AttributeNode } from 'nodes'
import useStore from 'store/store'
import shallow from 'zustand/shallow'
import { useContextMenu } from 'react-contexify'
import ContextMenuReact from 'components/ContextMenuReact'
const nodeTypes = { TableNode: TableNode, AttributeNode: AttributeNode }

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

function Flow() {
  const reactFlowWrapper = useRef(null)
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    selector,
    shallow
  )

  const { show } = useContextMenu({
    id: 'menu-id',
  })

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  function displayMenu(e) {
    show({
      id: 'main-menu',
      event: e,
    })
  }

  const handleClick = (e) => {
    if (e.target.className === 'react-flow__pane') {
      const newNodes = nodes.map((node) => {
        node.data.selected = false
        node.style = { border: 'none' }

        return node
      })
      onNodesChange(newNodes)
    }
  }

  return (
    <ReactFlowProvider onClick={handleClick}>
      <ContextMenuReact />

      <ReactFlow
        onClick={handleClick}
        onContextMenu={displayMenu}
        ref={reactFlowWrapper}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
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
