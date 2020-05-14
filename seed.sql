CREATE DATABASE mattsEmployeeDB;

USE mattsEmployeeDB;


CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30),
PRIMARY KEY (id)
);


CREATE TABLE role (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL(9,2),
department INT NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY (department) REFERENCES department (id) 

);

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT NOT NULL,
manager_id INT NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY (role_id) REFERENCES role (id),
FOREIGN KEY (manager_id) REFERENCES employee (id)
);

INSERT INTO department (name)
VALUES ("Operations"), ("Accounting"), ("Marketing");

INSERT INTO role (title, salary, department)
VALUES ("CEO", 180000, 1), ("CFO", 160000, 2), ("Marketing Manager",110000, 3);

INSERT INTO role (title, salary, department)
VALUES ("Complex Manager", 70000, 1), ("Supervisor", 40000, 1), ("Marketing Assitant",60000, 3), ("Company Accountant", 80000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Wilkins", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Paul", "Bell", 3, 1),("Wendy", "Go", 2, 1),("Ben", "Harte", 4, 1),("Glen", "Barry", 4, 1),("Vicki","Richards", 6, 2),("Kate","Elbones",6,2),("Dennis","Filgree",7,2),("Max","Tully",5,4),("Paula","Stevens",5,4),
("Terry","Rumpkin",5,4),("Deb","Jeffbree",5,5),("Lynn","Taylor",5,5);

INSERT INTO role (title, salary, department)
VALUES ("Floor Staff", 30000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mahli", "Habaloo", 8, 9), ("Tom", "Bradson", 8,9), ("Ethan","Bleasdale", 8, 10), ("Bridgit", "Wilson", 8, 10), ("Ethan", "Evans", 8, 11), ("Geoff","Halsy", 8, 12), ("Tom", "Riddle", 8,12), ("Dale","Finson",8, 13),
("Tegan", "Smart", 8, 13);


SELECT * FROM employee;

