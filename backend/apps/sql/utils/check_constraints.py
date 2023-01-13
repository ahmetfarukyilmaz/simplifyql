from sql.schema import TableSchema


# one table can not have multiple primary keys
def check_primary_key(tables: list[TableSchema]):
    """Check if a table has multiple primary keys or no primary key"""

    for table in tables:
        primary_key_count = 0
        for attribute in table.attributes:
            if attribute.constraints.primary_key:
                primary_key_count += 1

        if primary_key_count > 1:
            return False, table.name, "multiple primary keys"
        elif primary_key_count == 0:
            return False, table.name, "no primary key"

    return True, None, None


def check_table_names(tables: list[TableSchema]):
    # table names are unique
    table_names = [table.name for table in tables]
    # return the name of the table that is duplicated
    if len(table_names) != len(set(table_names)):
        return False, table_names[0], "duplicate table name"

    return True, None, None
