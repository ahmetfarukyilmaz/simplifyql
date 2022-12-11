import { useEffect, useState } from 'react'
import { Menu, Item } from 'react-contexify'
import shallow from 'zustand/shallow'
import useStore from 'store/store'
import 'react-contexify/dist/ReactContexify.css'

const MENU_ID = 'main-menu'

const selector = (state) => ({
  addNode: state.addNode,
  getId: state.getId,
  nodes: state.nodes,
})

export default function ContextMenuReact() {
  const { addNode, getId, nodes } = useStore(selector, shallow)
  const [rightClickNode, setRightClickNode] = useState(null)

  function handleCreateTable(e) {
    const x = e.event.clientX
    const y = e.event.clientY
    const newNode = {
      id: getId(),
      type: 'TableNode',
      position: { x, y },
      data: { label: 'Table' },
    }
    addNode(newNode)
  }

  const handleCreateAttribute = () => {
    const newNode = {
      id: getId(),
      type: 'AttributeNode',
      parentNode: rightClickNode.id,
      extent: 'parent',
      position: { x: 0, y: 0 },
      draggable: false,
      data: { label: 'Attribute' },
    }
    addNode(newNode)
  }

  const handleCreateAttributeConstraint = () => {
    const selectedNode = nodes.find((n) => n.data.selected === true)
    const newNode = {
      id: getId(),
      type: 'AttributeConstraintNode',
      parentNode: selectedNode.id,
      extent: 'parent',
      position: { x: 0, y: 0 },
      hidden: true,
      draggable: false,
      data: { label: 'Attribute Constraint' },
    }
    addNode(newNode)
  }

  useEffect(() => {
    // change selected node
    const selectedNode = nodes.find((n) => n.data.selected === true)
    setRightClickNode(selectedNode)
  }, [nodes])

  const createTableItem = <Item onClick={handleCreateTable}>Create Table</Item>
  const createAttributeItem = (
    <Item onClick={handleCreateAttribute}>Create Attribute</Item>
  )
  const createAttributeConstraintItem = (
    <Item onClick={handleCreateAttributeConstraint}>
      Create Attribute Constraint
    </Item>
  )

  return (
    <div>
      <Menu id={MENU_ID} theme="dark">
        {!rightClickNode && createTableItem}
        {rightClickNode &&
          rightClickNode.type === 'TableNode' &&
          createAttributeItem}
        {rightClickNode &&
          rightClickNode.type === 'AttributeNode' &&
          createAttributeConstraintItem}
      </Menu>
    </div>
  )
}
