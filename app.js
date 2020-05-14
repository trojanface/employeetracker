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
        "Remove Employee","Update Employee Role","Update Employee Manager","Update Employee Department", "Remove Employee",
        "Add Department", "Update Department", "Remove Department", "Add Role", "Change Role", "Remove Role",
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
        }
    });

}

async function newEmployee() {
    console.log("\n\n Add new Employee \n\n")
    const questionData = await inquirer.prompt([
        new Question("input", "empFName", "First Name:"),
        new Question("input", "empLName", "Last Name:"),
        new Question("input", "empRole", "Role id:"),
        new Question("input", "empMan", "Manager id:"),
    ]).then((results)=>{
        myDB.addNewEmployee(results.empFName, results.empLName, parseInt(results.empRole), parseInt(results.empMan));
    });
}