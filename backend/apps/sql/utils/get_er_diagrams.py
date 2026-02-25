from sql.models import ErDiagram


def get_er_diagrams_helper(user):
    er_diagrams = ErDiagram.objects.filter(user=user)
    return [
        {
            "id": diagram.id,
            "name": diagram.name,
            "created_at": diagram.created_at,
            "tables": [
                {"id": node["id"], "name": node["data"]["name"]}
                for node in diagram.data.get("nodes", [])
                if node.get("type") == "TableNode"
            ],
            "raw_data": diagram.data,
        }
        for diagram in er_diagrams
    ]
