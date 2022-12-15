//Confirm the user only inserted letters
const confirmLettersOnly = (id) => {
  const letters = /^[ a-zA-ZÀ-ÿ\u00f1\u00d1 ']*$/g.test(id);
  if (letters === false || letters == "") {
    return `Please provide a valid name`;
  }
  return true;
};

//Confirm the user only inserted numbers
const confirmNumber = (number) => {
  if (isNaN(number) || number == "") {
    return "please enter a number";
  }
  return true;
};

const MainMenuQuestions = [
  {
    type: "list",
    name: "option",
    message: "What would you like to do?",
    choices: [
      {
        value: "view_employees",
        name: "View all Employees",
      },
      {
        value: "view_roles",
        name: "View all Roles",
      },
      {
        value: "view_departments",
        name: "View all Departments",
      },

      {
        value: "add_department",
        name: "Add a Department",
      },
      {
        value: "add_employee",
        name: "Add an Employee",
      },
      {
        value: "add_role",
        name: "Add a Role",
      },
      {
        value: "update_role",
        name: "Update an Employee's Role",
      },
    ],
  },
];

const departmentQuestions = [
  {
    type: "input",
    name: "department_name",
    message: "What is the name of the department?",
    validate: (answer) => confirmLettersOnly(answer),
  },
];

const roleQuestions = [
  {
    type: "input",
    name: "role_name",
    message: "What is the name of the role?",
    validate: (answer) => confirmLettersOnly(answer),
  },
  {
    type: "input",
    name: "role_salary",
    message: "What is the salary of the role?",
    validate: (answer) => confirmNumber(answer),
  },
  {
    type: "list",
    name: "department_id",
    message: "Which department does the role belong to?",
    choices: [],
  },
];

const employeeQuestions = [
  {
    type: "input",
    name: "first_name",
    message: "What is the Employee's First Name?",
    validate: (answer) => confirmLettersOnly(answer),
  },
  {
    type: "input",
    name: "last_name",
    message: "What is the Employee's Last Name?",
    validate: (answer) => confirmLettersOnly(answer),
  },
  {
    type: "list",
    name: "role_id",
    message: "What is the Employee's Role?",
    choices: [],
  },
  {
    type: "input",
    name: "manager_id",
    message: "Who is the Employee's Manager?",
    choices: [],
  },
];

const updateEmployeeQuestions = [
  {
    type: "list",
    name: "employee_id",
    message: "Which Employee's Role do you want to Update?",
    choices: [],
  },
  {
    type: "list",
    name: "role_id",
    message: "Which Role do you want to assign the selected Employee?",
    choices: [],
  },
];

module.exports = {
  MainMenuQuestions,
  departmentQuestions,
  roleQuestions,
  employeeQuestions,
  updateEmployeeQuestions,
};