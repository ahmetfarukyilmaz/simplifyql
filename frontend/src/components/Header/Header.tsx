import { Header as MantineHeader, Group } from '@mantine/core'

export default function Header() {
  return (
    <MantineHeader height={80} p="xs">
      <Group sx={{ height: '100%' }} px={20} position="apart">
        <div>SimplifyQL</div>
        <div>Menu</div>
      </Group>
    </MantineHeader>
  )
}
