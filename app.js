const Question = require("./lib/Question");
const Database = require("./lib/Database");
const inquirer = require("inquirer");
const cTable = require("console.table");
console.log("\nWelcome to your CMS\n");

let employeeData;
let roleData;
let departmentData;

mainMenu();
async function mainMenu() {
    new Database().read("SELECT * FROM employee;").then((result) => {
        employeeData = result;
    });
    new Database().read("SELECT * FROM department;").then((result) => {
        departmentData = result;
    });
    new Database().read("SELECT * FROM role;").then((result) => {
        roleData = result;
    });
    const questionData = await inquirer.prompt([
        new Question("list", "mainMenu", "What would you like to do?",
            ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee",
                "Remove Employee", "Update Employee Role", "Update Employee Manager",
                "Add Department", "Update Department", "Remove Department", "Add Role", "Remove Role",
                "View Department Budget", "Exit"])
    ]).then(({ mainMenu }) => {
        console.log(mainMenu);
        switch (mainMenu) {
            case "View All Employees":
                new Database().read("SELECT * FROM employee;").then((result) => {
                    console.log(result);
                })
                break;
            case "View All Employees By Department":
                new Database().read(`SELECT employee.first_name, employee.last_name, role.title, department.name
                FROM role 
                JOIN employee ON role.id = employee.role_id
                JOIN department ON role.department = department.id ORDER BY department.id;`).then((result) => {
                    console.log(result);
                })
                break;
            case "View All Employees By Manager":
                new Database().read(`SELECT e.first_name, e.last_name, CONCAT(m.first_name, ', ', m.last_name) AS Manager FROM employee e
                JOIN employee m ON e.manager_id=m.id ORDER BY Manager;`).then((result) => {
                    console.log(result);
                })
                break;
            case "Add Employee"://0
            console.log(employeeData);
            console.log(roleData);
                questionTemplate(0, 0, 0);
                break;
            case "Remove Employee"://1
            console.log(employeeData);
                questionTemplateWConf(6, 1, 0);
                break;
            case "Update Employee Role"://2
            console.log(employeeData);
                questionTemplate(1, 2, 1);
                break;
            case "Update Employee Manager"://3
            console.log(employeeData);
                questionTemplate(2, 3, 2);
                break;
            case "Add Department"://4
            console.log(departmentData);
                questionTemplate(3, 4, 3);
                break;
            case "Update Department"://5
            console.log(departmentData);
                questionTemplate(4, 5, 4);
                break;
            case "Remove Department"://6
            console.log(departmentData);
                questionTemplateWConf(8, 6, 2);
                break;
            case "Add Role"://7
            console.log(roleData);
                questionTemplate(5, 7, 5);
                break;
            case "View Department Budget"://9
            new Database().read(`SELECT SUM(role.salary), department.name FROM role
            JOIN employee ON role.id = employee.role_id
            JOIN department ON role.department = department.id
            WHERE department.name = "Operations";`).then((result) => {
                console.log(result);
            })
                break;
            case "Remove Role"://8
            console.log(roleData);
                questionTemplateWConf(7, 8, 1);
                break;
            case "Exit":
                process.exit(2);
                break;
        }
    });
}

const questionArray = [[
    new Question("input", "empFName", "First Name:"),
    new Question("input", "empLName", "Last Name:"),
    new Question("input", "empRole", "Role id:"),
    new Question("input", "empMan", "Manager id:"),
], [
    new Question("input", "remEMP", "Employee id:"),
    new Question("confirm", "conf", "Are you sure?")
], [
    new Question("input", "empId", "Employee id:"),
    new Question("input", "roleId", "Role id:")
], [
    new Question("input", "empId", "Employee id:"),
    new Question("input", "manId", "Manager id:")
], [
    new Question("input", "depName", "Name:")
], [
    new Question("input", "oldId", "Department id:"),
    new Question("input", "depName", "Department New Name:")
], [
    new Question("input", "remDep", "Department id:"),
    new Question("confirm", "conf", "Are you sure?")
], [
    new Question("input", "roleName", "Title:"),
    new Question("input", "roleSal", "Salary:"),
    new Question("input", "roleDep", "Department id:")
], [
    new Question("input", "remRole", "Role id:"),
    new Question("confirm", "conf", "Are you sure?")
]];

const questionTitle = ["\n\n Add new Employee \n\n", "\n\n Update Employee Role \n\n", "\n\n Update Employee Manager \n\n",
    "\n\n Add new Department \n\n", "\n\n Update Department\n\n", "\n\n Add new Role \n\n", "\n\n Remove an Employee\n\n",
    "\n\n Remove a Role\n\n", "\n\n Remove a Department\n\n"];

async function questionTemplate(qNum, qANum, qDBQ) {
    console.log(questionTitle[qNum]);
    await inquirer.prompt(questionArray[qANum]).then((results) => {
        switch (qDBQ) {
            case 0:
                new Database().create("first_name, last_name, role_id, manager_id", `"${results.empFName}", "${results.empLName}", ${parseInt(results.empRole)}, ${parseInt(results.empMan)}`, "employee");
                break;
            case 1:
                new Database().update("employee", parseInt(results.empId), { role_id: parseInt(results.roleId) });
                break;
            case 2:
                new Database().update("employee", parseInt(results.empId), { manager_id: parseInt(results.manId) });
                break;
            case 3:
                new Database().create("name", `"${results.depName}"`, "department");
                break;
            case 4:
                new Database().update("department", parseInt(results.oldId), { name: results.depName });
                break;
            case 5:
                new Database().create("title, salary, department", `"${results.roleName}", ${parseInt(results.roleSal)}, ${parseInt(results.roleDep)}`, "role");
                break;
            default:
                console.log("There was an error");
                break;
        }
    });
    mainMenu();
}

async function questionTemplateWConf(qNum, qANum, qDBQ) {
    console.log(questionTitle[qNum]);
    await inquirer.prompt(questionArray[qANum]).then((results) => {
        if (results.conf) {
            switch (qDBQ) {
                case 0:
                    new Database().delete("employee", parseInt(results.remEMP));
                    break;
                case 1:
                    new Database().delete("role", parseInt(results.remRole));
                    break;
                case 2:
                    new Database().delete("department", parseInt(results.remDep));
                    break;
                default:
                    console.log("There was an error");
                    break;
            }
        } else {
            console.log("Action cancelled");
        }
    });
    mainMenu();
}
