import { useState, useEffect } from 'react'
import useStore from 'store/store'
import shallow from 'zustand/shallow'
import { Paper, TextInput } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import {
  ATTRIBUTE_HEIGHT,
  ATTRIBUTE_WIDTH,
  ATTRIBUTE_TEXT_WIDTH,
} from 'constants'
import { UpdateAttributeConstraintNodePositions } from 'utils/calculateNodePosition'
const selector = (state) => ({
  nodes: state.nodes,
  showNodes: state.showNodes,
  hideNodes: state.hideNodes,
})

const paperStyles = {
  width: ATTRIBUTE_WIDTH,
  height: ATTRIBUTE_HEIGHT,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '10px',
  paddingRight: '10px',
}

function AttributeNode(props) {
  const [attributeName, setAttributeName] = useInputState(props.data.name || '')
  const [childNodes, setChildNodes] = useState([])
  const { nodes, showNodes, hideNodes } = useStore(selector, shallow)

  const onInputChange = (event) => {
    setAttributeName(event.target.value)
    props.data.name = event.target.value
  }

  useEffect(() => {
    const childNodes = nodes.filter((n) => n.parentNode === props.id)
    setChildNodes(childNodes)
    const parentNode = nodes.find((n) => n.id === props.id)
    // if node itself is deleted, do not update attribute positions, it will cause error
    if (parentNode) UpdateAttributeConstraintNodePositions(nodes, parentNode)
  }, [nodes])

  return (
    <Paper sx={paperStyles} shadow="xs" radius="lg" bg="gray">
      <TextInput
        value={attributeName}
        onChange={onInputChange}
        placeholder="Attribute Name"
        required
        variant="unstyled"
        sx={{ width: ATTRIBUTE_TEXT_WIDTH }}
      />
    </Paper>
  )
}

export default AttributeNode
