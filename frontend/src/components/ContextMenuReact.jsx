import { useEffect, useState } from 'react'
import { Menu, Item, Submenu } from 'react-contexify'
import shallow from 'zustand/shallow'
import useStore from 'store/store'
import 'react-contexify/dist/ReactContexify.css'

const MENU_ID = 'main-menu'

const selector = (state) => ({
  addNode: state.addNode,
  getId: state.getId,
  nodes: state.nodes,
  onNodesChange: state.onNodesChange,
})

export default function ContextMenuReact() {
  const { addNode, getId, nodes, onNodesChange } = useStore(selector, shallow)
  const [rightClickNode, setRightClickNode] = useState(null)

  function handleCreateTable(e) {
    const x = e.event.clientX
    const y = e.event.clientY
    const newNode = {
      id: getId(),
      type: 'TableNode',
      position: { x, y },
      data: { label: 'Table' },
      hidden: false,
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
      hidden: false,
      data: {
        label: 'Attribute',
        constraints: {
          primary_key: false,
          unique: false,
          nullable: false,
          index: false,
        },
      },
    }
    addNode(newNode)
  }

  const handleCreateAttributeConstraint = (constraint) => {
    // check if attribute constraint already true in constraints object
    if (rightClickNode.data.constraints[constraint]) {
      // make constraint false and remove the node
      rightClickNode.data.constraints[constraint] = false
      const nodeToRemove = nodes.find(
        (n) => n.parentNode === rightClickNode.id && n.data.name === constraint
      )
      const index = nodes.indexOf(nodeToRemove)
      nodes.splice(index, 1)
      onNodesChange(nodes)
    } else {
      const newNode = {
        id: getId(),
        type: 'AttributeConstraintNode',
        parentNode: rightClickNode.id,
        extent: 'parent',
        position: { x: 0, y: 0 },
        draggable: false,
        hidden: false,
        data: {
          label: 'Attribute Constraint',
          name: constraint,
        },
      }

      rightClickNode.data.constraints[constraint] = true

      addNode(newNode)
    }
  }

  const checkmark = (constraint) => {
    if (
      rightClickNode &&
      rightClickNode.type === 'AttributeNode' &&
      rightClickNode.data.constraints[constraint]
    ) {
      return '✓'
    }
    return ''
  }

  useEffect(() => {
    // change selected node
    const selectedNode = nodes.find((n) => n.selected)
    setRightClickNode(selectedNode)
  }, [nodes])

  // right click on canvas
  const createTableItem = <Item onClick={handleCreateTable}>Create Table</Item>

  // right click on TableNode
  const createAttributeItem = (
    <Item onClick={handleCreateAttribute}>Create Attribute</Item>
  )

  // right click on AttributeNode
  const createAttributeConstraintItem = (
    <Submenu label="Attribute Constraints">
      <Item onClick={() => handleCreateAttributeConstraint('nullable')}>
        NULLABLE {checkmark('nullable')}
      </Item>
      <Item onClick={() => handleCreateAttributeConstraint('unique')}>
        UNIQUE {checkmark('unique')}
      </Item>
      <Item onClick={() => handleCreateAttributeConstraint('index')}>
        INDEX {checkmark('index')}
      </Item>
      <Item onClick={() => handleCreateAttributeConstraint('primary_key')}>
        PRIMARY KEY {checkmark('primary_key')}
      </Item>
    </Submenu>
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
