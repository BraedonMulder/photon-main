import os
import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

# Load environment variables from .env file
load_dotenv()

def get_connection():
    """Establishes a connection to PostgreSQL using .env variables."""
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", 5432),
        dbname=os.getenv("DB_NAME", "photon"),
        user=os.getenv("DB_USER", "student"),
        password=os.getenv("DB_PASSWORD", "student")
    )

def save_player(player_id, first_name, last_name, codename):
    """Inserts a new player or updates an existing player's details by ID."""
    sql = """
        INSERT INTO players (id, first_name, last_name, codename)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            codename = EXCLUDED.codename;
    """
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(sql, (player_id, first_name, last_name, codename))
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
    """Fetches a player record by ID to auto-populate codenames on the player entry screen."""
    sql = "SELECT id, first_name, last_name, codename FROM players WHERE id = %s;"
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