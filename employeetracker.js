var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employeeTracker_DB"
});


// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });


// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do",
      choices: [
        "View all Employees", 
        "View all Departments",
        "View Employees by Department", 
        "View Employees by Manager",
        "View Employees by Role",
        "Add Employee",
        "Add Department",
        "Remove Employee", 
        "Remove Department", 
        "Update Employee Role", 
        "Update Employee Manager",
        "Update Employee Department",
        "End"
              ]
    })
    .then(function(answer){
      switch(answer.action){
        case "View all Employees":
          viewAllEmployees();
          break;
        case "View all Departments":
          viewAllDepartments();
          break;
        case "View Employees by Department":
          viewEmployeesByDepartment();
          break;
        case "View Employees by Manager":
          viewEmployeesByManager();
          break;
        case "View Employees by Role":
          viewEmployeesByRole();
          break;
        case  "Add Employee":
          addEmployee();
          break;
        case  "Add Department":
          addDepartment();
          break
        case  "Remove Employee":
          removeEmployee();
          break
        case  "Remove Department":
          removeDepartment();
          break
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
        case "Update Employee Department":
          updateEmployeeDepartment();
          break;
        case "End":
         connection.end();
          break;
      }
    })
}

function viewAllEmployees(){
  console.log("Viewing all employees...\n");
  connection.query("SELECT fist_name, last_name, title FROM employee LEFT JOIN role ON role_id = role.id",  
  function(err,res){
    if (err) throw err;
    console.table(res);
    start();
  })
}

function viewAllDepartments(){
  console.log("Viewing all departments...\n");
  connection.query("SELECT name FROM department LEFT JOIN role ON department_id = department.id",  
  function(err,res){
    if (err) throw err;
    console.table(res);
    start();
  })
}

function viewEmployeesByDepartment(){
  console.log("Viewing all employees by Department...\n");
  connection.query("SELECT fist_name, last_name, role_id FROM employee LEFT JOIN department ON role_id = department.id",  
  function(err,res){
    if (err) throw err;
    console.table(res);
    start();
  })
}

function viewEmployeesByManager(){
  console.log("Viewing all employees by Manager...\n");
  connection.query("SELECT fist_name, last_name, manager_id FROM employee",
  function(err,res){
    if (err) throw err;
    console.table(res);
    start();
  })
}

function viewEmployeesByRole(){
  console.log("Viewing all employees by Role...\n");
  connection.query("SELECT fist_name, last_name, manager_id FROM employee",
  function(err,res){
    if (err) throw err;
    console.table(res);
    start();
  })
}

function addEmployee(){
  console.log("Adding new Employee...\n");
  inquirer
  .prompt([
    {
    name: "name",
    type: "input",
    message: "What is the employee's name?"
  },
  {
    name: "lastName",
    type: "input",
    message: "What is the employee's last name?"
  },
  {
    name: "roleID",
    type: "input",
    message: "What is the employee's role ID?",
  },
  {
    name: "managerID",
    type: "input",
    message: "What is your employee's manager's ID?",
  }])
  .then(function(res){
    console.log("Adding Employee...\n");
    connection.query('INSERT INTO employee (fist_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.name, res.lastName, res.roleID, res.managerID],
    function(err,res){
      if (err) throw err;
      console.table(res);
      viewAllEmployees();
      start();
    })
  })}

  function addDepartment(){
    inquirer
    .prompt(
      {
      name: "department",
      type: "input",
      message: "What department do you want to add?" 
    }
  )
    .then(function(res){
      console.log("You have added: " + res.department + " Department");
      connection.query('INSERT INTO department (name) VALUES (?)', [res.department],
      function(err,res){
        if (err) throw err;
        console.table(res);
        viewAllDepartments();
      })
    })
  }

  function removeEmployee(){
    inquirer
    .prompt(
      {
        name: "id",
        type: "input",
        message: "What is the ID of the Employee you want to remove?"
      })
      .then(function(res){
        console.log("You have removed employee's id number:" + res.id);
        connection.query("DELETE FROM employee WHERE id =" + res.id,
        function(err,res){
            if (err) throw err;
            console.table(res);
            start()
        })
      })
}

function removeDepartment(){
  inquirer
  .prompt({
    name: "department",
    type: "input",
    message: "What department do you want to delete?"
  })
  .then(function(res){
    console.log("You have removed the Department with an id number of:" + res.department);
    connection.query("DELETE FROM department WHERE id =" + res.department,
    function(err,res){
      if (err) throw err
      console.table(res);
      viewAllDepartments();
    })
  })
}

function updateEmployeeDepartment(){
  inquirer
  .prompt([{
    name: "name",
    type: "input",
    message: "Please enter the first name of the employee you want to change to another department?"
  },
  {
    name: "roleID",
    type: "input",
    message: "What is the role ID of the new department you want to move that employee to?"
  }])
  .then(function(res){
    console.log("You have moved " + res.name + " to the department role with an ID number of : " + res.roleID);
    connection.query("UPDATE employee SET role_id = ? WHERE fist_name = ?", [res.roleID, res.name],
    function(err,res){
      if (err) throw err;
      console.table(res);
    })
  })
  viewEmployeesByDepartment();
}


function updateEmployeeRole(){
  inquirer
  .prompt([{
    name: "id",
    type: "input",
    message: "Please enter the id of the employee you want to change to new role?"
  },
  {
    name: "title",
    type: "input",
    message: "What is the new role?"
  }])
  .then(function(res){
    console.log("You have moved employee with the id of: " + res.id + " to: " + " a " + res.title + " role");
    connection.query("UPDATE role SET role_id = ? WHERE title = ?", [res.id, res.title],
    function(err,res){
      if (err) throw err;
      console.table(res);
    })
    viewEmployeesByRole();
  })
}

function updateEmployeeManager(){
  inquirer
  .prompt([{
    name: "name",
    type: "input",
    message: "Please enter the name of the employee you want to assignt a new manager to?"
  },
  {
    name: "manager",
    type: "input",
    message: "What is the new manager's id?"
  }])
  .then(function(res){
    console.log("You have assigned" + res.manager + " to " + res.name);
    connection.query("UPDATE employee SET fist_name = ? WHERE manager_id = ?", [res.name, res.manager],
    function(err,res){
      if (err) throw err;
      console.table(res);
    })
    viewEmployeesByManager();
  })
}