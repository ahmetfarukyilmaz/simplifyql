CREATE TABLE User (
id integer(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
name varchar(255) NULL UNIQUE,
email varchar(255) NULL UNIQUE,
is_active boolean NOT NULL
);