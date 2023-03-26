"use strict"

// Connection HTML
const headerEl = document.getElementById("header");
const sectionEl = document.getElementById("webbutik");
// Kategorier
const sectionMenEl = document.getElementById("men");
const sectionWomanEl = document.getElementById("woman");
const sectionElectricEl = document.getElementById("el");
const sectionJewelryEl = document.getElementById("jew");
// Kundvagn
const sectionCartEl = document.getElementById("showCart"); // function(toogle-show/hide kundvagn)
const kundvagnbuttonEl = document.getElementById("kundvagnbutton"); // knappen(toggla kundvagn)
const tillagdEl = document.getElementById("tillagd"); // skriver HTML
const totalSumCartEl = document.getElementById("totalSumCart"); // skriver HTML
const checkoutEl = document.getElementById("checkout"); // skriver HTML
const checkformEl = document.getElementById("checkform"); // skriver HTML
// Checkout
const sectionCheckoutEl = document.getElementById("showCheckout"); // function(show checkout sectionen)
// Count items Cart
const cartItemNumberEl = document.getElementById("cartItemNumber");
// form
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("epost");
const addressEl = document.getElementById("address");
const shippingEl = document.getElementById("shipping");

//Header
    //Menu buttons
    headerEl.innerHTML = `
    <li><a class="category-button" data-category="all">All</a></li>
    <li><a class="category-button" data-category="men's clothing">Men's clothing</a></li>
    <li><a class="category-button" data-category="women's clothing">Womens's clothing</a></li>
    <li><a class="category-button" data-category="electronics">Electronics</a></li>
    <li><a class="category-button" data-category="jewelery">Jewelery</a></li>
    <li><a href="admin.html">Admin</a></li>
    `;


// -- GET -- fetch(Hämtar all data från API)
fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {

    let categoryButtons = document.getElementsByClassName("category-button");
    for (let i = 0; i < categoryButtons.length; i++) {
        categoryButtons[i].addEventListener("click", function() {
            getContent(data, this.getAttribute("data-category"));
        });
    }
    getContent(data, "all");
})
    .catch(error => console.log(error));


// funktioner
function getContent(data, selectedCategory) {

    const content = data.filter(content => {
        if (selectedCategory === "all") {
            return true;
        } else if (selectedCategory === content.category) {
            return true;
        } else {
        return false;
    }});

    console.log(content);

    // nollställer värdena för varje gång sidan laddas, för att undvika dubbletter
    sectionEl.innerHTML = "";

    for (let i = 0; i < content.length; i++) {

        //console.log(data);

        sectionEl.innerHTML += `

        <article class="articleFrame">
            <h1>${content[i].title}</h1>       
            <img src="${content[i].image}" alt="pic">
            <p><b>Category:</b> ${content[i].category}</p>
            <p><b>Product id:</b> ${content[i].id}</p>
            <p id="description"><b>Product description: </b>${content[i].description}</p>
            <p><b>Price: ${content[i].price} $</b></p>
            <p><b>Rating: ${content[i].rating.rate}<br><b>count:</b> ${content[i].rating.count}</p>          
            <br>
            <input type="button" value="Add to cart" onClick="addItem('${content[i].id}', '${content[i].title.replace("'","")}', '${content[i].price}')">
            <hr>
        </article> 
        `;

    }
}

