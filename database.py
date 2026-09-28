import psycopg2
from psycopg2.extras import RealDictCursor


# connects to the Photon database on the VM
# this matches the connection that was tested successfully on the class VM
def get_connection():
    return psycopg2.connect(dbname="photon")


def save_player(player_id, codename):
    """Adds a new player to the players table."""

    sql = """
        INSERT INTO players (id, codename)
        VALUES (%s, %s);
    """

    conn = None

    try:
        conn = get_connection()

        with conn.cursor() as cursor:
            cursor.execute(sql, (player_id, codename))

        conn.commit()
        return True

    except Exception as e:
        print(f"Database Error: {e}")

        if conn:
            conn.rollback()

        return False

    finally:
        if conn:
            conn.close()


def get_player_by_id(player_id):
    """Gets a player's information using their player ID."""

    sql = """
        SELECT id, codename
        FROM players
        WHERE id = %s;
    """

    conn = None

    try:
        conn = get_connection()

        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(sql, (player_id,))
            return cursor.fetchone()

    except Exception as e:
        print(f"Database Error: {e}")
        return None

    finally:
        if conn:
            conn.close()
