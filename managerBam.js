const inquirer = require("inquirer");
const mysql = require("mysql");

//sets up the connection to the database
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
});

//connects to the database, then runs the app
connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View products for sale",
                "View low inventory",
                "Add to inventory",
                "Add new product",
                "Exit"
            ]
        }).then(function (answer) {
            if (answer.choice === "View products for sale") {
                viewProducts();
            }
            if (answer.choice === "View low inventory") {
                viewLowInventory();
            }
            if (answer.choice === "Add to inventory") {
                addInventory();
            }
            if (answer.choice === "Add new product") {
                addNewProduct();
            }
            if (answer.choice === "Exit") {
                exit();
            }
        })
}

function viewProducts() {
    connection.query('SELECT * FROM PRODUCTS', function (err, results) {
        if (err) {
            console.log(err)
        };

        //logs the id, name, and price for each item
        for (var i = 0; i < results.length; i++) {
            console.log(`ID: ${results[i].item_id} || Product Name: ${results[i].product_name} || Price: ${results[i].price} || Quantity: ${results[i].stock_quantity}`)
        }
    });
    exit();
};

function viewLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5;"
    connection.query(query, function (err, results) {
        if (err) {
            console.log(err)
        };

        //logs the id, name, and price for each item
        for (var i = 0; i < results.length; i++) {
            console.log(`ID: ${results[i].item_id} || Product Name: ${results[i].product_name} || Department: ${results[i].department_name} || Price: ${results[i].price} || Quantity: ${results[i].stock_quantity}`)
        }
    });
    exit();
}

function addInventory() {
    connection.query('SELECT * FROM PRODUCTS', function (err, results) {
        if (err) {
            console.log(err)
        };

        //logs the id, name, and price for each item
        for (var i = 0; i < results.length; i++) {
            console.log(`ID: ${results[i].item_id} || Product Name: ${results[i].product_name} || Price: ${results[i].price} || Quantity: ${results[i].stock_quantity}`)
        }
        inquirer
            .prompt([
                {
                    name: "id",
                    type: "input",
                    message: "Enter an item id to update quantity",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "Enter a quantity to add to the item",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ]).then(function (answer) {
                var itemID = answer.id;
                var quantity = answer.quantity;
                var currentQuantity = results[itemID - 1].stock_quantity;
                var quantityAnswerInt = parseInt(quantity)
                var quantityInt = parseInt(currentQuantity);
                var quantityAdded = quantityInt + quantityAnswerInt;
                var query = `UPDATE products SET stock_quantity = ${quantityAdded} WHERE item_id = ${itemID}`;
                connection.query(query, function (err, results) {
                    console.log(`You added ${quantity} to item #${itemID}. The total quantity is now ${quantityAdded}.`)
                })
                exit();
            });
    });
};
function addNewProduct() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Enter the name of an item",
            },
            {
                name: "departmentName",
                type: "input",
                message: "Enter a department name for the item",
            },
            {
                name: "price",
                type: "input",
                message: "Enter a price for the item",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many do you want to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            var name = answer.name;
            var departmentName = answer.departmentName;
            var price = answer.price;
            var quantity = answer.quantity;
            connection.query(
                `INSERT INTO products (product_name, department_name, price, stock_quantity)
                VALUES ('${name}', '${departmentName}', '${price}', '${quantity}')`
            );
            console.log("Product added!")
            exit();
        })
}

function exit() {
    connection.end();
};