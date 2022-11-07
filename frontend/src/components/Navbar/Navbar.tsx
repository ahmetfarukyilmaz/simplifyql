import { Navbar as MantineNavbar } from '@mantine/core'

export default function Navbar() {
  return (
    <MantineNavbar
      p="xs"
      width={{
        // When viewport is larger than theme.breakpoints.sm, Navbar width will be 300
        sm: 300,

        // When viewport is larger than theme.breakpoints.lg, Navbar width will be 400
        lg: 400,

        // When other breakpoints do not match base width is used, defaults to 100%
        base: 100,
      }}
    >
      Application navbar
    </MantineNavbar>
  )
}
