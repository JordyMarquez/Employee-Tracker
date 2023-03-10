// Imports necessary packages
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');


// Connect to database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: '',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

// Init function to prompt questions to the user
function init() {
    inquirer.prompt(
        {
            type: "list",
            message: "You can view, add, or update information on departments, employees, and their roles. What would you like to do?",
            choices: ["View", "Add", "Update", "Finish"],
            name: "init"
        }
    ).then((res) => {
        switch (res.init) {
            case "View":
                view();
                break;
            case "Add":
                add();
                break;
            case "Update":
                update();
                break;
            case "Finish":
                console.log("Finished")
        }
    })

}

// If user clicks on "View" then they will be asked what category they want to view
function view() {
    inquirer.prompt(
        {
            type: "list",
            message: "What would you like to view?",
            choices: ["view all departments", "view all roles", "view all employees"],
            name: "view"
        }
    ).then((res) => {
        switch (res.view) {
            case "view all departments":
                viewDepartments().then(([res]) => {
                    console.table(res)
                    init()
                }).catch(err => {
                    console.log(err)
                });
                break;
            case "view all roles":
                viewRoles().then(([res]) => {
                    console.table(res)
                    init()
                }).catch(err => {
                    console.log(err)
                });
                break;
            case "view all employees":
                viewEmployees().then(([res]) => {
                    console.table(res)
                    init()
                }).catch(err => {
                    console.log(err)
                });
                break
        }
    })
}

// View all departments
function viewDepartments() {
    return db.promise().query('SELECT department.id AS ID, department.name AS Department FROM Department')
}

// View all roles
function viewRoles() {
    return db.promise().query('SELECT department.name as Department, role.id as  Role_ID, role.title as Title, role.salary as Salary FROM department JOIN role ON role.id = department.id')
}

// View all employees
function viewEmployees() {
    return db.promise().query('SELECT department.name AS Department, role.title AS Role, role.salary AS Salary, CONCAT(employee.first_name, " " ,employee.last_name) AS Name FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id LEFT JOIN employee m ON employee.manager_id = m.id;')
}

// If user clicks on "Add" then they will be asked what category they want to add
function add() {
    inquirer.prompt(
        {
            type: "list",
            message: "What would you like to add?",
            choices: ["add a department", "add a role", "add an employee"],
            name: "add",
        }
    ).then((res) => {
        switch (res.add) {
            case "add a department":
                addDepartment();
                break;
            case "add a role":
                addRole();
                break;
            case "add an employee":
                addEmployee();
                break
        }
    })
}

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
function addDepartment() {
    inquirer.prompt(
        {
            type: "input",
            message: "What is the name of the department you want to add?",
            name: "addDepartment"
        }
    ).then((res) => {
        db.query("INSERT INTO department (name) VALUES (?)", (res.addDepartment), (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log("New department added!");
            init()
        })
    })
}

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole() {
    viewDepartments().then(([res]) => {
        const deptChoices = res.map((department) => {
            return { name: department.Department, value: department.ID }
        })
        inquirer.prompt(
            [{
                type: "input",
                message: "What is the name of the role you want to add?",
                name: "roleName"
            },
            {
                type: "number",
                message: "What is the salary for this role?",
                name: "roleSalary"
            },
            {
                type: "list",
                message: "What department does this role belong to?",
                choices: deptChoices,
                name: "roleDept"
            }]
        ).then((res) => {
            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [res.roleName,res.roleSalary,res.roleDept], (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log("New role added!");
                init()
            })
        })
    }).catch(err => {
        console.log(err)
    })
}

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee() {
    viewRoles().then(([res]) => {
        const roleChoices = res.map((role) => {
            return { name: role.Title, value: role.Role_ID }
        })
        inquirer.prompt(
            [{
                type: "input",
                message: "What is the first name of the employee?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is the last name of the employee?",
                name: "lastName"
            },
            {
                type: "list",
                message: "What role does this employee belong to?",
                choices: roleChoices,
                name: "employeeRole"
            }]
                // {
                //     type: "list",
                //     message: "Who is the manager for this employee?",
                //     choices: "",
                //     name: "employeeManager"
                // }
            
        ).then((res) => {
            db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`, [res.firstName,res.lastName,res.employeeRole], (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log("New employee added!");
                init()
            })
        })
    }).catch(err => {
        console.log(err)
    })
}

// WHEN I click on update an employee
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
function update() {
    viewEmployees().then(([res]) => {
        const employeeChoices = res.map((employee) => {
            return { name: employee.Name, value: employee.ID }
        })
        viewRoles().then(([res]) => {
            const roleChoices = res.map((role) => {
                return { name: role.Title, value: role.Role_ID }
            })
            inquirer.prompt(
                [{
                    type: "list",
                    message: "What employee would you like to update?",
                    choices: employeeChoices,
                    name: "employeeList"
                },
                {
                    type: "list",
                    message: "What is the employees new title?",
                    choices: roleChoices,
                    name: "employeeRole"

                }]).then((res) => {
                    console.log(res.employeeRole)
                    db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [res.employeeRole, res.employeeList], (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("Employee updated!");
                        init()
                    })
                })
        }
        ).catch(err => {
            console.log(err)
        })
    })

}

init()
