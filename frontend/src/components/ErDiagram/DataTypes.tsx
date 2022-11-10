import { Paper, Collapse, Badge, SimpleGrid } from '@mantine/core'
import { useState } from 'react'

export default function DataTypes() {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Paper
        onClick={() => setOpened(!opened)}
        shadow="xs"
        radius="lg"
        sx={{
          borderBottomLeftRadius: opened ? 0 : 'lg',
          borderBottomRightRadius: opened ? 0 : 'lg',
          marginBottom: opened ? 0 : 20,
        }}
        p="lg"
        withBorder
        bg="gray"
      >
        Data Types
      </Paper>
      <Collapse in={opened} transitionDuration={200}>
        <Paper
          shadow="xs"
          radius="lg"
          mb={20}
          sx={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          p="lg"
          withBorder
          bg="white"
        >
          <SimpleGrid cols={3} spacing={5}>
            <Badge color="red">String</Badge>
            <Badge color="red">Integer</Badge>
            <Badge color="red">Float</Badge>
            <Badge color="red">Boolean</Badge>
            <Badge color="red">UUID</Badge>
            <Badge color="red">Time</Badge>
            <Badge color="red">DateTime</Badge>
            <Badge color="red">Text</Badge>
            <Badge color="red">Binary</Badge>
          </SimpleGrid>
        </Paper>
      </Collapse>
    </>
  )
}
