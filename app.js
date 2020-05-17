//Import required dependencies
const Question = require("./lib/Question");
const Database = require("./lib/Database");
const inquirer = require("inquirer");

//Create variables to recieve initial db responses
let employeeData;
let roleData;
let departmentData;
//Create variables to recieve intial db responses converted into arrays.
let nameList = [];
let roleList = [];
let depList = [];

//Welcome message
console.log("\nWelcome to your CMS\n");

//Pulls required information from db and stores into variables so you don't have to do multiple requests.
initialise();
async function initialise() {
    //stores employee table info
    employeeData = await new Database().returnResult("SELECT * FROM employee;");
    employeeData = JSON.stringify(employeeData);
    employeeData = JSON.parse(employeeData);
    //stores employee names in an array to populate inquirer answers
    employeeData.forEach(element => {
        nameList.push(`${element.first_name} ${element.last_name}`);
    });
    //stores role table info
    roleData = await new Database().returnResult("SELECT * FROM role;");
    roleData = JSON.stringify(roleData);
    roleData = JSON.parse(roleData);
    //stores role names in an array to populate inquirer answers
    roleData.forEach(element => {
        roleList.push(`${element.title}`);
    });
    //stores department table info
    departmentData = await new Database().returnResult("SELECT * FROM department;");
    departmentData = JSON.stringify(departmentData);
    departmentData = JSON.parse(departmentData);
    //stores department names in an array to populate inquirer answers
    departmentData.forEach(element => {
        depList.push(`${element.name}`);
    });
    //once variables have been populated can then start the main function
    mainMenu();
}




async function mainMenu() {
    //Main menu options
    const questionData = await inquirer.prompt([
        new Question("list", "mainMenu", "What would you like to do?",
            ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee",
                "Remove Employee", "Update Employee Role", "Update Employee Manager",
                "View Departments", "Add Department", "Update Department", "Remove Department", "View Roles", "Add Role", "Remove Role",
                "View Department Budget", "Exit"])
    ]).then(({ mainMenu }) => {
        //depending upon menu selection will launch relevant function
        switch (mainMenu) {
            case "View All Employees": //a simple db query
                new Database().read("SELECT * FROM employee;").then((result) => {
                    console.log(result); //returns the result
                    redirect(); //launches the mainMenu function again with a delay so the user isn't overwhelmed with the db answer and menu all at once
                });
                break;
            case "View All Employees By Department": //a simple db query
                new Database().read(`SELECT employee.first_name, employee.last_name, role.title, department.name
                FROM role 
                JOIN employee ON role.id = employee.role_id
                JOIN department ON role.department = department.id ORDER BY department.id;`).then((result) => {
                    console.log(result);//returns the result
                    redirect();//launches the mainMenu function again with a delay so the user isn't overwhelmed with the db answer and menu all at once
                });
                break;
            case "View All Employees By Manager": //a simple db query
                new Database().read(`SELECT e.first_name, e.last_name, CONCAT(m.first_name, ', ', m.last_name) AS Manager FROM employee e
                JOIN employee m ON e.manager_id=m.id ORDER BY Manager;`).then((result) => {
                    console.log(result);//returns the result
                    redirect();//launches the mainMenu function again with a delay so the user isn't overwhelmed with the db answer and menu all at once
                });
                break;
            case "Add Employee"://launches the questionTemplate function with specified parameters QUESTION TITLE ARRAY, QUESTION ANSWERS ARRAY, DATABASE QUERY SWITCH
                questionTemplate(0, 0, 0);
                break;
            case "Remove Employee"://launches the questionTemplate function with specified parameters QUESTION TITLE ARRAY, QUESTION ANSWERS ARRAY, DATABASE QUERY SWITCH
                questionTemplateWConf(6, 1, 0);
                break;
            case "Update Employee Role"://launches the questionTemplate function with specified parameters QUESTION TITLE ARRAY, QUESTION ANSWERS ARRAY, DATABASE QUERY SWITCH
                questionTemplate(1, 2, 1);
                break;
            case "Update Employee Manager"://launches the questionTemplate function with specified parameters QUESTION TITLE ARRAY, QUESTION ANSWERS ARRAY, DATABASE QUERY SWITCH
                questionTemplate(2, 3, 2);
                break;
            case "Add Department"://launches the questionTemplate function with specified parameters QUESTION TITLE ARRAY, QUESTION ANSWERS ARRAY, DATABASE QUERY SWITCH
                questionTemplate(3, 4, 3);
                break;
            case "Update Department"://launches the questionTemplate function with specified parameters QUESTION TITLE ARRAY, QUESTION ANSWERS ARRAY, DATABASE QUERY SWITCH
                questionTemplate(4, 5, 4);
                break;
            case "Remove Department"://launches the questionTemplate function with specified parameters QUESTION TITLE ARRAY, QUESTION ANSWERS ARRAY, DATABASE QUERY SWITCH
                questionTemplateWConf(8, 6, 2);
                break;
            case "Add Role"://launches the questionTemplate function with specified parameters QUESTION TITLE ARRAY, QUESTION ANSWERS ARRAY, DATABASE QUERY SWITCH
                questionTemplate(5, 7, 5);
                break;
            case "View Department Budget"://launches the questionTemplate function with specified parameters QUESTION TITLE ARRAY, QUESTION ANSWERS ARRAY, DATABASE QUERY SWITCH
                questionTemplate(9, 9, 6);
                break;
            case "Remove Role"://launches the questionTemplate function with specified parameters QUESTION TITLE ARRAY, QUESTION ANSWERS ARRAY, DATABASE QUERY SWITCH
                questionTemplateWConf(7, 8, 1);
                break;
            case "View Departments"://a simple db query
                new Database().read("SELECT * FROM department;").then((result) => {
                    console.log(result);//returns the result
                    redirect();//launches the mainMenu function again with a delay so the user isn't overwhelmed with the db answer and menu all at once
                });
                break;
            case "View Roles"://a simple db query
                new Database().read("SELECT * FROM role;").then((result) => {
                    console.log(result);//returns the result
                    redirect();//launches the mainMenu function again with a delay so the user isn't overwhelmed with the db answer and menu all at once
                });
                break;
            case "Exit"://exits program
                process.exit(2);
                break;
        }
    });
}

