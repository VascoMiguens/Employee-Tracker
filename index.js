const inquirer = require("inquirer");
const mysql = require("mysql2");
const {
  MainMenuQuestions,
  departmentQuestions,
  roleQuestions,
  employeeQuestions,
  updateEmployeeQuestions,
} = require("./questions");


//Connec to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cmonin123!",
  database: "employee_db",
});

// Prompt questions
const runMenuQuestions = async () => {
  await inquirer.prompt(MainMenuQuestions).then((response) => {
    switch (response.option) {
      case "view_departments":
        view_departments();
        break;
      case "view_roles":
        view_roles();
        break;
      case "view_employees":
        view_employees();
        break;
      case "add_department":
        add_department();
        break;
      case "add_role":
        add_role();
        break;
      case "add_employee":
        add_employee();
        break;
      case "update_role":
        update_role();
        break;
      default:
        console.log("default");
        break;
    }
  });
};

//View Departments Query
const view_departments = () => {
  db.query("SELECT * FROM department", (err, results) => {
    err ? console.error(err) : console.table(results);
    runMenuQuestions();
  });
};

//View Roles Query
const view_roles = () => {
  db.query("SELECT * FROM role", (err, results) => {
    err ? console.error(err) : console.table(results);
    runMenuQuestions();
  });
};

//View Employees Query
const view_employees = () => {
  db.query("SELECT * FROM employee", (err, results) => {
    err ? console.error(err) : console.table(results);
    runMenuQuestions();
  });
};

// Add a Department
const add_department = () => {
  //Prompt add a department questions
  inquirer.prompt(departmentQuestions).then((response) => {
    db.query(
      // Insert new department
      `INSERT INTO department SET ?`,
      //Insert into name 
      { name: response.department_name },
      (err, results) => {
        err
          ? console.error(err)
          : console.log(
              `Department ${response.department_name} added successfully`
            );
        runMenuQuestions();
      }
    );
  });
};

const add_role = () => {
  db.query("SELECT * FROM department", (err, results) => {
    const departmentChoices = roleQuestions[2];
    results.forEach((department) => {
      departmentChoices.choices.push({
        value: department.id,
        name: department.name,
      });
    });
  });
  inquirer.prompt(roleQuestions).then((response) => {
    db.query(
      `INSERT INTO role SET ?`,
      {
        title: response.role_name,
        salary: response.role_salary,
        department_id: response.department_id,
      },
      (err, results) => {
        err
          ? console.error(err)
          : console.log(`Role ${response.title} added successfully`);
      }
    );
  });
};

runMenuQuestions();
