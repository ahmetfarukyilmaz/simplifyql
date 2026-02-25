from sql.schema import TableSchema


def check_primary_key(tables: list[TableSchema]):
    """Check that each table has exactly one primary key."""
    for table in tables:
        pk_count = sum(1 for attr in table.attributes if attr.constraints.primary_key)
        if pk_count > 1:
            return False, table.name, "multiple primary keys"
        elif pk_count == 0:
            return False, table.name, "no primary key"
    return True, None, None


def check_table_names(tables: list[TableSchema]):
    """Check that all table names are unique."""
    seen = set()
    for table in tables:
        if table.name in seen:
            return False, table.name, "duplicate table name"
        seen.add(table.name)
    return True, None, None
