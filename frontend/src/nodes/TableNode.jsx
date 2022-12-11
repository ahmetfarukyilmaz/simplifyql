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
const selector = (state) => ({
  nodes: state.nodes,
  hideNodes: state.hideNodes,
  showNodes: state.showNodes,
})

function TableNode(props) {
  const { nodes, hideNodes, showNodes } = useStore(selector, shallow)
  const [childNodes, setChildNodes] = useState([])
  const [tableName, setTableName] = useInputState(props.data.name || '')
  const [opened, setOpened] = useState(true)

  const handleCollapse = () => {
    setOpened(!opened)
  }

  const onNodeClick = (event) => {
    event.preventDefault()
    nodes.forEach((n) => {
      n.style = { border: 'none' }
      n.data.selected = false
    })

    const node = nodes.find((n) => n.id === props.id)
    node.style = { border: '1px solid red' }
    node.data.selected = true
  }

  const onInputChange = (event) => {
    setTableName(event.target.value)
    props.data.name = event.target.value
  }

  useEffect(() => {
    const childNodes = nodes.filter((n) => n.parentNode === props.id)
    setChildNodes(childNodes)
    const parentNode = nodes.find((n) => n.id === props.id)
    // if TableNode itself is deleted, do not update attribute positions, it will cause error
    if (parentNode) UpdateAttributeNodePositions(nodes, parentNode)
  }, [nodes, props.id])

  useEffect(() => {
    if (opened) showNodes(childNodes)
    else hideNodes(childNodes)
  }, [opened, childNodes, hideNodes, showNodes])

  return (
    <>
      <Paper
        onClick={onNodeClick}
        shadow="xs"
        p="lg"
        radius="lg"
        bg="blue"
        sx={{
          borderBottomLeftRadius: opened ? 0 : 'lg',
          borderBottomRightRadius: opened ? 0 : 'lg',
          height: 60,
          width: 500,
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
            minHeight: 100,
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
