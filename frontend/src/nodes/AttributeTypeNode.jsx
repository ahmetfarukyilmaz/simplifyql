import { useEffect } from "react";

import { showNotification } from "@mantine/notifications";
import useStore from "store/store";
import { nodesMap } from "useNodesStateSynced";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
});
const AttributeTypeNode = (props) => {
  const { nodes } = useStore(selector, shallow);
  const node = nodes.find((n) => n.id === props.id);

  // give the node a default length of 255
  useEffect(() => {
    if (
      node &&
      node.data.length === undefined &&
      node.data.type === "varchar"
    ) {
      const newNode = {
        ...node,
        data: {
          ...node.data,
          length: 255,
        },
      };
      nodesMap.set(props.id, newNode);
    }
  }, [node, props.id]);

  const handleChange = (event) => {
    const node = nodes.find((n) => n.id === props.id);
    const attributeNode = nodes.find((n) => n.id === node.parentNode);
    const tableNode = nodes.find((n) => n.id === attributeNode.parentNode);
    if (
      tableNode.data.locked_by &&
      tableNode.data.locked_by !== localStorage.getItem("email")
    ) {
      showNotification({
        title: "Table is locked",
        message: `Table is locked by ${tableNode.data.locked_by} `,
        color: "red",
      });
      return;
    }
    const newNode = {
      ...node,
      data: {
        ...node.data,
        length: event.target.value,
      },
    };

    nodesMap.set(props.id, newNode);
  };

  const lengthSelector = () => {
    return props.data.type === "varchar" ? (
      <input
        style={{
          width: "25px",
          height: "8px",
          textAlign: "center",
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          fontSize: "8px",
        }}
        type="text"
        maxLength={3}
        value={node && node.data.length ? node.data.length : ""}
        onChange={handleChange}
      />
    ) : null;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "60px",
        height: "25px",
        borderRadius: "20px",
        backgroundColor: "#D0BFFF",
        border: "1px solid transparent",
        marginTop: "10px",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          textAlign: "center",
        }}
      >
        {node && node.data.type ? node.data.type : ""}
      </div>
      {lengthSelector()}
    </div>
  );
};

export default AttributeTypeNode;
