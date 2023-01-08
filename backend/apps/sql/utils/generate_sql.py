from sql.utils.relationships import (
    generate_many_to_many_relationship,
    generate_one_to_many_relationship,
    generate_one_to_one_relationship,
)


def generate_sql_code(tables):
    # Generate the SQL code for the tables
    sql_code = ""
    for table in tables:
        # Start the CREATE TABLE statement, but use double quotes for the table name
        sql_code += 'CREATE TABLE "{}" (\n'.format(table.name)

        # Generate the column definitions for the table
        columns = []
        indexes = []
        for attribute in table.attributes:
            # Get the column name and data type
            column_name = attribute.name
            column_type = attribute.type

            # Add the column definition to the list of columns, use quotes for the column name
            column = '"{}" {}'.format(column_name, column_type)

            # Check if the column has a length specified
            if attribute.length:
                column += "({})".format(attribute.length)

            # Check if the column has constraints specified
            if attribute.constraints is not None:
                # Check if the column is not nullable
                if attribute.constraints.nullable:
                    column += " NULL"
                else:
                    column += " NOT NULL"

                # Check if the column is a primary key
                if attribute.constraints.primary_key:
                    column += " PRIMARY KEY"

                # Check if the column is unique
                if attribute.constraints.unique:
                    column += " UNIQUE"

            # Add the column to the list of columns
            columns.append(column)

            # Check if the column is indexed
            if attribute.constraints.index:
                index_name = "{}_{}_index".format(table.name, column_name)
                # use double quotes for the table name
                index = 'CREATE INDEX "{}" ON "{}" ("{}");\n\n'.format(index_name, table.name, column_name)
                indexes.append(index)

        # Concatenate the list of columns with a comma and a newline
        column_defs = ",\n".join(columns)

        # Add the column definitions to the CREATE TABLE statement
        sql_code += "{}\n".format(column_defs)

        # End the CREATE TABLE statement
        sql_code += ");\n\n"

        # Add the indexes to the SQL code
        sql_code += "".join(indexes)

    for table in tables:
        sql_code += generate_many_to_many_relationship(table, tables)
        sql_code += generate_one_to_one_relationship(table, tables)
        sql_code += generate_one_to_many_relationship(table, tables)

    # for table in tables:
    #     sql_code += generate_one_to_one_relationship(table, tables)

    # for table in tables:
    #     sql_code += generate_one_to_many_relationship(table, tables)

    return sql_code
