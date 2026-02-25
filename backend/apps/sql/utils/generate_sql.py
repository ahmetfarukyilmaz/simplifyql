from sql.utils.relationships import (
    generate_many_to_many_relationship,
    generate_one_to_many_relationship,
    generate_one_to_one_relationship,
)


def _build_column_def(attribute):
    """Build a single column definition string."""
    column = f'"{attribute.name}" {attribute.type}'

    if attribute.length:
        column += f"({attribute.length})"

    if attribute.constraints is not None:
        column += " NULL" if attribute.constraints.nullable else " NOT NULL"
        if attribute.constraints.primary_key:
            column += " PRIMARY KEY"
        if attribute.constraints.unique:
            column += " UNIQUE"

    return column


def generate_sql_code(tables):
    sql_code = ""

    for table in tables:
        columns = []
        indexes = []

        for attribute in table.attributes:
            columns.append(_build_column_def(attribute))

            if attribute.constraints and attribute.constraints.index:
                index_name = f"{table.name}_{attribute.name}_index"
                indexes.append(f'CREATE INDEX "{index_name}" ON "{table.name}" ("{attribute.name}");\n\n')

        column_defs = ",\n".join(columns)
        sql_code += f'CREATE TABLE "{table.name}" (\n{column_defs}\n);\n\n'
        sql_code += "".join(indexes)

    for table in tables:
        sql_code += generate_many_to_many_relationship(table, tables)
        sql_code += generate_one_to_one_relationship(table, tables)
        sql_code += generate_one_to_many_relationship(table, tables)

    return sql_code
