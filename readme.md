commands

for the sake of simplicity I copied the DB and .env files to this repo, so when you are testing this you do not need to setup network connections between containers

- d optional
  only docker docker compose up --build -d

create .env file with
DATABASE_URL="postgresql://academy:academy@db:5432/electricity?schema=public"
