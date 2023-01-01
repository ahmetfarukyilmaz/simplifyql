import { useCallback } from "react";
import { useContextMenu } from "react-contexify";
import { useStore, getBezierPath } from "reactflow";

import { Button } from "@mantine/core";

import { getEdgeParams } from "./utils.js";

const buttonHeight = 25;
const buttonWidth = 150;

function SimpleFloatingEdge({
  id,
  source,
  target,
  markerEnd,
  markerStart,
  style,
}) {
  const { show } = useContextMenu({
    id: "relationship-menu",
  });

  const onEdgeClick = (e) => {
    show({
      event: e,
    });
  };

  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={5}
        markerEnd={markerEnd}
        markerStart={markerStart}
        style={style}
      />
      <foreignObject
        width={buttonWidth}
        height={buttonHeight}
        x={labelX - buttonWidth / 2}
        y={labelY - buttonHeight / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <Button
            onClick={onEdgeClick}
            color="dark"
            radius="xl"
            size="xs"
            compact
          >
            Change Relationsip
          </Button>
        </div>
      </foreignObject>
    </>
  );
}

export default SimpleFloatingEdge;
