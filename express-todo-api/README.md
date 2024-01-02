```text
npm init -y
npm i cors express pg nodemon
npm run start
psql -U postgres -d todo_app_db < remove_todo_fk.sql
```