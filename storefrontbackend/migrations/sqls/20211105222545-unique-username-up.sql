ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (first_name, last_name);