// -- POST -- funktionen ... Lägg till artikel
    function addUser() {

        // Hämta in data från <form>
        const name = nameEl.value.trim();
        const email = emailEl.value.trim();
        const address = addressEl.value.trim();
        const shipping = shippingEl.value.trim();

        if (!name || !email || !address || !shipping) {
            console.log("Name, Address or Email is missing")
            return;
        }

        const idproducts = productarray.map(content => {
            return {
                "stringValue": content.id // hämtar bara id
            }
        });

        // sätt samman användarens värden till JSON-objekt
        let body = JSON.stringify(
            {
            "fields": {
                "Name": { 
                    "stringValue": name
                },
                "email": {
                    "stringValue": email
                },
                "address": {
                    "stringValue": address
                },
                "shipping": {
                    "stringValue": shipping
                },
                "idproduct": {
                    "arrayValue": {
                        "values": idproducts
                    } 
                }
            }   
        }
    );
    
        // Skicka API -- POST -- skickar in värden(användaren). fetch-anrop med POST-metod
        fetch("https://firestore.googleapis.com/v1/projects/webshopdb-a8cb9/databases/(default)/documents/webbshop/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
            
            console.log(body);

            localStorage.clear();   // Rensa localStorage efter POST = true.
            setTimeout(() => location.reload(), 2000); // reload sida efter 2 sekunder från POST

};

//Produkt funktioner
// Skapar Array för produkter (genom att deklarera array utanför funktioner så kommer vi åt den överallt).
//Hämtar localstorage
let productarray = JSON.parse(localStorage.getItem("output")) || [];

// addItem() = Funktion som adderar produkter till kundvagn.
function addItem(id, item, price) {
    
// .push lägger till, i detta fall 'objekt-värdena' i array.
    productarray.push({
        id,
        item,
        price});

//Projekt localStorage

    // Konvertera array-objektet till JSON, lagra i variabel json                                                                       
    let json = JSON.stringify(productarray); // <-- här måste jag lägga in 'productArray' om ja vill att localStorage ska ta in fler object! -- 'org: (object)'

    // Spara json-datan i localstorage-variabeln "output"                                                                       
    localStorage.setItem("output", json);

    cartItemCounter();  // Skriver till HTML på vår span (kundvagn) antal varor vi lägger i.
    updateCart();       // function uppdaterar min cart efter borttag av vara.

    //localStorage.clear(); // <- Används vid felsökning
    }

    function updateCart() {
        
        let sum = 0;
        let html = "";
        for (let i = 0; i < productarray.length; i++) {
            let item = productarray[i];
            sum += parseFloat(item.price);
            html += 
            `<tr>
                <td>${item.item}</td>
                <td>|</td>
                <td><b>${item.price} kr</b></td>
                <td><input type="button" value="x" onClick="deleteOneItem('${item.id}','${i}')"></td>
            </tr>`;
        }

        tillagdEl.innerHTML = html;
        totalSumCartEl.innerHTML = `
        <br>
        <hr id="cartHR">
        <b>Total Summa: <span id="totalPrice">${sum.toFixed(2)} kr</b></span>
        <input type="button" id="checkoutButton" value="check out" onClick="checkOut(${sum.toFixed(2)}, showCheckout(), hideWebbutik())">`;
    
    }

    // Kallar funktioner igen efter borttag av varor och uppdatera cart.
    updateCart();        // uppdaterar min cart efter borttag av vara.
    cartItemCounter();   // uppdaterar min cartItemCounter efter borttag av vara.
    

// checkout function = hämta valda artiklar man betalar
function checkOut(sum) {
                               
    // Nollställa gammal utskrivt för varje gång funktionen körs
    checkoutEl.innerHTML = "";
    checkformEl.innerHTML = "";

    for (let i = 0; i < productarray.length;i++) {
        console.log(productarray[i]);

    checkoutEl.innerHTML += `
        <p>
        <b>Produkt id: ${productarray[i].id}<br>
        Produkt: ${productarray[i].item}<br>
        Pris: ${productarray[i].price}kr<br>
        <br>
        </p>
        <hr>
    `
}

    checkformEl.innerHTML += `
    <hr id="cartHR">
    <p><b>Total summa: ${sum} kr <br><p>
    <br>
    `
}

//Functions (add/delete) - hide/show)*/

// cartItemCounter() {
function cartItemCounter() {   
    // Skriver till HTML på vår span (kundvagn) antal varor vi lägger i.
    let count = cartItemNumberEl.innerHTML = productarray.length;
    return count;
}

// Shopping cart knappar!
function plusOneItem() {

    // senare project att utveckla vidare
   
}

function deleteOneItem(id, index) {

    let funka = productarray.findIndex(item => item.id === id); // <-- org - Hade en tanke men funkar utan.
    //productarray.findIndex(item => item.id === id); //ny
  
    productarray.splice(index, 1);
  
    let json = JSON.stringify(productarray);
    localStorage.setItem("output", json);
  
    cartItemCounter();
    updateCart();
  }
  
// GÖM cart
function hideCart() {
    sectionCartEl.classList.toggle("showCart");
}

// Display showCheckout
function showCheckout() {
    sectionCheckoutEl.classList.add("showCheckout");
}
// Hide webbutik-section
function hideWebbutik() {
    sectionEl.classList.add("webbutik");
}


// eventhanterare
kundvagnbuttonEl.addEventListener("click", hideCart); // aktiverar function hideCart som togglar show/hide