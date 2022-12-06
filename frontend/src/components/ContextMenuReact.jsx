import { Menu, Item } from 'react-contexify'
import shallow from 'zustand/shallow'

import useStore from 'store/store'
import 'react-contexify/dist/ReactContexify.css'

const MENU_ID = 'main-menu'

const selector = (state) => ({
  addNode: state.addNode,
  getId: state.getId,
})

export default function ContextMenuReact() {
  const { addNode, getId } = useStore(selector, shallow)

  function handleCreateTable(e) {
    const x = e.event.clientX
    const y = e.event.clientY
    const newNode = {
      id: getId(),
      type: 'TableNode',
      position: { x, y },
      data: { label: 'Table' },
    }
    addNode(newNode)
  }

  return (
    <div>
      <Menu id={MENU_ID} theme="dark">
        <Item onClick={handleCreateTable}>Create Table</Item>
      </Menu>
    </div>
  )
}
