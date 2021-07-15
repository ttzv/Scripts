REM put path to backup file in variable below
SET filename=
pg_restore --username=postgres --create --verbose %filename%