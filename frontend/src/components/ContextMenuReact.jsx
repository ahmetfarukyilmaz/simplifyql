import { Menu, Item, Submenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

import useStore from "store/store";
import { nodesMap } from "useNodesStateSynced";
import shallow from "zustand/shallow";

const MENU_ID = "main-menu";

const selector = (state) => ({
  addNode: state.addNode,
  getId: state.getId,
  nodes: state.nodes,
  onNodesChange: state.onNodesChange,
  selectedNode: state.selectedNode,
});

export default function ContextMenuReact() {
  const { addNode, getId, nodes, selectedNode } = useStore(selector, shallow);

  function handleCreateTable(e) {
    const x = e.event.clientX;
    const y = e.event.clientY;
    const newNode = {
      id: getId(),
      type: "TableNode",
      position: { x, y },
      data: { label: "Table", collapsed: false },
      hidden: false,
    };
    addNode(newNode);
  }

  const handleCreateAttribute = () => {
    const newNode = {
      id: getId(),
      type: "AttributeNode",
      parentNode: selectedNode.id,
      extent: "parent",
      position: { x: 0, y: 0 },
      draggable: false,
      hidden: false,
      data: {
        label: "Attribute",
        constraints: {
          primary_key: false,
          unique: false,
          nullable: false,
          index: false,
        },
      },
    };
    addNode(newNode);
  };

  const handleCreateAttributeType = (type) => {
    // for each attribute node, only one attribute type can be exist
    // so if the attribute type already exist, then remove the node
    if (selectedNode.data.type === type) {
      selectedNode.data.type = "";

      const nodeToRemove = nodes.find(
        (n) => n.parentNode === selectedNode.id && n.data.type === type
      );

      const newNodes = nodes.filter((n) => n.id !== nodeToRemove.id);
      nodesMap.delete(nodeToRemove.id);
      // for each newNodes, update nodesMap
      newNodes.forEach((n) => {
        nodesMap.set(n.id, n);
      });
    }
    // if the attribute type does not exist, then create the node
    else {
      const newNode = {
        id: getId(),
        type: "AttributeTypeNode",
        parentNode: selectedNode.id,
        extent: "parent",
        position: { x: 0, y: 0 },
        draggable: false,
        hidden: false,
        data: {
          label: "Attribute Type",
          type: type,
        },
      };

      selectedNode.data.type = type;

      addNode(newNode);
    }
  };

  const handleCreateAttributeConstraint = (constraint) => {
    // check if attribute constraint already true in constraints object
    if (selectedNode.data.constraints[constraint]) {
      // make constraint false and remove the node
      selectedNode.data.constraints[constraint] = false;
      const nodeToRemove = nodes.find(
        (n) => n.parentNode === selectedNode.id && n.data.name === constraint
      );
      const newNodes = nodes.filter((n) => n.id !== nodeToRemove.id);
      nodesMap.delete(nodeToRemove.id);
      // for each newNodes, update nodesMap
      newNodes.forEach((n) => {
        nodesMap.set(n.id, n);
      });
    } else {
      const newNode = {
        id: getId(),
        type: "AttributeConstraintNode",
        parentNode: selectedNode.id,
        extent: "parent",
        position: { x: 0, y: 0 },
        draggable: false,
        hidden: false,
        data: {
          label: "Attribute Constraint",
          name: constraint,
        },
      };

      selectedNode.data.constraints[constraint] = true;

      addNode(newNode);
    }
  };

  const checkmarkForConstraint = (constraint) => {
    if (
      selectedNode &&
      selectedNode.type === "AttributeNode" &&
      selectedNode.data.constraints[constraint]
    ) {
      return "✓";
    }
    return "";
  };

  const checkmarkForType = (type) => {
    if (
      selectedNode &&
      selectedNode.type === "AttributeNode" &&
      selectedNode.data.type === type
    ) {
      return "✓";
    }
    return "";
  };

  const doesAttributeTypeExist = (type) => {
    // return true if any other attribute type node exist but not the current type
    return nodes.some(
      (n) => n.parentNode === selectedNode.id && n.data.type === type
    );
  };

  const isAttributeTypeSelectDisabled = (type) => {
    // atleast one attribute type must exist
    if (selectedNode) {
      const attributeTypeNodes = nodes.filter(
        (n) =>
          n.parentNode === selectedNode.id && n.type === "AttributeTypeNode"
      );
      if (attributeTypeNodes.length === 0) {
        return false;
      }

      return selectedNode.type === "AttributeNode" &&
        doesAttributeTypeExist(type)
        ? false
        : true;
    }
  };

  // right click on canvas
  const createTableItem = <Item onClick={handleCreateTable}>Create Table</Item>;

  // right click on TableNode
  const createAttributeItem = (
    <Item onClick={handleCreateAttribute}>Create Attribute</Item>
  );

  // right click on AttributeNode
  const createAttributeConstraintItem = (
    <Submenu label="Attribute Constraints">
      <Item onClick={() => handleCreateAttributeConstraint("nullable")}>
        NULLABLE {checkmarkForConstraint("nullable")}
      </Item>
      <Item onClick={() => handleCreateAttributeConstraint("unique")}>
        UNIQUE {checkmarkForConstraint("unique")}
      </Item>
      <Item onClick={() => handleCreateAttributeConstraint("index")}>
        INDEX {checkmarkForConstraint("index")}
      </Item>
      <Item onClick={() => handleCreateAttributeConstraint("primary_key")}>
        PRIMARY KEY {checkmarkForConstraint("primary_key")}
      </Item>
    </Submenu>
  );

  // right click on AttributeNode

  const createAttributeTypeItem = (
    <Submenu label="Attribute Type">
      <Item
        disabled={isAttributeTypeSelectDisabled("varchar")}
        onClick={() => handleCreateAttributeType("varchar")}
      >
        VARCHAR {checkmarkForType("varchar")}
      </Item>
      <Item
        disabled={isAttributeTypeSelectDisabled("integer")}
        onClick={() => handleCreateAttributeType("integer")}
      >
        INTEGER {checkmarkForType("integer")}
      </Item>
      <Item
        disabled={isAttributeTypeSelectDisabled("boolean")}
        onClick={() => handleCreateAttributeType("boolean")}
      >
        BOOLEAN {checkmarkForType("boolean")}
      </Item>
      <Item
        disabled={isAttributeTypeSelectDisabled("text")}
        onClick={() => handleCreateAttributeType("text")}
      >
        TEXT {checkmarkForType("text")}
      </Item>
    </Submenu>
  );

  return (
    <Menu id={MENU_ID} theme="dark">
      {!selectedNode && createTableItem}
      {selectedNode && selectedNode.type === "TableNode" && createAttributeItem}
      {selectedNode &&
        selectedNode.type === "AttributeNode" &&
        createAttributeConstraintItem}
      {selectedNode &&
        selectedNode.type === "AttributeNode" &&
        createAttributeTypeItem}
    </Menu>
  );
}
