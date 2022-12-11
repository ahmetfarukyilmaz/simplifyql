import { useEffect, useState } from 'react'
import { Badge } from '@mantine/core'

const AttributeConstraintNode = ({ data }) => {
  const [color, setColor] = useState('red')

  const colorPicker = () => {
    switch (data.name) {
      case 'primary_key':
        setColor('red')
        break
      case 'unique':
        setColor('blue')
        break
      case 'nullable':
        setColor('green')
        break
      case 'index':
        setColor('yellow')
        break
      default:
        setColor('purple')
    }
  }

  useEffect(() => {
    colorPicker()
  }, [])

  return (
    <Badge color={color} variant="filled" size="xs">
      {data.name}
    </Badge>
  )
}

export default AttributeConstraintNode