const questionArray = [[//An array containing the questions to be asked from each menu option
    new Question("input", "empFName", "First Name:"),
    new Question("input", "empLName", "Last Name:"),
    new Question("list", "empRole", "Role:", roleList),
    new Question("list", "empMan", "Manager Name:", nameList),
], [
    new Question("list", "remEMP", "Employee Name:", nameList),
    new Question("confirm", "conf", "Are you sure?")
], [
    new Question("list", "empId", "Employee Name:", nameList),
    new Question("list", "roleId", "Role:", roleList)
], [
    new Question("list", "empId", "Employee Name:", nameList),
    new Question("list", "manId", "Manager Name:", nameList)
], [
    new Question("input", "depName", "Name:")
], [
    new Question("list", "oldId", "Department:", depList),
    new Question("input", "depName", "Department New Name:")
], [
    new Question("list", "remDep", "Department:", depList),
    new Question("confirm", "conf", "Are you sure?")
], [
    new Question("input", "roleName", "Title:"),
    new Question("input", "roleSal", "Salary:"),
    new Question("list", "roleDep", "Department:", depList)
], [
    new Question("list", "remRole", "Role:", roleList),
    new Question("confirm", "conf", "Are you sure?")
], [
    new Question("list", "roleDep", "Department:", depList)
]];

const questionTitle = ["\n\n Add new Employee \n\n", "\n\n Update Employee Role \n\n", "\n\n Update Employee Manager \n\n",
    "\n\n Add new Department \n\n", "\n\n Update Department\n\n", "\n\n Add new Role \n\n", "\n\n Remove an Employee\n\n",
    "\n\n Remove a Role\n\n", "\n\n Remove a Department\n\n", "\n\n View Department Budget\n\n"];//an array containing titles for each question segment

