import {
  ATTRIBUTE_HEIGHT,
  TABLE_HEIGHT,
  MARGIN_DIVIDER,
  ATTRIBUTE_TEXT_WIDTH,
} from 'constants'

const CalculateAttributeNodePosition = (nodes, parentNode) => {
  // if parentnode width is 500, then x = 500 / MARGIN_DIVIDER = 25
  // it shows the left margin of the child node
  const x = parentNode.width / MARGIN_DIVIDER
  // parentNode collapsed height is TABLE_HEIGTH and add 10 for margin. First child node's y is  TABLE_HEIGHT + 10
  const initialY = TABLE_HEIGHT + 10

  const childNodes = nodes.filter((n) => n.parentNode === parentNode.id)

  // Each child node's height is 45px and add 10 for margin
  const y = initialY + childNodes.length * (ATTRIBUTE_HEIGHT + 10)

  return { x, y }
}

const UpdateAttributeNodePositions = (nodes, parentNode) => {
  let y = 0
  const x = parentNode.width / MARGIN_DIVIDER

  // Loop through the remaining child nodes
  const childNodes = nodes.filter((n) => n.parentNode === parentNode.id)
  for (const childNode of childNodes) {
    if (y === 0) y = TABLE_HEIGHT + 10
    else y += ATTRIBUTE_HEIGHT + 10 // ATTRIBUTE_HEIGHT is the node heigth, 10 is the margin between child nodes
    childNode.position.y = y
    childNode.position.x = x
  }
}

const UpdateAttributeConstraintNodePositions = (nodes, parentNode) => {
  const childNodes = nodes.filter((n) => n.parentNode === parentNode.id)

  // attribute constraints positions are horizontal, so y is the same
  // attribute constraints located at the right side of the text input of the attribute node.
  let x = 0
  const y = 0
  let previousChildNodeWidth = 0
  for (const childNode of childNodes) {
    // store the previous childNode
    // if it is the first child node, then x = ATTRIBUTE_TEXT_WIDTH + 20
    // x changes based on the previous child node's width

    if (x === 0) {
      x = ATTRIBUTE_TEXT_WIDTH + 20
    } else {
      x += previousChildNodeWidth + 10
    }
    previousChildNodeWidth = generateAttributeConstraintNodeWidth(
      childNode.data.name
    )
    childNode.position.y = y
    childNode.position.x = x
  }
}

const generateAttributeConstraintNodeWidth = (attributeName) => {
  // attribute constraint node width is based on the attribute name
  switch (attributeName) {
    case 'primary_key':
      return 85
    case 'unique':
      return 54
    case 'nullable':
      return 67
    case 'index':
      return 46
    default:
      return 0
  }
}

export {
  CalculateAttributeNodePosition,
  UpdateAttributeNodePositions,
  UpdateAttributeConstraintNodePositions,
}
