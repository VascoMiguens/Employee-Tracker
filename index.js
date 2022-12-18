const inquirer = require("inquirer");
const mysql = require("mysql2");
const {
  MainMenuQuestions,
  departmentQuestions,
  roleQuestions,
  employeeQuestions,
  updateEmployeeRoleQuestions,
} = require("./questions");
const employeeDB = require("./db/employeeDB.js");

//Connect to the database
const db = new employeeDB({
  host: "localhost",
  user: "root",
  password: "cmonin123!",
  database: "employee_db",
});

db.connect();

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
      case "update_employee_role":
        update_employee_role();
        break;
      default:
        console.log("default");
        break;
    }
  });
};

//View Departments Query
const view_departments = () => {
  db.get_departments().then((results) => {
    //show results in a table
    console.table(results);
    //call menu questions
    runMenuQuestions();
  });
};

//View Roles Query
const view_roles = () => {
  db.get_roles().then((results) => {
    //show results in a table
    console.table(results);
    //call menu questions
    runMenuQuestions();
  });
};

//View Employees Query
const view_employees = () => {
  db.get_employees().then((results) => {
    console.table(results);
    //call menu questions
    runMenuQuestions();
  });
};

// Add a Department
const add_department = () => {
  //Prompt add a department questions
  inquirer.prompt(departmentQuestions).then((response) => {
    db.insert_department(response).then((results) => {
      console.log("\n", results, "\n");
      //call menu questions
      runMenuQuestions();
    });
  });
};
// Add a Role
const add_role = () => {
  //Get all departments and push them into roleQuestions choices
  db.get_departments().then((results) => {
    const departmentChoices = roleQuestions[2];
    results.forEach((department) => {
      departmentChoices.choices.push({
        value: department.id,
        name: department.name,
      });
    });
    //Run roleQuestions and insert new role
    inquirer.prompt(roleQuestions).then((response) => {
      db.insert_role(response).then((results) => {
        console.log("\n", results, "\n");
        //call menu questions
        runMenuQuestions();
      });
    });
  });
};

const add_employee = () => {
  // get all details from role and push them into "role" question in employeeQuestions
  db.get_roles().then((results) => {
    const roleQuestion = employeeQuestions[2];
    results.forEach((role) => {
      roleQuestion.choices.push({
        value: role.id,
        name: role.title,
      });
    });

    //filter managers and push them into "manager" question in employeeQuestions
    db.get_manager().then((results) => {
      const managerQuestion = employeeQuestions[3];
      results.forEach((manager) => {
        const manager_details = `${manager.name} (${manager.department})`;
        managerQuestion.choices.push({
          value: manager.id,
          name: manager_details,
        });
      });

      //give a null value if the employee added is a manager
      managerQuestion.choices.push({
        value: null,
        name: "None",
      });

      //Run employee questions and insert employee
      inquirer.prompt(employeeQuestions).then((response) => {
        db.insert_employee(response).then((results) => {
          console.log("\n", results, "\n");
          //call menu questions
          runMenuQuestions();
        });
      });
    });
  });
};

const update_employee_role = () => {
  db.get_employees().then((results) => {
    const employeeQuestions = updateEmployeeRoleQuestions[0];
    results.forEach((employee) => {
      employeeQuestions.choices.push({
        value: employee.id,
        name: employee.name,
      });
    });
    db.get_roles().then((results) => {
      const roleQuestion = updateEmployeeRoleQuestions[1];
      results.forEach((role) => {
        roleQuestion.choices.push({
          value: role.id,
          name: role.title,
        });
      });
      inquirer.prompt(updateEmployeeRoleQuestions).then((response) => {
        db.update_employe_role_query(response).then((results) => {
          console.log("\n", results, "\n");
          runMenuQuestions();
        });
      });
    });
  });
};

runMenuQuestions();
