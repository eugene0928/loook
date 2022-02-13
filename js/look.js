const btn = document.querySelector('#orders')
const main_div = document.querySelector('.main')
const ul = document.querySelector('.orders-list')
const user_add = document.querySelector('#userAdd')
const foodForm = document.querySelector('#foodsForm')
const select = document.querySelector('#foodsSelect')
const navbar = document.querySelector('.navbar-main')
const foodsCount = document.querySelector('#foodsCount')
const main_orders = document.querySelector('.main-orders')
const userInput = document.querySelector('#usernameInput')
const customers_list = document.querySelector('.customers-list')
const telephoneInput = document.querySelector('#telephoneInput')

const clientId = document.querySelector('#clientId')
const username_h1 = document.querySelector('#userHeader')


/**
 * collects all users
 * @returns void
 */
 async function getUsers() {
    let users = await fetch("https://look-graphql-backend.herokuapp.com/graphql", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `query {
                        users {
                        userId
                        username
                        contact
                        }
                     }`
        })
    })
    users = await users.json()

    renderUsers(users.data.users)
}

function renderUsers(users) {
    customers_list.innerHTML = null
    for(let user of users) {
        const [li, span, a] = createElement('li', 'span', 'a')

        span.textContent = user.username;
        a.textContent = '+' + user.contact

        li.classList.add('customer-item')
        span.classList.add('customer-name')
        a.classList.add('customer-phone')
        a.setAttribute('href', 'tel:+' + user.contact)

        li.append(span, a);
        customers_list.append(li)

        li.onclick = () => {
            clientId.textContent = user.userId;
            username_h1.textContent = user.username;
            const filteredOrder = user.order

            renderOrders(filteredOrder)
        }
    }
}

/* client ordersni main divga chiqaruvchi function  */
function renderOrders(orders) {
    ul.innerHTML = null

    for(let order in orders) {
        const [li, img, div, count, name] = createElement('li', 'img', 'div', 'span', 'span')
        
        count.textContent = orders[order];
        name.textContent = order
        
        li.classList.add('order-item')
        name.classList.add('order-name')
        count.classList.add('order-count')

        img.src = './img/' + order + '.jpeg';
        div.append(name, count)
        li.append(img, div)
        ul.append(li)
    }
}

function renderFoods(arr) {
    for(let order of arr) {
        const [option] = createElement('option')
        option.textContent = order;
        option.value = order;

        select.append(option)
    }
}

user_add.onsubmit = () => {
    event.preventDefault()
    if(valid_name(userInput.value) && valid_num(telephoneInput.value)) {
        users.push({
            userId: users.length ? +(users.at(-1).userId) + 1 : 1,
            username: userInput.value,
            contact: telephoneInput.value,
            order: {}
        })

        window.localStorage.setItem('users', JSON.stringify(users))

        userInput.value = null;
        telephoneInput.value = null;

        renderUsers(users)
    } else {
        alert('Invalid username or phone number')
    }
}

foodForm.onsubmit = () => {
    event.preventDefault()
    if(clientId.textContent) {
        let user = users.find( el => el.userId == clientId.textContent)

        if(user['order'][select.value]) {
            user['order'][select.value] = +(user['order'][select.value]) + +foodsCount.value;
        } else {
            user['order'][select.value] = foodsCount.value;
        }
        window.localStorage.setItem('users', JSON.stringify(users))

        foodsCount.value = 1
        renderOrders(user.order)
    }
}


function createElement(...arr) {
    return arr.map( el => document.createElement(el))
}





function valid_name(value) {
    if(value.trim() && value.length <= 30 && value.length >= 3 && (/^[a-z A-Z]+$/gi.test(value))) return true;
    return false;
}

function valid_num(value) {

    if((/^998[389][0123456789][0-9]{7}$/).test(value)) return true;
    return false;
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};



renderUsers(users)
renderFoods(foods)
// renderOrders()