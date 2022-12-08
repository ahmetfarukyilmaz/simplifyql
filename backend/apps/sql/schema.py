from ninja import Schema


class NodeDataSchema(Schema):
    name: str


class NodeSchema(Schema):
    # TODO: change type to enum
    id: str
    type: str
    parentNode: str = None
    data: NodeDataSchema
