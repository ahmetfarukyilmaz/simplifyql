import { useState } from 'react'
import { Paper, TextInput } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { IconArrowAutofitDown } from '@tabler/icons'
function AttributeNode(props) {
  const [attributeName, setAttributeName] = useInputState(props.data.name || '')
  // on input change, send the new value to the react flow instance
  const onInputChange = (event) => {
    setAttributeName(event.target.value)
    props.data.name = event.target.value
  }
  return (
    <Paper
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
