import { useEffect, useState } from "react";

import { Badge } from "@mantine/core";
import { ATTRIBUTE_CONSTRAINT_HEIGHT } from "constants";

const AttributeConstraintNode = ({ data }) => {
  const [color, setColor] = useState("red");

  const colorPicker = () => {
    switch (data.name) {
      case "primary_key":
        setColor("red");
        break;
      case "unique":
        setColor("blue");
        break;
      case "nullable":
        setColor("green");
        break;
      case "index":
        setColor("yellow");
        break;
      default:
        setColor("purple");
    }
  };

  useEffect(() => {
    colorPicker();
  }, []);

  return (
    <Badge
      sx={{
        marginTop: "10px",
        marginBottom: "10px",
        height: ATTRIBUTE_CONSTRAINT_HEIGHT,
      }}
      color={color}
      variant="filled"
      size="xs"
    >
      {data.name}
    </Badge>
  );
};

export default AttributeConstraintNode;
