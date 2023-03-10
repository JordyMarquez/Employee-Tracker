-- This file is just to test out the different ways to display tables--


-- INSERT INTO role (title, salary) VALUES ("test", 1356)

-- the following shows a table with a department inserted into it
-- INSERT INTO department (name) VALUES ('depExample')

-- the following shows a table with all the roles
-- SELECT department.name as Department, role.id as  Role_ID, role.title as Title, role.salary as Salary
-- FROM department JOIN role ON role.id = department.id

-- the following shows a table with all the departments
-- SELECT department.id AS ID, department.name AS Department FROM Department


-- -- The following makes a table with all the employees in their department and role
-- SELECT department.name AS Department, role.title AS Role, role.salary AS Salary, CONCAT(employee.first_name, " " ,employee.last_name) AS Name -- columns go here --
-- FROM department -- first name of table goes here --
-- LEFT JOIN role -- second name of table goes here --
-- ON role.department_id = department.id  -- the row you want to join them on --
-- LEFT JOIN employee
-- ON employee.role_id = role.id
-- LEFT JOIN employee m 
-- ON employee.manager_id = m.id;