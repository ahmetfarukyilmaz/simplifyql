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
          marginBottom: opened ? 0 : 10,
        }}
        p="lg"
        withBorder
        bg="gray"
      >
        Attribute Constraints
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
          <SimpleGrid cols={4}>
            <Badge color="red">PK</Badge>
            <Badge color="red">FK</Badge>
            <Badge color="red">NULL</Badge>
            <Badge color="red">UNIQUE</Badge>
          </SimpleGrid>
        </Paper>
      </Collapse>
    </>
  )
}
