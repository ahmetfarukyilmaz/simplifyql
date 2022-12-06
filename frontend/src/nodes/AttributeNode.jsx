import useStore from 'store/store'
import shallow from 'zustand/shallow'
import { Paper, TextInput } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { IconArrowAutofitDown } from '@tabler/icons'

const selector = (state) => ({
  nodes: state.nodes,
})

function AttributeNode(props) {
  const [attributeName, setAttributeName] = useInputState(props.data.name || '')
  const { nodes } = useStore(selector, shallow)

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
    setAttributeName(event.target.value)
    props.data.name = event.target.value
  }
  return (
    <Paper
      onClick={onNodeClick}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}
      shadow="xs"
      radius="lg"
      bg="gray"
    >
      <TextInput
        value={attributeName}
        onChange={onInputChange}
        placeholder="Attribute Name"
        required
        variant="unstyled"
      />
      <IconArrowAutofitDown />
      <IconArrowAutofitDown />
      <IconArrowAutofitDown />
      <IconArrowAutofitDown />
      <IconArrowAutofitDown />
      <IconArrowAutofitDown />
    </Paper>
  )
}

export default AttributeNode
