import { useState } from 'react'

const AttributeTypeNode = ({ data }) => {
  const [length, setLength] = useState(0)

  const handleChange = (event) => {
    setLength(event.target.value)
    data.length = event.target.value
  }

  const lengthSelector = () => {
    return data.name === 'varchar' ? (
      <input
        style={{
          width: '25px',
          height: '8px',
          textAlign: 'center',
          border: 'none',
          outline: 'none',
          backgroundColor: 'lightblue',
          fontSize: '8px',
        }}
        type="text"
        maxLength={3}
        value={length}
        onChange={handleChange}
      />
    ) : null
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60px',
        height: '25px',
        borderRadius: '20px',
        backgroundColor: 'lightblue',
        border: '1px solid transparent',
        marginTop: '10px',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          textAlign: 'center',
        }}
      >
        {data.name}
      </div>
      {lengthSelector()}
    </div>
  )
}

export default AttributeTypeNode
