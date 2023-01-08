from sql.models import ErDiagram


def get_er_diagrams_helper(user):
    er_diagrams = ErDiagram.objects.filter(user=user)
    table_datas = []

    for er_diagram in er_diagrams:
        table_data = er_diagram.data
        table_final_data = []
        # get the nodes from the table_data that are of type table
        tables = [node for node in table_data["nodes"] if node["type"] == "TableNode"]
        for table in tables:
            table_final_data.append({"id": table["id"], "name": table["data"]["name"]})

        # return the tables id and name, er diagram id, and er diagram name, created_at
        table_datas.append(
            {
                "id": er_diagram.id,
                "name": er_diagram.name,
                "created_at": er_diagram.created_at,
                "tables": table_final_data,
                "raw_data": er_diagram.data,
            }
        )

    return table_datas
