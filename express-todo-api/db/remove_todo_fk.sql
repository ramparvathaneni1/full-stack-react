-- Remove the foreign key constraint
ALTER TABLE todos
DROP
CONSTRAINT fk_user_id;

-- Remove the user_id column
ALTER TABLE todos
DROP
COLUMN user_id;

DELETE FROM todos;

INSERT INTO todos (title, done)
VALUES ('Finish Homework', false),
       ('Plan Vacation', false),
       ('Go to the Gym', true),
       ('Prepare Presentation', false),
       ('Clean the House', true),
       ('Organize Office', false),
       ('Repair Bike', true),
       ('Study for Exams', false),
       ('Renew Passport', false);
