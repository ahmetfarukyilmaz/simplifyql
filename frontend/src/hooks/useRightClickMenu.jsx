import { useState, useEffect } from 'react'

export default function useRightClickMenu() {
  const [menu, setMenu] = useState({
    x: 0,
    y: 0,
    visible: false,
  })

  const handleContextMenu = (event) => {
    event.preventDefault()
    setMenu({
      x: event.pageX,
      y: event.pageY,
      visible: true,
    })
  }

  const handleClick = () => {
    // set menu to invisible
    setMenu({
      x: 0,
      y: 0,
      visible: false,
    })
  }

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return menu
}
