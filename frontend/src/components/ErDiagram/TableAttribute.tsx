import { Paper } from '@mantine/core'

export default function Table() {
  const onDragStart = (
    event: any,
    nodeType: string,
    width: number,
    height: number
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData('width', width)
    event.dataTransfer.setData('height', height)
    event.dataTransfer.effectAllowed = 'move'
  }
  return (
    <Paper
      draggable
      shadow="xs"
      radius="lg"
      p="lg"
      mb={20}
      withBorder
      bg="gray"
      onDragStart={(event: any) => onDragStart(event, 'AttributeNode', 200, 40)}
    >
      Attribute
    </Paper>
  )
}
