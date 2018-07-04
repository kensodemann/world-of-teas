# Database Installation Scripts

To create the database on a local machine:

1. install postgresql
1. create a role named `ken`
1. create a database named `worldofteas`
1. cd into this directory
1. `psql postgres://ken:ken@localhost/worldofteas` (to update the production database `heroku pg:psql`) (also, see notes if this fails)
1. `worldofteas=> \i install.sql`

That should create all tables without error and populate the default data.

## Rules

1. The script **MUST** be able to be run multiple times without harm
1. Each table shall have its own file
1. For most data inserted, use ON CONFLICT (ID) DO UPDATE
1. If default data can be modified by the user, use ON CONFLICT (ID) DO NOTHING instead of the UPDATE
1. Keep constraints minimal and light, mostly R.I.
1. When adding columns to a table, **do not** change the CREATE TABLE, ALTER the table
1. General order should be
    1. CREATE TABLE
    1. ALTER TABLE to add columns
    1. INSERT data, update on conflict
    1. Special updates if required for ALTERs
    1. ALTER TABLE to add new constraints

## First Time Use

When creating a new database you will need to also create an initial user. Doing that is _not_ part of these scripts. See the `special` scripts and the documentation there for more details on how to do that.

## Notes

### Sample of Creating Role

```bash
~/Projects/Home: sudo su - postgres
postgres@pop-os:~$ psql
psql (10.4 (Ubuntu 10.4-2.pgdg18.04+1))
Type "help" for help.

postgres=# create role ken;
CREATE ROLE
postgres=# create database worldoftea;
CREATE DATABASE
```

If you get an error message about needing a password in order to get into the database, you may need to edit the `/etc/postgresql/10/main/pg_hba.conf` file as such:

```
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
host    all             all             localhost               trust
```

Specifically the second line.
