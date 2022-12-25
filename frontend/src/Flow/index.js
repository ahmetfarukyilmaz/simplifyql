import { useRef, useCallback, useState } from 'react'
import ReactFlow, { Background, Controls, ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'
import { Button, Badge, Modal, Input } from '@mantine/core'
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
  const [rfInstance, setRfInstance] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [diagramName, setDiagramName] = useState('')

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedNode,
    setSelectedNode,
  } = useStore(selector, shallow)

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
      raw_data: rfInstance.toObject(),
      name: diagramName,
    }

    try {
      const response = await request.post('/sql/create-tables', data)

      // get the file from the response
      const file = new Blob([response.data], { type: 'text/plain' })
      // download the file
      const link = document.createElement('a')
      link.href = URL.createObjectURL(file)
      link.download = data.name + '.sql'
      document.body.appendChild(link)
      link.click()
      showNotification({
        title: 'Success',
        message: 'SQL file generated',
        color: 'green',
      })
    } catch (error) {
      const errorMessage =
        error.response.data.detail ||
        error.response.data ||
        'Something went wrong'
      showNotification({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    }
    setModalOpen(false)
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
        onInit={setRfInstance}
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
        onClick={() => setModalOpen(true)}
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
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Generate SQL"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Input
            label="Diagram Name"
            placeholder="Enter diagram name"
            required
            onChange={(e) => setDiagramName(e.target.value)}
          />

          <Button onClick={exportData}>Generate</Button>
        </div>
      </Modal>
    </ReactFlowProvider>
  )
}

export default Flow
