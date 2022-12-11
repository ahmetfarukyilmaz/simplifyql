const CalculateAttributeNodePosition = (nodes, parentNode) => {
  // if parentnode width is 500, then x = 500 / 20 = 25
  // it shows the left margin of the child node
  const x = parentNode.width / 20
  // parentNode collapsed height is 60 and add 10 for margin. First child node's y is 70
  const initialY = 70

  const childNodes = nodes.filter((n) => n.parentNode === parentNode.id)

  // Each child node's height is 45px and add 10 for margin
  const y = initialY + childNodes.length * 55

  return { x, y }
}

const UpdateAttributeNodePositions = (nodes, parentNode) => {
  let y = 0
  const x = parentNode.width / 20

  // Loop through the remaining child nodes
  const childNodes = nodes.filter((n) => n.parentNode === parentNode.id)
  for (const childNode of childNodes) {
    // Update the y position of the child node
    // if it is the first child node, then y = 70
    // if it is the second child node, then y = 70 + 55
    if (y === 0) y = 70
    else y += 55 // 45 is the node heigth, 10 is the margin between child nodes
    childNode.position.y = y
    childNode.position.x = x
  }
}

export { CalculateAttributeNodePosition, UpdateAttributeNodePositions }
