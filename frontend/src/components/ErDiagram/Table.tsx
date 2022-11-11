import { Paper } from '@mantine/core'
export default function Table() {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
  return (
    <Paper
      draggable
      onDragStart={(event: any) => onDragStart(event, 'TableNode')}
      shadow="xs"
      radius="lg"
      p="lg"
      mb={20}
      withBorder
      bg="blue"
    >
      Table
    </Paper>
  )
}
