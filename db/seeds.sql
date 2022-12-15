INSERT INTO department (id, name) VALUES (1, "Sales");
INSERT INTO department (id, name) VALUES (2, "Engineering");
INSERT INTO department (id, name) VALUES (3, "Finance");
INSERT INTO department   (id, name) VALUES (4, "Legal");

INSERT INTO role (id, title, department_id, salaray) VALUES (1, "Sales Lead", 1 , 100000);
INSERT INTO role (id, title, department_id, salaray) VALUES (2, "Salesperson", 1 , 80000);
INSERT INTO role (id, title, department_id, salaray) VALUES (3, "Lead Engineer", 2 , 150000);
INSERT INTO role (id, title, department_id, salaray) VALUES (4, "Software Engineer", 2 , 120000);
INSERT INTO role (id, title, department_id, salaray) VALUES (5, "Account Manager", 3 , 160000);
INSERT INTO role (id, title, department_id, salaray) VALUES (6, "Accountant", 3 , 125000);
INSERT INTO role (id, title, department_id, salaray) VALUES (7, "Leal Team Lead", 4 , 250000);
INSERT INTO role (id, title, department_id, salaray) VALUES (8, "Lawyer", 4 , 190000);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (1, "John", "Doe", 1, Null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (2, "Mike", "Chan", 2, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (3, "Ashley", "Rodriguez", 3, Null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (4, "Kevin", "Tupik", 4, 3);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (5, "Kunal", "Singh", 5, Null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (6, "Malia", "Brow", 6, 5);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (7, "Sarah", "Lourd", 7, Null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (8, "Tom", "Aleen", 8, 7);