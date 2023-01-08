import { useCallback, useEffect } from "react";
import {
  Edge,
  applyEdgeChanges,
  OnEdgesChange,
  EdgeChange,
  EdgeAddChange,
  EdgeResetChange,
  EdgeRemoveChange,
} from "reactflow";

import useStore from "store/store";
import shallow from "zustand/shallow";

import ydoc from "./ydoc";

const selector = (state) => ({
  edges: state.edges,
  setEdges: state.setEdges,
  onNodesChange: state.onNodesChange,
});

// Please see the comments in useNodesStateSynced.ts.
// This is the same thing but for edges.
export const edgesMap = ydoc.getMap<Edge>("edges");

const isEdgeAddChange = (change: EdgeChange): change is EdgeAddChange =>
  change.type === "add";
const isEdgeResetChange = (change: EdgeChange): change is EdgeResetChange =>
  change.type === "reset";
const isEdgeRemoveChange = (change: EdgeChange): change is EdgeRemoveChange =>
  change.type === "remove";

function useEdgesStateSynced(): [OnEdgesChange] {
  const { setEdges } = useStore(selector, shallow);

  const onEdgesChange = useCallback((changes) => {
    const currentEdges = Array.from(edgesMap.values()).filter((e) => e);
    const nextEdges = applyEdgeChanges(changes, currentEdges);
    changes.forEach((change: EdgeChange) => {
      if (isEdgeRemoveChange(change)) {
        edgesMap.delete(change.id);
      } else if (!isEdgeAddChange(change) && !isEdgeResetChange(change)) {
        edgesMap.set(
          change.id,
          nextEdges.find((n) => n.id === change.id) as Edge
        );
      }
    });
  }, []);

  useEffect(() => {
    const observer = () => {
      setEdges(Array.from(edgesMap.values()));
    };

    setEdges(Array.from(edgesMap.values()));
    edgesMap.observe(observer);

    return () => edgesMap.unobserve(observer);
  }, [setEdges]);

  return [onEdgesChange];
}

export default useEdgesStateSynced;