async function questionTemplate(qNum, qANum, qDBQ) {//a templated function that uses databases to handle common actions
    console.log(questionTitle[qNum]);//loads the title of the action
    await inquirer.prompt(questionArray[qANum]).then(async (results) => {//asks the relevant questions from the questions array
        switch (qDBQ) {//depending upon the question will execute relevant db function 
            case 0:
                await new Database().create("first_name, last_name, role_id, manager_id", `"${results.empFName}", "${results.empLName}", ${roleData[roleList.findIndex(tempVal => results.empRole === tempVal)].id}, ${employeeData[nameList.findIndex(tempVal => results.empMan === tempVal)].id}`, "employee");
                initialise(); //after changing the db the initial variables need to be updated.
                break;
            case 1:
                await new Database().update("employee", employeeData[nameList.findIndex(tempVal => results.empId === tempVal)].id, { role_id: roleData[roleList.findIndex(tempVal => results.roleId === tempVal)].id });
                initialise(); //after changing the db the initial variables need to be updated.
                break;
            case 2:
                await new Database().update("employee", employeeData[nameList.findIndex(tempVal => results.empId === tempVal)].id, { manager_id: employeeData[nameList.findIndex(tempVal => results.manId === tempVal)].id });
                initialise(); //after changing the db the initial variables need to be updated.
                break;
            case 3:
                await new Database().create("name", `"${results.depName}"`, "department");
                initialise(); //after changing the db the initial variables need to be updated.
                break;
            case 4:
                await new Database().update("department", departmentData[depList.findIndex(tempVal => results.oldId === tempVal)].id, { name: results.depName });
                initialise(); //after changing the db the initial variables need to be updated.
                break;
            case 5:
                await new Database().create("title, salary, department", `"${results.roleName}", ${parseInt(results.roleSal)}, ${departmentData[depList.findIndex(tempVal => results.roleDep === tempVal)].id}`, "role");
                initialise(); //after changing the db the initial variables need to be updated.
                break;
            case 6:
                console.log(depList.findIndex(tempVal => results.roleDep === tempVal));
                new Database().read(`SELECT SUM(role.salary), department.name FROM role
            JOIN employee ON role.id = employee.role_id
            JOIN department ON role.department = department.id
            WHERE department.name = "${departmentData[depList.findIndex(tempVal => results.roleDep === tempVal)].name}";`).then((result) => {
                    console.log(result);
                    redirect();
                })
                break;
            default:
                console.log("There was an error");
                break;
        }
    });
}

async function questionTemplateWConf(qNum, qANum, qDBQ) {//a templated function that uses databases to handle common actions after prompting to confirm if the user is sure they wish to execute the function
    console.log(questionTitle[qNum]);//loads the title of the action
    await inquirer.prompt(questionArray[qANum]).then(async (results) => {//asks the relevant questions from the questions array
        if (results.conf) {//checks if the confirmation is positive
            switch (qDBQ) {//depending upon the question will execute relevant db function 
                case 0:
                    await new Database().delete("employee", employeeData[nameList.findIndex(tempVal => results.remEMP === tempVal)].id);
                    initialise();//after changing the db the initial variables need to be updated.
                    break;
                case 1:
                    await new Database().delete("role", roleData[roleList.findIndex(tempVal => results.remRole === tempVal)].id);
                    initialise();//after changing the db the initial variables need to be updated.
                    break;
                case 2:
                    await new Database().delete("department", departmentData[depList.findIndex(tempVal => results.remDep === tempVal)].id);
                    initialise();//after changing the db the initial variables need to be updated.
                    break;
                default:
                    console.log("There was an error");
                    break;
            }
        } else {
            console.log("Action cancelled");
        }

    });
}

function redirect() {//launches mainMenu after a delay so as not to overwhelm the user with the db results and the return of the menu all at once
    setTimeout(() => {
        mainMenu();
    }, 1000);

}