import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

import { LoadingOverlay, createStyles, Text, Button } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import useStore from "store/store";
import request from "utils/request";
import shallow from "zustand/shallow";

import { NotFoundImage } from "./DiagramNotFound";

const selector = (state) => ({
  nodes: state.nodes,
  enableAutoSave: state.enableAutoSave,
  setAutoSavedObjectId: state.setAutoSavedObjectId,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  deleteAll: state.deleteAll,
});

const useStyles = createStyles((theme) => ({
  item: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    width: "100%",
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  symbol: {
    fontSize: 30,
    fontWeight: 700,
    width: 60,
  },
}));

export function ErDiagrams() {
  let navigate = useNavigate();
  const {
    setNodes,
    setEdges,
    enableAutoSave,
    setAutoSavedObjectId,
    deleteAll,
  } = useStore(selector, shallow);
  const { classes, cx } = useStyles();
  const [erDiagrams, setErDiagrams] = useState([]);
  const [state, handlers] = useListState(erDiagrams);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request("/sql/get-er-diagrams")
      .then((response) => {
        setErDiagrams(response.data);
        // set the state to the response data
        handlers.setState(response.data);
      })
      .catch((error) => {
        showNotification({
          title: "Error",
          message: error.message,
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onRestore = (id) => {
    deleteAll();
    const raw_data = state.find((item) => item.id === id).raw_data;
    const { nodes, edges } = raw_data;
    setNodes(nodes);
    setEdges(edges);
    enableAutoSave();
    setAutoSavedObjectId(id);
    navigate("/canvas");
  };

  return (
    <>
      <LoadingOverlay visible={loading} />
      {state.length !== 0 && <h2>Previously Created ER Diagrams</h2>}
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          handlers.reorder({ from: source.index, to: destination?.index || 0 })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {!loading && state.length === 0 && <NotFoundImage />}

              {state &&
                state.map((item, index) => (
                  <Draggable
                    key={item.id}
                    index={index}
                    draggableId={item.name}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={cx(classes.item, {
                          [classes.itemDragging]: snapshot.isDragging,
                        })}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div>
                          <Text>{item.name}</Text>
                          <Text color="dimmed" size="sm">
                            Tables: {item.tables.length}
                          </Text>
                        </div>
                        <Button
                          onClick={() => {
                            onRestore(item.id);
                          }}
                          sx={{ marginLeft: "auto" }}
                          color="dark"
                          radius="xl"
                        >
                          Show on Canvas
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
