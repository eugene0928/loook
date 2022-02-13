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


/**
 * renders all users to users bar
 * @param {arr} users
 * @returns void
 */
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

        // handler to every user
        li.onclick = async () => {

            // get specific user to render his orders
           await getUser(user.userId)

           clientId.textContent = user.userId;
           username_h1.textContent = user.username;

                           
        }
    }
}

/**
 * collect one user and this fucntion call another function to render foods
 * @param {number} id 
 */
 async function getUser(id) {
    let orders = await fetch("https://look-graphql-backend.herokuapp.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify ({
            query: `query ($id: ID) {
                        orders (userId: $id) {
                            food {
                            foodId
                            foodName
                            foodImg
                        }
                        count
                        user {
                            userId
                        }
                        }
                    }`,
            variables: {
                    id: id
            }
        })
    })
    
    orders = await orders.json()

    renderOrders(orders.data.orders)  
}


/**
 * show all orders to main window
 * @param {obj} orders 
 * @returns void
 */
 function renderOrders(orders) {
    ul.innerHTML = null

    for(let order of orders) {
        const [li, img, div, count, name] = createElement('li', 'img', 'div', 'span', 'span')
        
        count.textContent = order.count
        name.textContent = order.food.foodName
        
        li.classList.add('order-item')
        name.classList.add('order-name')
        count.classList.add('order-count')

        img.src = order.food.foodImg
        div.append(name, count)
        li.append(img, div)
        ul.append(li)
    }
}


/**
 * renders all available food to menu bar
 * @param {obj} obj
 */
 function renderFoods(obj) {
    for(let order of obj) {
        const [option] = createElement('option')
        option.textContent = order.foodName;
        option.value = order.foodId;

        select.append(option)
    }
}


/**
 * add user to database and call getusers function to render users again
 * @returns void
 */
 user_add.onsubmit = async () => {
    event.preventDefault()

    if(!(valid_name(userInput.value) && valid_num(telephoneInput.value))) {
        alert('Invalid username or phone number')
        return
    } 

    let add = await fetch("https://look-graphql-backend.herokuapp.com/graphql",  {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `mutation A($user: String! $cont: String!){
                        addUser(username: $user contact: $cont) {
                        status
                        message
                        data
                        }
                    }`,
            variables: {
                user: `${userInput.value}`,
                cont: `${telephoneInput.value}`
            }
        })
    })

    add = await add.json()
    alert(add.data.addUser.message)

    getUsers()

}

/**
 * handler to create food to database or add count to existing one
 * @returns void
 */
 foodForm.onsubmit = async () => {
    event.preventDefault()
    
    if(clientId.textContent) {

        let orders = await fetch("https://look-graphql-backend.herokuapp.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: `mutation ($foodId: Int! $userId: Int! $count: Int!) {
                            addOrder (foodId: $foodId userId: $userId count: $count) {
                            message
                            data
                            }
                    }`,
                variables: {
                    foodId: +select.value,
                    userId: +clientId.textContent,
                    count: +foodsCount.value
                }
            })
        })

        orders = await orders.json()
        
        // get that user and render his food
        getUser(clientId.textContent)
        
        alert(orders.data.addOrder.message)
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