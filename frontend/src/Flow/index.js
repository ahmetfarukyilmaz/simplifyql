import { useRef, useState } from "react";
import { useContextMenu } from "react-contexify";
import ReactFlow, { Background, Controls, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

import {
  Badge,
  Button,
  Input,
  LoadingOverlay,
  Modal,
  Switch,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import ContextMenuReact from "components/ContextMenuReact";
import RelationshipMenu from "components/RelationshipMenu";
import CustomConnectionLine from "edges/CustomConnectionLine";
import SimpleFloatingEdge from "edges/SimpleFloatingEdge";
import {
  AttributeConstraintNode,
  AttributeNode,
  AttributeTypeNode,
  TableNode,
} from "nodes";
import useStore from "store/store";
import useEdgesStateSynced from "useEdgesStateSynced";
import useNodesStateSynced from "useNodesStateSynced";
import request from "utils/request";
import { shallow } from "zustand/shallow";

import { markers } from "./markers";

const nodeTypes = {
  TableNode: TableNode,
  AttributeNode: AttributeNode,
  AttributeConstraintNode: AttributeConstraintNode,
  AttributeTypeNode: AttributeTypeNode,
};
const edgeTypes = {
  floating: SimpleFloatingEdge,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  onConnect: state.onConnect,
  setSelectedNode: state.setSelectedNode,
  selectedNode: state.selectedNode,
  disableEdgeAnimations: state.disableEdgeAnimations,
  autoSave: state.autoSave,
  autoSavedObjectId: state.autoSavedObjectId,
});

function Flow() {
  const reactFlowWrapper = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [diagramName, setDiagramName] = useState("");
  const [disableAnimations, setDisableAnimations] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    nodes,
    edges,
    autoSave,
    onConnect,
    selectedNode,
    setSelectedNode,
    disableEdgeAnimations,
    autoSavedObjectId,
  } = useStore(selector, shallow);

  const { show } = useContextMenu({
    id: "main-menu",
  });

  const [onNodesChangeSync] = useNodesStateSynced();
  const [onEdgesChangeSync] = useEdgesStateSynced();

  const connectionLineStyle = {
    strokeWidth: 3,
    stroke: "black",
  };

  const defaultEdgeOptions = {
    style: { stroke: "black", strokeWidth: 3 },
  };

  const displayMenu = (e) => {
    show({
      event: e,
    });
  };

  const exportData = async () => {
    setLoading(true);
    const data = {
      nodes: nodes,
      edges: edges,
      raw_data: rfInstance.toObject(),
      name: diagramName,
    };

    try {
      const response = await request.post("/sql/create-tables", data);

      // get the file from the response
      const file = new Blob([response.data], { type: "text/plain" });
      // download the file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = data.name + ".sql";
      document.body.appendChild(link);
      link.click();
      showNotification({
        title: "Success",
        message: "SQL file generated",
        color: "green",
      });
    } catch (error) {
      const errorMessage =
        error.response.data.detail ||
        error.response.data ||
        "Something went wrong";
      showNotification({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    }
    setModalOpen(false);
    setLoading(false);
  };

  const onNodeMouseEnter = (e, node) => {
    e.stopPropagation();
    setSelectedNode(node);
  };

  const displayNodeInfo = () => {
    let displayString = "";
    if (selectedNode) {
      const type = selectedNode.type.split(/(?=[A-Z])/);
      if (selectedNode.type === "AttributeTypeNode") {
        displayString = `${type.join(" ")}: ${selectedNode.data.type}`;
      } else {
        const name = selectedNode.data.name || "-";
        displayString = `${type.join(" ")}: ${name}`;
      }
    } else {
      displayString = "No node selected";
    }
    return displayString;
  };

  const handleAutoSave = async () => {
    setLoading(true);
    const data = {
      raw_data: rfInstance.toObject(),
    };
    try {
      await request.post("/sql/update-er-diagram/" + autoSavedObjectId, data);
      showNotification({
        title: "Success",
        message: "Diagram saved",
        color: "green",
      });
    } catch (error) {
      const errorMessage =
        error.response.data.detail ||
        error.response.data ||
        "Something went wrong";
      showNotification({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    }
    setLoading(false);
  };

  return (
    <ReactFlowProvider>
      <ContextMenuReact />
      <RelationshipMenu />
      <LoadingOverlay visible={loading} />

      <ReactFlow
        onInit={setRfInstance}
        onNodeMouseEnter={onNodeMouseEnter}
        onContextMenu={displayMenu}
        onPaneMouseEnter={() => setSelectedNode(null)}
        ref={reactFlowWrapper}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeSync}
        onEdgesChange={onEdgesChangeSync}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={{ hideAttribution: true }}
        connectionMode="loose"
        connectionLineStyle={connectionLineStyle}
        connectionLineComponent={CustomConnectionLine}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Background size={2} />
        <Controls />

        {markers}
      </ReactFlow>
      <Button
        color="dark"
        sx={{ position: "absolute", top: 100, right: 20, minWidth: 150 }}
        onClick={() => setModalOpen(true)}
      >
        Generate SQL
      </Button>
      {autoSave && (
        <Button
          color="dark"
          sx={{ position: "absolute", top: 150, right: 20, minWidth: 150 }}
          onClick={() => {
            handleAutoSave();
          }}
        >
          Save Diagram
        </Button>
      )}

      <Switch
        color="dark"
        labelPosition="left"
        sx={{ position: "absolute", bottom: 50, right: 20 }}
        checked={disableAnimations}
        label="Relationship Animations"
        onChange={() => {
          setDisableAnimations(!disableAnimations);
          disableEdgeAnimations(disableAnimations);
        }}
      />

      <Badge
        variant="filled"
        sx={{ position: "absolute", top: 100, left: 20 }}
        size="lg"
        color="dark"
      >
        {displayNodeInfo()}
      </Badge>
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Generate SQL"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Input
            label="Diagram Name"
            placeholder="Enter diagram name"
            required
            onChange={(e) => setDiagramName(e.target.value)}
          />

          <Button onClick={exportData}>Generate</Button>
        </div>
      </Modal>
    </ReactFlowProvider>
  );
}

export default Flow;
