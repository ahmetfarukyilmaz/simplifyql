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
