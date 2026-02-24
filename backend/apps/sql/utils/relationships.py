from sql.schema import EdgeSchema, TableSchema


def get_relationships(edges: list[EdgeSchema], tables: list[TableSchema]):
    tables_by_id = {table.id: table for table in tables}
    for edge in edges:
        if edge.source in tables_by_id:
            tables_by_id[edge.source].relationships.append(
                {"target": edge.target, "relationship": edge.relationship}
            )
    return tables


def _get_primary_key(table):
    """Return the primary key attribute of a table."""
    for attr in table.attributes:
        if attr.constraints.primary_key:
            return attr
    return None


def _get_target_tables(source_table, tables, relationship_type):
    """Return target tables for a given relationship type."""
    tables_by_id = {t.id: t for t in tables}
    return [
        tables_by_id[rel["target"]]
        for rel in source_table.relationships
        if rel["relationship"] == relationship_type and rel["target"] in tables_by_id
    ]


def generate_many_to_many_relationship(source_table, tables):
    target_tables = _get_target_tables(source_table, tables, "many-many")
    sql_code = ""

    for target_table in target_tables:
        source_pk = _get_primary_key(source_table)
        target_pk = _get_primary_key(target_table)
        junction = f"{source_table.name}_{target_table.name}"

        sql_code += f'CREATE TABLE "{junction}" (\n'
        sql_code += f'"{source_table.name}_id" {source_pk.type} NOT NULL,\n'
        sql_code += f'"{target_table.name}_id" {target_pk.type} NOT NULL,\n'
        sql_code += f'PRIMARY KEY ("{source_table.name}_id", "{target_table.name}_id"),\n'
        sql_code += f'FOREIGN KEY ("{source_table.name}_id") REFERENCES "{source_table.name}" ("{source_pk.name}"),\n'
        sql_code += f'FOREIGN KEY ("{target_table.name}_id") REFERENCES "{target_table.name}" ("{target_pk.name}")\n'
        sql_code += ");\n\n"

    return sql_code


def generate_one_to_one_relationship(source_table, tables):
    target_tables = _get_target_tables(source_table, tables, "one-one")
    source_pk = _get_primary_key(source_table)
    sql_code = ""

    for target_table in target_tables:
        sql_code += f'ALTER TABLE "{target_table.name}" ADD "{source_table.name}_id" {source_pk.type} UNIQUE;\n'
        sql_code += f'ALTER TABLE "{target_table.name}" ADD FOREIGN KEY ("{source_table.name}_id") REFERENCES "{source_table.name}" ("{source_pk.name}");\n'

    return sql_code


def generate_one_to_many_relationship(source_table, tables):
    target_tables = _get_target_tables(source_table, tables, "one-many")
    source_pk = _get_primary_key(source_table)
    sql_code = ""

    for target_table in target_tables:
        sql_code += f'ALTER TABLE "{target_table.name}" ADD "{source_table.name}_id" {source_pk.type};\n'
        sql_code += f'ALTER TABLE "{target_table.name}" ADD FOREIGN KEY ("{source_table.name}_id") REFERENCES "{source_table.name}" ("{source_pk.name}");\n'

    return sql_code
