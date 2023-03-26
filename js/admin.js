"use strict";

const nameEl = document.getElementById("admin-name");
const addressEl = document.getElementById("admin-address");
const emailEl = document.getElementById("admin-epost");
const idEl = document.getElementById("admin-id")
const shippingEl = document.getElementById("admin-shipping");
const adminSectionEl = document.getElementById("adminSection");


fetch("https://firestore.googleapis.com/v1/projects/webshopdb-a8cb9/databases/(default)/documents/webbshop/")
  .then(res => res.json())
  .then(data => getAdminContent(data))
  .catch(error => console.log(error));

function getAdminContent(content) {

    // Kontrollerar hämtning från API (Får jag med allt?)
    //console.log(content);

    const cont = content.documents;
  
    for (let content of cont) {

        console.log(content); // kontrollerar & loopar fram alla object i min databas

        adminSectionEl.innerHTML += `
        <br>
        <article class="articleFrame">
            <ul class="admin">
                <li> Order ID: ${content.name}</li>
                <br>
                <li>Name: ${content.fields.Name.stringValue}</li>
                <li>Adress: ${content.fields.address.stringValue}</li>
                <li>Email: ${content.fields.email.stringValue}</li>
                <li>Shipping: ${content.fields.shipping.stringValue}</li>
                <li>Product IDs: ${(content.fields.idproduct.arrayValue.values.map(values => values.stringValue))}</li>
            </ul>
            <hr>
                <input type="button" value="delete" onClick="deleteUser('${content.name}')">
                <input type="button" value="update" onClick="updateUser('${content.name}')"> 
        </article>
        `
  
    }
  }

  function deleteUser(name) {

    console.log("user delete function active");     // Meddelande så vi vet att funktionen körs!
    console.log(name);                              // skriver ut orderID på den vi deletade, så vi vet att funktionen funkar.
  
    fetch("https://firestore.googleapis.com/v1/" + name, {
  
        method: "DELETE"
  
      })

      .then(res => res.json())
      .then(data => console.log(data))
      .catch(error => console.log(error));
  
      setTimeout(() => location.reload(), 1000); // reload sida efter 2 sekunder från Delete ***********************************************************
  }

  function updateUser(name) {

    const namn = nameEl.value;
    const address = addressEl.value;
    const email = emailEl.value;
    const id = idEl.value;
    const shipping = shippingEl.value;
  
    let body = JSON.stringify(
  
        {
            "fields": {
                "Name": { 
                    "stringValue": namn
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
                        "values": id.split(",").map(id => ({"stringValue": id.trim()}))
                    }
                }
            } 
        }      
    )
  
    console.log("nu körs uppdatering metoden");
  
    fetch("https://firestore.googleapis.com/v1/" + name, {
  
        method: "PATCH",
        headers: {
  
          "Content-type": "application/json"
  
        },
  
        body: body
  
      })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
        console.log(body)

        setTimeout(() => location.reload(), 2000); // reload sida efter 2 sekunder från Update ***********************************************************
  }