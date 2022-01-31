const navbar = document.querySelector('.navbar-main')
const customers_list = document.querySelector('.customers-list')
const user_add = document.querySelector('#userAdd')
const userInput = document.querySelector('#usernameInput')
const phone = document.querySelector('#telephoneInput')
const main_div = document.querySelector('.main')
const btn = document.querySelector('#orders')
const main_orders = document.querySelector('.main-orders')
const ul = document.querySelector('.orders-list')
const select = document.querySelector('#foodsSelect')
const foodsCount = document.querySelector('#foodsCount')

const clientId_span = document.querySelector('#clientId')
const username_h1 = document.querySelector('#userHeader')

const foods = ["Chicken tog'ora", "Chicken wings", "Burger cheese", "Combo", "Spinner", "Cola", "Fanta"]


function valid_name(value) {

    if(value.trim() && value.length <= 30 && value.length >= 3 && (/^[a-z A-Z]+$/gi.test(value))) return true;
    return false;
}

function valid_num(value) {

    if(/^[0-9]+$/gi.test(value) && value.length === 9) return true;
    return false;
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
