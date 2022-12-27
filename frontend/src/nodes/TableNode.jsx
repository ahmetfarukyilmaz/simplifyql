import {
  Paper,
  TextInput,
  Collapse,
  SimpleGrid,
  ActionIcon,
} from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import useStore from 'store/store'
import shallow from 'zustand/shallow'
import { IconArrowAutofitDown } from '@tabler/icons'
import { AttributeNode } from 'nodes'
import { UpdateAttributeNodePositions } from 'utils/calculateNodePosition'
import { Handle } from 'reactflow'
import { TABLE_HEIGHT, TABLE_WIDTH, TABLE_CONTENT_MIN_HEIGHT } from 'constants'
const selector = (state) => ({
  nodes: state.nodes,
  hideNodes: state.hideNodes,
  showNodes: state.showNodes,
  selectedNode: state.selectedNode,
})

function TableNode(props) {
  const { nodes, hideNodes, showNodes, selectedNode } = useStore(
    selector,
    shallow
  )
  const [childNodes, setChildNodes] = useState([])
  const [tableName, setTableName] = useInputState(props.data.name || '')
  const [opened, setOpened] = useState(true)

  const findChildNodesRecursive = (nodeId) => {
    const childNodes = nodes.filter((n) => n.parentNode === nodeId)
    let result = []
    for (const element of childNodes) {
      result.push(element)
      result = result.concat(findChildNodesRecursive(element.id))
    }
    return result
  }

  const handleCollapse = () => {
    const recursiveChildNodes = findChildNodesRecursive(props.id)

    if (opened) {
      hideNodes(recursiveChildNodes)
      setOpened(false)
    } else {
      showNodes(recursiveChildNodes)
      setOpened(true)
    }
  }

  const onInputChange = (event) => {
    setTableName(event.target.value)
    props.data.name = event.target.value
  }

  useEffect(() => {
    const childNodes = nodes.filter((n) => n.parentNode === props.id)
    setChildNodes(childNodes)
    // if TableNode itself is deleted, do not update attribute positions, it will cause error
    if (selectedNode) UpdateAttributeNodePositions(nodes, selectedNode)
  }, [nodes, props.id, selectedNode])

  return (
    <>
      <Handle position="top" id="a" />
      <Handle position="right" id="b" />
      <Handle position="bottom" id="c" />
      <Handle position="left" id="d" />
      <Paper
        shadow="xs"
        p="lg"
        radius="lg"
        bg="blue"
        sx={{
          borderBottomLeftRadius: opened ? 0 : 'lg',
          borderBottomRightRadius: opened ? 0 : 'lg',
          height: TABLE_HEIGHT,
          width: TABLE_WIDTH,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TextInput
          value={tableName}
          onChange={onInputChange}
          placeholder="Table Name"
          required
          variant="unstyled"
          sx={{ width: '75%' }}
        />
        <ActionIcon
          onClick={handleCollapse}
          color="blue"
          variant="filled"
          size="lg"
          style={{ position: 'absolute', right: 10, top: 10 }}
        >
          <IconArrowAutofitDown color="white" />
        </ActionIcon>
      </Paper>
      <Collapse in={opened} transitionDuration={200}>
        <Paper
          shadow="xs"
          radius="lg"
          sx={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            minHeight: TABLE_CONTENT_MIN_HEIGHT,
          }}
          p="lg"
          withBorder
          bg="white"
        >
          <SimpleGrid
            sx={{
              gridGap: '1rem',
              gridTemplateRows: 'repeat(1, 1fr)',
            }}
            cols={1}
          >
            {childNodes.map((node) => (
              <div
                key={node.id}
                style={{
                  visibility: 'hidden',
                }}
              >
                <AttributeNode
                  key={node.id}
                  data={node.data}
                  name={node.data.name}
                  id={node.id}
                  hideNodes={hideNodes}
                />
              </div>
            ))}
          </SimpleGrid>
        </Paper>
      </Collapse>
    </>
  )
}

export default TableNode
