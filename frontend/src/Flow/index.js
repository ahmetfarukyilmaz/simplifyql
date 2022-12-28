import { useRef, useState } from 'react'
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
import SimpleFloatingEdge from 'edges/SimpleFloatingEdge'
import CustomConnectionLine from 'edges/CustomConnectionLine'

const nodeTypes = {
  TableNode: TableNode,
  AttributeNode: AttributeNode,
  AttributeConstraintNode: AttributeConstraintNode,
  AttributeTypeNode: AttributeTypeNode,
}
const edgeTypes = {
  floating: SimpleFloatingEdge,
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

  const connectionLineStyle = {
    strokeWidth: 3,
    stroke: 'black',
  }

  const defaultEdgeOptions = {
    style: connectionLineStyle,
  }

  const displayMenu = (e) => {
    show({
      id: 'main-menu',
      event: e,
    })
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

  const onNodeMouseEnter = (e, node) => {
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
    <ReactFlowProvider>
      <ContextMenuReact />

      <ReactFlow
        onInit={setRfInstance}
        onNodeMouseEnter={onNodeMouseEnter}
        onContextMenu={displayMenu}
        onPaneMouseEnter={() => setSelectedNode(null)}
        ref={reactFlowWrapper}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={{ hideAttribution: true }}
        connectionMode="loose"
        connectionLineStyle={connectionLineStyle}
        connectionLineComponent={CustomConnectionLine}
        defaultEdgeOptions={defaultEdgeOptions}
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
      <Button
        sx={{ position: 'absolute', top: 200, right: 20 }}
        onClick={() => {
          console.log(edges)
        }}
      >
        Log Edges
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
