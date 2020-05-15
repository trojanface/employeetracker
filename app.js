const Question = require("./lib/Question");
const Database = require("./lib/Database");
const inquirer = require("inquirer");



const myDB = new Database();

console.log("\nWelcome to your CMS\n");


async function start() {
    let temp = await myDB.read().then((result) => {
        console.log(result);
    });
}



mainMenu();
async function mainMenu() {

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
                newEmployee();
                break;
            case "Remove Employee"://1
                remEmployee();
                break;
            case "Update Employee Role"://2
                updRoleEmployee();
                break;
            case "Update Employee Manager"://3
                updManEmployee();
                break;
            case "Add Department"://4
                newDepartment();
                break;
            case "Update Department"://5
                updDep();
                break;
            case "Remove Department"://6
                remDep();
                break;
            case "Add Role"://7
                addRole();
                break;
            case "View Department Budget"://9
                myDB.viewBudget();
                break;
            case "Remove Role"://8
                remRole();
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

async function newEmployee() {
    console.log("\n\n Add new Employee \n\n");
    const questionData = await inquirer.prompt(questionArray[0]).then((results) => {
        new Database().create("first_name, last_name, role_id, manager_id",`${results.empFName}, ${results.empLName}, ${parseInt(results.empRole)}, ${parseInt(results.empMan)}`,"employee");
    });
    mainMenu();
}

async function remEmployee() {
    console.log("\n\n Remove an Employee\n\n");
    const questionData = await inquirer.prompt(questionArray[1]).then((results) => {
        if (results.conf) {
            new Database().delete("employee", parseInt(results.remEMP));
        } else {
            console.log("Action cancelled");
        }
    });
    mainMenu();
}

async function updRoleEmployee() {
    console.log("\n\n Update Employee Role \n\n");
    const questionData = await inquirer.prompt(questionArray[2]).then((results) => {
        new Database().update("employee",parseInt(results.empId),{role_id: parseInt(results.roleId)});
    });
    mainMenu();
}

async function updManEmployee() {
    console.log("\n\n Update Employee Manager \n\n");
    const questionData = await inquirer.prompt(questionArray[3]).then((results) => {
        new Database().update("employee",parseInt(results.empId),{manager_id: parseInt(results.manId)});
    });
    mainMenu();
}

async function newDepartment() {
    console.log("\n\n Add new Department \n\n");
    const questionData = await inquirer.prompt(questionArray[4]).then((results) => {
        new Database().create("name",`${results.depName}`,"department");
    });
    mainMenu();
}

async function updDep() {
    console.log("\n\n Update Department\n\n");
    const questionData = await inquirer.prompt(questionArray[5]).then((results) => {
        new Database().update("department",parseInt(results.oldId),{name: results.depName});
    });
    mainMenu();
}

async function remDep() {
    console.log("\n\n Remove a Department\n\n");
    const questionData = await inquirer.prompt(questionArray[6]).then((results) => {
        if (results.conf) {
            new Database().delete("department", parseInt(results.remDep));
        } else {
            console.log("Action cancelled");
        }
    });
    mainMenu();
}

async function addRole() {
    console.log("\n\n Add new Role \n\n");
    const questionData = await inquirer.prompt(questionArray[7]).then((results) => {
        new Database().create("title, salary, department",`${results.roleName}, ${parseInt(results.roleSal)}, ${parseInt(results.roleDep)}`,"role");
      });
    mainMenu();
}

async function remRole() {
    console.log("\n\n Remove a Role\n\n");
    const questionData = await inquirer.prompt(questionArray[8]).then((results) => {
        if (results.conf) {
            new Database().delete("role", parseInt(results.remRole));
        } else {
            console.log("Action cancelled");
        }
    });
    mainMenu();
}

function redirectFunc() {
    mainMenu();
}














