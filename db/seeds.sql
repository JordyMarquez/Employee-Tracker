-- the following is sample data to test out the application's funciton

INSERT INTO department(name)
VALUES  ("Training"),
        ("Lab"),
        ("Medical Assisting");

INSERT INTO role (title, salary, department_id)
VALUES  ("Trainer", 42000, 1),
        ("Lab Tech", 50000, 2),
        ("MA", 23000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES  ("Lindsay", "Lohan", 1),
        ("Veronica", "Mars", 2),
        ("Jean", "Grey", 3);
