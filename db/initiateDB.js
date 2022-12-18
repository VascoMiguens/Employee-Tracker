const mysql = require("mysql2");

class inititateDB {
  constructor(options) {
    this.options = options;
    this.db = null;
  }

  //Validation of users database configuration
  validate() {
    const { host, user, password, databse } = this.options;
    if (!host || !user || !password || !databse)
      throw new Error("Your database configuration is not correct!");

    return;
  }

  connect() {
    //when connecting to database validate users database configuration
    this.validate();

    //Destructure users database configuration
    const { host, user, password, databse } = this.options;

    //Connect to database
    this.db = mysql.createConnection(
      {
        host: host,
        user: user,
        password: password,
        database: database,
      },
      console.log("Connected to the Employee database")
    );
  }
}

module.exports = inititateDB;
