const inquirer = require("inquirer");
const mysql = require("mysql");

//sets up the connection to the database
var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "youreallythinkimgonnaputmypasswordongithub?!",
  database: "bamazon"
});

//connects to the database, then runs the app
connection.connect(function (err) {
  if (err) throw err;
  start();
});

function start() {
  connection.query('SELECT * FROM PRODUCTS', function (err, results) {
    if (err) {
      console.log(err)
    };

    //logs the id, name, and price for each item
    for (var i = 0; i < results.length; i++) {
      console.log(`ID: ${results[i].item_id} || Product Name: ${results[i].product_name} || Price: ${results[i].price}`)
    }

    //prompts the user for an item id
    inquirer
      .prompt({
        name: "itemID",
        type: "input",
        message: "Which item do you want to buy(select by ID)?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }).then(function (answer) {
        let itemID = answer.itemID;
        console.log(`Item id selected: ${itemID}`)

        //prompts the user for a quantity
        inquirer
          .prompt({
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
          }).then(function (answer) {
            let quantity = answer.quantity;
            //checks to make sure that the quantity requested is available, if it is, updates the database
            if (quantity <= results[itemID - 1].stock_quantity) {
              connection.query(
                `UPDATE products SET stock_quantity = ${results[itemID - 1].stock_quantity - quantity} WHERE item_id = ${itemID}`
              )
              //adds up total cost for an item
              let totalCost = quantity * results[itemID - 1].price
              console.log(`Total cost: ${totalCost}`)
              exit();
            }
            else { 
              console.log("We do not have that many of that item!")
              exit(); 
            }
          })
      })
  });
};

function exit() {
  connection.end();
}