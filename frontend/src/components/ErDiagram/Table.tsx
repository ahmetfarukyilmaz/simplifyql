import { Paper } from '@mantine/core'
import { Handle, Position } from 'reactflow'
export default function Table() {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
    console.log('drag start', event)
  }
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Paper
        draggable
        onDragStart={(event: any) => onDragStart(event, 'tableNode')}
        shadow="xs"
        radius="lg"
        p="lg"
        mb={20}
        withBorder
        bg="blue.3"
      >
        Table
      </Paper>
    </>
  )
}
