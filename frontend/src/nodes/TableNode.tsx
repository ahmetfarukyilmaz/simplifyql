import { Paper, TextInput, Collapse, SimpleGrid } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { useState } from 'react'

function TableNode({ data }: any) {
  const [stringValue, setStringValue] = useInputState('')
  const [opened, setOpened] = useState(false)

  // on input change, send the new value to the react flow instance
  const onInputChange = (event: any) => {
    setStringValue(event.target.value)
    data.name = event.target.value
  }
  return (
    <>
      <Paper
        shadow="xs"
        p="lg"
        radius="lg"
        bg="blue"
        sx={{
          borderBottomLeftRadius: opened ? 0 : 'lg',
          borderBottomRightRadius: opened ? 0 : 'lg',
        }}
        onClick={() => setOpened(!opened)}
      >
        <TextInput
          value={stringValue}
          onChange={onInputChange}
          placeholder="Table Name"
          required
          variant="unstyled"
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        />
      </Paper>
      <Collapse in={opened} transitionDuration={200}>
        <Paper
          shadow="xs"
          radius="lg"
          sx={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          p="lg"
          withBorder
          bg="white"
        >
          <SimpleGrid cols={1}>
            <div>Test1</div>
            <div>Test2</div>
          </SimpleGrid>
        </Paper>
      </Collapse>
    </>
  )
}

export default TableNode
