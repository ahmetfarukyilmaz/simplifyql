import { Paper, TextInput, Collapse, SimpleGrid } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import useStore from 'store/store'
import shallow from 'zustand/shallow'
import { ActionIcon } from '@mantine/core'
import { IconArrowAutofitDown } from '@tabler/icons'
import { AttributeNode } from 'nodes'
const selector = (state) => ({
  nodes: state.nodes,
  hideNodes: state.hideNodes,
})

function TableNode(props) {
  const { nodes, hideNodes } = useStore(selector, shallow)
  const [childNodes, setChildNodes] = useState([])
  const [tableName, setTableName] = useInputState(props.data.name || '')
  const [opened, setOpened] = useState(true)

  const handleCollapse = () => {
    setOpened(!opened)
    hideNodes(childNodes)
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

  // on input change, send the new value to the react flow instance
  const onInputChange = (event) => {
    setTableName(event.target.value)
    props.data.name = event.target.value
  }

  useEffect(() => {
    const childNodes = nodes.filter((n) => n.parentNode === props.id)
    setChildNodes(childNodes)
  }, [nodes])

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
              <AttributeNode
                key={node.id}
                data={node.data}
                name={node.data.name}
                id={node.id}
                hideNodes={hideNodes}
              />
            ))}
          </SimpleGrid>
        </Paper>
      </Collapse>
    </>
  )
}

export default TableNode
