const Question = require("./lib/Question");
const Database = require("./lib/Database");
const inquirer = require("inquirer");
console.log("\nWelcome to your CMS\n");

let employeeData;
let roleData;
let departmentData;

let nameList =[];
let roleList = [];
let depList = [];

initialise();

async function initialise() {
     employeeData = await new Database().returnResult("SELECT * FROM employee;");
     employeeData = JSON.stringify(employeeData);
     employeeData = JSON.parse(employeeData);

    employeeData.forEach(element => {
       // console.log(`${element.first_name} ${element.last_name}`);
       nameList.push(`${element.first_name} ${element.last_name}`);
    });

   roleData = await new Database().returnResult("SELECT * FROM role;");
   roleData = JSON.stringify(roleData);
   roleData = JSON.parse(roleData);

   roleData.forEach(element => {
    // console.log(`${element.first_name} ${element.last_name}`);
    roleList.push(`${element.title}`);
 });

    departmentData = await new Database().returnResult("SELECT * FROM department;");
    departmentData = JSON.stringify(departmentData);
    departmentData = JSON.parse(departmentData);

    departmentData.forEach(element => {
        // console.log(`${element.first_name} ${element.last_name}`);
        depList.push(`${element.name}`);
     });
    
    mainMenu();
}




async function mainMenu() {
    

    const questionData = await inquirer.prompt([
        new Question("list", "mainMenu", "What would you like to do?",
            ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee",
                "Remove Employee", "Update Employee Role", "Update Employee Manager",
                "View Departments", "Add Department", "Update Department", "Remove Department","View Roles", "Add Role", "Remove Role",
                "View Department Budget", "Exit"])
    ]).then(({ mainMenu }) => {
        console.log(mainMenu);
        switch (mainMenu) {
            case "View All Employees":
                new Database().read("SELECT * FROM employee;").then((result) => {
                    console.log(result);
                    redirect();
                });
                break;
            case "View All Employees By Department":
                new Database().read(`SELECT employee.first_name, employee.last_name, role.title, department.name
                FROM role 
                JOIN employee ON role.id = employee.role_id
                JOIN department ON role.department = department.id ORDER BY department.id;`).then((result) => {
                    console.log(result);
                    redirect();
                });
                break;
            case "View All Employees By Manager":
                new Database().read(`SELECT e.first_name, e.last_name, CONCAT(m.first_name, ', ', m.last_name) AS Manager FROM employee e
                JOIN employee m ON e.manager_id=m.id ORDER BY Manager;`).then((result) => {
                    console.log(result);
                    redirect();
                });
                break;
            case "Add Employee"://0
          //  console.log(employeeData);
            //console.log(roleData);
                questionTemplate(0, 0, 0);
                break;
            case "Remove Employee"://1
          //  console.log(employeeData);
                questionTemplateWConf(6, 1, 0);
                break;
            case "Update Employee Role"://2
           // console.log(employeeData);
           // console.log(roleData);
                questionTemplate(1, 2, 1);
                break;
            case "Update Employee Manager"://3
          //  console.log(employeeData);
                questionTemplate(2, 3, 2);
                break;
            case "Add Department"://4
          //  console.log(departmentData);
                questionTemplate(3, 4, 3);
                break;
            case "Update Department"://5
          //  console.log(departmentData);
                questionTemplate(4, 5, 4);
                break;
            case "Remove Department"://6
          //  console.log(departmentData);
                questionTemplateWConf(8, 6, 2);
                break;
            case "Add Role"://7
          //  console.log(roleData);
                questionTemplate(5, 7, 5);
                break;
            case "View Department Budget"://9
            questionTemplate(9,9, 6);
                break;
            case "Remove Role"://8
         //   console.log(roleData);
                questionTemplateWConf(7, 8, 1);
                break;
                case "View Departments":
                    new Database().read("SELECT * FROM department;").then((result) => {
                        console.log(result);
                        redirect();
                    });
                break;
                case "View Roles":
                    new Database().read("SELECT * FROM role;").then((result) => {
                        console.log(result);
                        redirect();
                    });
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
    new Question("list", "remRole", "Role:",roleList),
    new Question("confirm", "conf", "Are you sure?")
], [
    new Question("list", "roleDep", "Department:", depList)
]];

const questionTitle = ["\n\n Add new Employee \n\n", "\n\n Update Employee Role \n\n", "\n\n Update Employee Manager \n\n",
    "\n\n Add new Department \n\n", "\n\n Update Department\n\n", "\n\n Add new Role \n\n", "\n\n Remove an Employee\n\n",
    "\n\n Remove a Role\n\n", "\n\n Remove a Department\n\n","\n\n View Department Budget\n\n"];

async function questionTemplate(qNum, qANum, qDBQ) {
    console.log(questionTitle[qNum]);
    await inquirer.prompt(questionArray[qANum]).then((results) => {
        switch (qDBQ) {
            case 0:
                new Database().create("first_name, last_name, role_id, manager_id", `"${results.empFName}", "${results.empLName}", ${roleData[roleList.findIndex(tempVal => results.empRole === tempVal)].id}, ${employeeData[nameList.findIndex(tempVal => results.empMan === tempVal)].id}`, "employee");
                break;
            case 1:
                new Database().update("employee", employeeData[nameList.findIndex(tempVal => results.empId === tempVal)].id, { role_id: roleData[roleList.findIndex(tempVal => results.roleId === tempVal)].id });
                break;
            case 2:
                new Database().update("employee", employeeData[nameList.findIndex(tempVal => results.empId === tempVal)].id, { manager_id: employeeData[nameList.findIndex(tempVal => results.manId === tempVal)].id });
                break;
            case 3:
                new Database().create("name", `"${results.depName}"`, "department");
                break;
            case 4:
                new Database().update("department", departmentData[depList.findIndex(tempVal => results.oldId === tempVal)].id, { name: results.depName });
                break;
            case 5:
                new Database().create("title, salary, department", `"${results.roleName}", ${parseInt(results.roleSal)}, ${departmentData[depList.findIndex(tempVal => results.roleDep === tempVal)].id}`, "role");
                break;
            case 6:
                console.log(depList.findIndex(tempVal => results.roleDep === tempVal));
                new Database().read(`SELECT SUM(role.salary), department.name FROM role
            JOIN employee ON role.id = employee.role_id
            JOIN department ON role.department = department.id
            WHERE department.name = "${departmentData[depList.findIndex(tempVal => results.roleDep === tempVal)].name}";`).then((result) => {
                console.log(result);
            })
            break;
            default:
                console.log("There was an error");
                break;
        }
    });
    initialise();
}

async function questionTemplateWConf(qNum, qANum, qDBQ) {
    console.log(questionTitle[qNum]);
    await inquirer.prompt(questionArray[qANum]).then((results) => {
        if (results.conf) {
            switch (qDBQ) {
                case 0:
                   // nameList.find(tempVal => results.remEMP === tempVal);
                    new Database().delete("employee", employeeData[nameList.findIndex(tempVal => results.remEMP === tempVal)].id);
                    break;
                case 1:
                    new Database().delete("role", roleData[roleList.findIndex(tempVal => results.remRole === tempVal)].id);
                    break;
                case 2:
                    new Database().delete("department", departmentData[depList.findIndex(tempVal => results.remDep === tempVal)].id);
                    break;
                default:
                    console.log("There was an error");
                    break;
            }
        } else {
            console.log("Action cancelled");
        }
    });
    initialise();
}

function redirect() {
    setTimeout(()=>{
        mainMenu();
    },1000);
    
}