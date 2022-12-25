import { useRef, useCallback, useState } from 'react'
import ReactFlow, { Background, Controls, ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'
import { Button, Badge } from '@mantine/core'
import {
  TableNode,
  AttributeNode,
  AttributeConstraintNode,
  AttributeTypeNode,
} from 'nodes'
import useStore from 'store/store'
import shallow from 'zustand/shallow'
import { useContextMenu } from 'react-contexify'
import ContextMenuReact from 'components/ContextMenuReact'
import request from 'utils/request'
import { showNotification } from '@mantine/notifications'

const nodeTypes = {
  TableNode: TableNode,
  AttributeNode: AttributeNode,
  AttributeConstraintNode: AttributeConstraintNode,
  AttributeTypeNode: AttributeTypeNode,
}

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setSelectedNode: state.setSelectedNode,
  selectedNode: state.selectedNode,
})

function Flow() {
  const reactFlowWrapper = useRef(null)
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedNode,
    setSelectedNode,
  } = useStore(selector, shallow)
  //const [selectedNode, setSelectedNode] = useState(null)

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

  const exportData = async () => {
    const data = {
      nodes: nodes,
      edges: edges,
    }

    try {
      const response = await request.post('/sql/create-tables', data)
      // get the file from the response
      const file = new Blob([response.data], { type: 'text/plain' })
      // download the file
      const link = document.createElement('a')
      link.href = URL.createObjectURL(file)
      link.download = 'Generated SQL.sql'
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.response.data.detail || 'Something went wrong',
        color: 'red',
      })
    }
  }

  // on node click, set the selected node
  const onNodeClick = (e, node) => {
    e.stopPropagation()
    setSelectedNode(node)
  }

  const displayNodeInfo = () => {
    let displayString = ''
    if (selectedNode) {
      const type = selectedNode.type.split(/(?=[A-Z])/)
      if (selectedNode.type === 'AttributeTypeNode') {
        displayString = `${type.join(' ')}: ${selectedNode.data.type}`
      } else {
        const name = selectedNode.data.name || '-'
        displayString = `${type.join(' ')}: ${name}`
      }
    } else {
      displayString = 'No node selected'
    }
    return displayString
  }

  return (
    <ReactFlowProvider onClick={handleClick}>
      <ContextMenuReact />

      <ReactFlow
        onClick={handleClick}
        onNodeClick={onNodeClick}
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
        onClick={exportData}
      >
        Generate SQL
      </Button>
      <Button
        sx={{ position: 'absolute', top: 150, right: 20 }}
        onClick={() => {
          console.log(nodes)
        }}
      >
        Log Nodes
      </Button>
      <Badge
        sx={{ position: 'absolute', top: 100, left: 20 }}
        size="lg"
        color="dark"
      >
        {displayNodeInfo()}
      </Badge>
    </ReactFlowProvider>
  )
}

export default Flow
