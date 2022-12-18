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

  const handleCreateAttributeType = (type) => {
    // for each attribute node, only one attribute type can be exist
    // so if the attribute type already exist, then remove the node
    if (rightClickNode.data.type === type) {
      rightClickNode.data.type = ''
      const nodeToRemove = nodes.find(
        (n) => n.parentNode === rightClickNode.id && n.data.type === type
      )
      const index = nodes.indexOf(nodeToRemove)
      nodes.splice(index, 1)
      onNodesChange(nodes)
    }
    // if the attribute type does not exist, then create the node
    else {
      const newNode = {
        id: getId(),
        type: 'AttributeTypeNode',
        parentNode: rightClickNode.id,
        extent: 'parent',
        position: { x: 0, y: 0 },
        draggable: false,
        hidden: false,
        data: {
          label: 'Attribute Type',
          type: type,
        },
      }

      rightClickNode.data.type = type

      addNode(newNode)
    }
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

  const checkmarkForConstraint = (constraint) => {
    if (
      rightClickNode &&
      rightClickNode.type === 'AttributeNode' &&
      rightClickNode.data.constraints[constraint]
    ) {
      return '✓'
    }
    return ''
  }

  const checkmarkForType = (type) => {
    if (
      rightClickNode &&
      rightClickNode.type === 'AttributeNode' &&
      rightClickNode.data.type === type
    ) {
      return '✓'
    }
    return ''
  }

  const doesAttributeTypeExist = (type) => {
    // return true if any other attribute type node exist but not the current type
    return nodes.some(
      (n) => n.parentNode === rightClickNode.id && n.data.type === type
    )
  }

  const isAttributeTypeSelectDisabled = (type) => {
    // atleast one attribute type must exist
    if (rightClickNode) {
      const attributeTypeNodes = nodes.filter(
        (n) =>
          n.parentNode === rightClickNode.id && n.type === 'AttributeTypeNode'
      )
      if (attributeTypeNodes.length === 0) {
        return false
      }

      return rightClickNode.type === 'AttributeNode' &&
        doesAttributeTypeExist(type)
        ? false
        : true
    }
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
        NULLABLE {checkmarkForConstraint('nullable')}
      </Item>
      <Item onClick={() => handleCreateAttributeConstraint('unique')}>
        UNIQUE {checkmarkForConstraint('unique')}
      </Item>
      <Item onClick={() => handleCreateAttributeConstraint('index')}>
        INDEX {checkmarkForConstraint('index')}
      </Item>
      <Item onClick={() => handleCreateAttributeConstraint('primary_key')}>
        PRIMARY KEY {checkmarkForConstraint('primary_key')}
      </Item>
    </Submenu>
  )

  // right click on AttributeNode

  const createAttributeTypeItem = (
    <Submenu label="Attribute Type">
      <Item
        disabled={isAttributeTypeSelectDisabled('varchar')}
        onClick={() => handleCreateAttributeType('varchar')}
      >
        VARCHAR {checkmarkForType('varchar')}
      </Item>
      <Item
        disabled={isAttributeTypeSelectDisabled('integer')}
        onClick={() => handleCreateAttributeType('integer')}
      >
        INTEGER {checkmarkForType('integer')}
      </Item>
      <Item
        disabled={isAttributeTypeSelectDisabled('boolean')}
        onClick={() => handleCreateAttributeType('boolean')}
      >
        BOOLEAN {checkmarkForType('boolean')}
      </Item>
      <Item
        disabled={isAttributeTypeSelectDisabled('text')}
        onClick={() => handleCreateAttributeType('text')}
      >
        TEXT {checkmarkForType('text')}
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
        {rightClickNode &&
          rightClickNode.type === 'AttributeNode' &&
          createAttributeTypeItem}
      </Menu>
    </div>
  )
}
