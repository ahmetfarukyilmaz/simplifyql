import { Badge } from "@mantine/core";
import { ATTRIBUTE_CONSTRAINT_HEIGHT } from "constants";

const CONSTRAINT_COLORS = {
  primary_key: "red",
  unique: "blue",
  nullable: "green",
  index: "yellow",
};

const AttributeConstraintNode = ({ data }) => (
  <Badge
    sx={{
      marginTop: "10px",
      marginBottom: "10px",
      height: ATTRIBUTE_CONSTRAINT_HEIGHT,
    }}
    color={CONSTRAINT_COLORS[data.name] || "purple"}
    variant="filled"
    size="xs"
  >
    {data.name}
  </Badge>
);

export default AttributeConstraintNode;
