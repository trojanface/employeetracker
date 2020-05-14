const Question = require("./lib/Question");
const Database = require("./lib/Database");
const inquirer = require("inquirer");



const myDB = new Database();

console.log("\nWelcome to your CMS\n");
mainMenu();
async function mainMenu() {
    const questionData = await inquirer.prompt([
        new Question("list", "mainMenu", "What would you like to do?", 
        ["View All Employees","View All Employees By Department","View All Employees By Manager","Add Employee",
        "Remove Employee","Update Employee Role","Update Employee Manager",
        "Add Department", "Update Department", "Remove Department", "Add Role", "Remove Role",
    "View Department Budget"])
    ]).then(({mainMenu}) => {
        console.log(mainMenu);
        switch (mainMenu) {
            case "View All Employees":
            myDB.allEmployees();
            break;
            case "View All Employees By Department":
            myDB.allEmployeesDep();
            break;
            case "View All Employees By Manager":
            myDB.allEmployeesMan();
            break;
            case "Add Employee":
            newEmployee();
            break;
            case "Remove Employee":
            remEmployee();
            break;
            case "Update Employee Role":
            updRoleEmployee();
            break;
            case "Update Employee Manager":
            updManEmployee();
            break;
            case "Add Department":
                newDepartment();
                break;
                case "Update Department":
            updDep();
            break;
            case "Remove Department":
            remDep();
            break;
            case "Add Role":
            addRole();
            break;
            case "View Department Budget":
            myDB.viewBudget();
            break;
            case "Remove Role":
            remRole();
            break;
            
        }
    });

}


async function addRole() {
    console.log("\n\n Add new Role \n\n");
    const questionData = await inquirer.prompt([
        new Question("input", "roleName", "Title:"),
        new Question("input", "roleSal", "Salary:"),
        new Question("input", "roleDep", "Department id:")
    ]).then((results)=>{
        myDB.newRole(results.roleName, parseInt(results.roleSal), parseInt(results.roleDep));
    });
}
async function remRole() {
    console.log("\n\n Remove a Role\n\n");
    const questionData = await inquirer.prompt([
        new Question("input", "remRole", "Role id:"),
        new Question("confirm", "conf", "Are you sure?")
    ]).then((results)=>{
        if (results.conf) {
            myDB.remRole(parseInt(results.remRole));
        } else {
            console.log("Action cancelled");
        }
    });
}
async function remDep() {
    console.log("\n\n Remove a Department\n\n");
     const questionData = await inquirer.prompt([
         new Question("input", "remDep", "Department id:"),
         new Question("confirm", "conf", "Are you sure?")
     ]).then((results)=>{
         if (results.conf) {
             myDB.remDep(parseInt(results.remDep));
         } else {
             console.log("Action cancelled");
         }
     });
 }
async function updDep() {
    console.log("\n\n Update Department\n\n");
    const questionData = await inquirer.prompt([
        new Question("input", "oldId", "Department id:"),
        new Question("input", "depName", "Department New Name:")
    ]).then((results)=>{
        myDB.updDep(parseInt(results.oldId), results.depName);
    });
}
async function newDepartment() {
    console.log("\n\n Add new Department \n\n");
    const questionData = await inquirer.prompt([
        new Question("input", "depName", "Name:")
    ]).then((results)=>{
        myDB.addNewDepartment(results.depName);
    });
}

async function updManEmployee() {
    console.log("\n\n Update Employee Manager \n\n");
    const questionData = await inquirer.prompt([
        new Question("input", "empId", "Employee id:"),
        new Question("input", "manId", "Manager id:")
    ]).then((results)=>{
        myDB.updMan(parseInt(results.empId), parseInt(results.manId));
    });
}

async function updRoleEmployee() {
    console.log("\n\n Update Employee Role \n\n");
    const questionData = await inquirer.prompt([
        new Question("input", "empId", "Employee id:"),
        new Question("input", "roleId", "Role id:")
    ]).then((results)=>{
        myDB.updRole(parseInt(results.empId), parseInt(results.roleId));
    });
}

async function newEmployee() {
    console.log("\n\n Add new Employee \n\n");
    const questionData = await inquirer.prompt([
        new Question("input", "empFName", "First Name:"),
        new Question("input", "empLName", "Last Name:"),
        new Question("input", "empRole", "Role id:"),
        new Question("input", "empMan", "Manager id:"),
    ]).then((results)=>{
        myDB.addNewEmployee(results.empFName, results.empLName, parseInt(results.empRole), parseInt(results.empMan));
    });
}

async function remEmployee() {
   console.log("\n\n Remove an Employee\n\n");
    const questionData = await inquirer.prompt([
        new Question("input", "remEMP", "Employee id:"),
        new Question("confirm", "conf", "Are you sure?")
    ]).then((results)=>{
        if (results.conf) {
            myDB.remEmployee(parseInt(results.remEMP));
        } else {
            console.log("Action cancelled");
        }
    });
}
