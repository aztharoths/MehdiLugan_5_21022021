//Récupération des données du localstorage pour le tableau "savedItem"
const savedItems = JSON.parse(localStorage.getItem("savedItem"));
//zone de création des items du localstorage
const displayShoppingList = document.querySelector("#displayShoppingList");
//zone d'affichage du nombre d'item dans le titre de la page
const displayHeadingItemsNumber = document.querySelector(
  "#displayHeadingItemsNumber"
);
//zone d'affichage du nombre d'item dans le résumé de la commande
const displayTotalItemsNumber = document.querySelector(
  "#displayTotalItemsNumber"
);
const displayOrderAmount = document.querySelector("#displayOrderAmount"); //zone d'affichage du prix total
let orderAmount = 0; //initialiser le prix total à 0
let totalItems = 0; //initialiser le nombre d'article à 0

//----------------------------------GESTION DU FORMULAIRE DE COMMANDE-----------------------------------//

const formOrder = document.querySelector("#formOrder"); //formulaire html
const formInput = document.getElementsByTagName("input"); // tous les input du formulaire
const displayMessage = document.getElementsByClassName("displayMessage"); //zonne d'affichage des maessage d'erreur
const infos = JSON.parse(localStorage.getItem("customerInfos")); // récupération des informations de l'utilisateur (si elles existent, sinon vaut null)
if (infos) {
  //si les informations de l'utilisateur existent
  //On remplis les champs du formulaire par ces infos
  formInput["lastName"].value = infos.lastName;
  formInput["firstName"].value = infos.firstName;
  formInput["email"].value = infos.email;
  formInput["address"].value = infos.address;
  formInput["city"].value = infos.city;
}
formOrder.addEventListener("submit", (order) => {
  //lorsque le formulaire est soumis
  const emptyMessage = `<i class="fas fa-arrow-up"></i>&nbspVeuillez renseigner ce champ&nbsp<i class="fas fa-arrow-up"></i>`;
  const badValueMessage = `<i class="fas fa-arrow-up"></i>&nbspMerci de renseigner ce champ correctement !&nbsp<i class="fas fa-arrow-up"></i>`;
  const regText = /^[a-zA-Zâäàêëéèîïôöœûü-\s]+$/;
  const regMail = /^[\w\.-]+@[\w-]+\.[a-zA-Z]{1,3}$/;
  const regAddress = /^[a-zA-Z\s0-9âäàêëéèîïôöœûü-]+$/;
  order.preventDefault(); //j'annule l'effet de base du bouton
  let testPassed = 0; //je crée une variable qui compte le nombre de RegEx passées
  let testToBePassed = formInput.length; //je déclare le nombre de tests à passer grâce au nombre de champs à remplir (pour une meilleur maintenabilitée);
  if (formInput[0].value == "") {
    //je vérifie que le premier champ ne soit pas vide
    displayMessage[0].innerHTML = emptyMessage; //si il est vide j'informe l'utilisteur qu'il doit le remplir
  } else if (regText.test(formInput[0].value) == false) {
    //si il n'est pas vide, je vérifie que les informations remplies soit celle attendues grâce à l'expression régulière (RegEx)
    displayMessage[0].innerHTML = badValueMessage; //si la valeur saisie ne passe pas le test de la RegEx j'infome l'utilisateur qu'il as mal remplis le champ
  } else {
    //si la valeur passe le test alors nous vérifions le deuxième champ.
    displayMessage[0].innerHTML = ""; //et je supprime l'éventuel message d'erreur précédement afficher
    testPassed++; //j'ajoute 1 pts au nombre de tests passés
  }
  if (formInput[1].value == "") {
    //et je recommence mes tests
    displayMessage[1].innerHTML = emptyMessage;
  } else if (regText.test(formInput[1].value) == false) {
    displayMessage[1].innerHTML = badValueMessage;
  } else {
    displayMessage[1].innerHTML = "";
    testPassed++;
  }
  if (formInput[2].value == "") {
    displayMessage[2].innerHTML = emptyMessage;
  } else if (regMail.test(formInput[2].value) == false) {
    displayMessage[2].innerHTML = badValueMessage;
  } else {
    displayMessage[2].innerHTML = "";
    testPassed++;
  }
  if (formInput[3].value == "") {
    displayMessage[3].innerHTML = emptyMessage;
  } else if (regAddress.test(formInput[3].value) == false) {
    displayMessage[3].innerHTML = badValueMessage;
  } else {
    displayMessage[3].innerHTML = "";
    testPassed++;
  }
  if (formInput[4].value == "") {
    displayMessage[4].innerHTML = emptyMessage;
  } else if (regText.test(formInput[4].value) == false) {
    displayMessage[4].innerHTML = badValueMessage;
  } else {
    //si tous les test sont passés
    displayMessage[4].innerHTML = "";
    testPassed++;
  }

  if (testPassed === testToBePassed) {
    //si tous les tests sont passés
    let contact = {
      //je crée un objet des valeurs des champs du formulaire
      lastName: formInput["lastName"].value,
      firstName: formInput["firstName"].value,
      email: formInput["email"].value,
      address: formInput["address"].value,
      city: formInput["city"].value,
    };
    localStorage.setItem(
      //j'envois cet objet dans le localStorage
      "customerInfos",
      JSON.stringify(customerInfos)
    );
    async function postOrder(type, products) {
      //fonction pour envoyer la commande en fonction du type d'objet
      let response = await fetch(
        "http://localhost:3000/api/" + type + "/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contact, products }),
        }
      );
      console.log(response);
    }
    //je crée un tableau par type d'objet
    let teddiesOrdered = [];
    let camerasOrdered = [];
    let oakOrdered = [];
    savedItems.forEach((item) => {
      //je controle les objets du panier
      if (item.type == "teddies") {
        //si c'est un ours
        for (let i = 0; i < item.quantity; i++) {
          //je compte la quantité de cet ours
          teddiesOrdered.push(item._id); //pour chaque ours j'ajoute son id dans le tableau correspondant
        }
      } else if (item.type == "cameras") {
        for (let i = 0; i < item.quantity; i++) {
          camerasOrdered.push(item._id);
        }
      } else if (item.type == "furniture") {
        for (let i = 0; i < item.quantity; i++) {
          oakOrdered.push(item._id);
        }
      }
    });
    if (teddiesOrdered != "") {
      //je vérifie que le tableau des ours commandés ne soit pas vide
      let products = teddiesOrdered; //je renomme le tableau en le nom attendu par le serveur
      postOrder("teddies", products); //j'envois la commande
    }
    if (camerasOrdered != "") {
      let products = camerasOrdered;
      postOrder("cameras", products);
    }
    if (oakOrdered != "") {
      let products = oakOrdered;
      postOrder("furniture", products);
    }
  }
});

//----------------------------------GESTION DU PANIER-----------------------------------//
//création et insèrtion d'un modèle d'item
const addItemSaved = (
  itemImageUrl,
  itemName,
  itemOption,
  itemQuantity,
  itemPrice,
  id
) => {
  const addItemSaved = `<figure
    class="shopping-list__display-items-selected__items-selected"
    
  >
    <img
      class="shopping-list__display-items-selected__items-selected__img"
      src="${itemImageUrl}"
      alt=""
    />
    <figcaption
      class="shopping-list__display-items-selected__items-selected__desc"
    >
      <h3
        class="shopping-list__display-items-selected__items-selected__desc__name"
        
      >
        ${itemName}
      </h3>
      <p
        class="shopping-list__display-items-selected__items-selected__desc__option"
        
      >
        ${itemOption}
      </p>
      <p class="shopping-list__display-items-selected__items-selected__desc__quantity"><span id="decrement${id}" class="btn">-</span><span class="item-quantity" id="quantity${id}">${itemQuantity}</span><span id="increment${id}" class="btn">+</span></p> 
      <p
        class="shopping-list__display-items-selected__items-selected__desc__price-u"
      >
        Prix :&nbsp; <span id="price${id}">${itemPrice}</span>&nbsp;€
      </p>      
      <button
        class="shopping-list__display-items-selected__items-selected__desc__btn btn"
        id="toTrash${id}"
      >
        <i class="fas fa-trash-alt"></i>
      </button>
    </figcaption>
  </figure>`;
  displayShoppingList.insertAdjacentHTML("beforeend", addItemSaved);
};
//Inspecter le panier (localstorage)
if (savedItems == null || savedItems.length == 0) {
  //si il est vide
  document.querySelector(
    "main" //Vider le main de la page et insérer un message personalisé
  ).innerHTML = `<h1>Vous n'avez pas d'articles dans votre panier !</h1>
  <section class="oops"><img class="oops__img" src="../img/oops.jpeg"/></section>`;
} else {
  //si le panier comprend au moins un article

  savedItems.forEach((item) => {
    //pour chaque item
    addItemSaved(
      //remplir la carte avec ses infos
      item.imageUrl,
      item.name,
      item.option,
      item.quantity,
      item.price * item.quantity,
      item.id
    );
    //ajouter son prix au prix total
    orderAmount = orderAmount + item.price * item.quantity;
    totalItems = totalItems + item.quantity;
  });
  displayHeadingItemsNumber.innerHTML = totalItems; //afficher le nombre d'articles dans le titre
  displayTotalItemsNumber.innerHTML = totalItems; //afficher le nombre d'articles dans le récap

  displayOrderAmount.innerHTML = orderAmount; //afficher le prix total quand tout est compté
  document //selectionner le bouton "annuler la commande"
    .querySelector("#resetShoppingList")
    .addEventListener("click", (event) => {
      //au clic, demander confirmation
      if (window.confirm("Vous allez vider votre panier !")) {
        //si oui
        localStorage.clear(); //vider le panier
        document.location.reload(); //recharger la page
      } else {
        //si non
        document.location.reload(); //recharger la page
      }
    });
}
//----------------------------------CHANGER LE NOMBRE D'ARTICLES DEPUIS LE PANIER-----------------------------------//

for (let i = 0; i < savedItems.length; i++) {
  //pour chaque item dans le panier
  let item = savedItems[i]; //je sauvegarde l'item trouvé
  //je cible tous les boutons
  const decrement = document.querySelector("#decrement" + item.id);
  const increment = document.querySelector("#increment" + item.id);
  const quantity = document.querySelector("#quantity" + item.id);
  const toTrash = document.querySelector("#toTrash" + item.id);
  const price = document.querySelector("#price" + item.id);

  function displayInfos() {
    //une fonction qui affiche les informations sur la page
    quantity.innerHTML = item.quantity;
    price.innerHTML = item.quantity * item.price;
    displayOrderAmount.innerHTML = orderAmount;
    displayHeadingItemsNumber.innerHTML = totalItems;
    displayTotalItemsNumber.innerHTML = totalItems;
    displayMyCart.innerHTML = "(" + totalItems + ")";
  }

  decrement.addEventListener("click", (e) => {
    //quand je clique sur le bouton "-"
    if (item.quantity == 1) {
      //si il ne reste plus qu'un exemplaire de cet item dans le panier
      if (window.confirm("Vous allez retirer cet article du panier !")) {
        //une fenetre de confirmation s'ouvre et si l'usager valide
        orderAmount -= item.price; //j'enlève le prix de l'item au prix total de la commande
        totalItems--; //j'enlève l'item au nombre total d'article dans la commande
        savedItems.splice([i], 1); //je supprime l'article du local storage
        localStorage.setItem("savedItem", JSON.stringify(savedItems)); //je met à jours le localStorage
        document.location.reload(); //je recharge la page pour refaire le calcul des item du panier
      } //si il refuse, rien ne se passe
    } else {
      //si il y as plus d'un exemplaire
      item.quantity--; //j'enleve un exemplaire
      orderAmount -= item.price;
      totalItems--;
      localStorage.setItem("savedItem", JSON.stringify(savedItems));
      displayInfos(); //j'affiche les infos
    }
  });
  increment.addEventListener("click", (e) => {
    //quand je clique sur le bouton "+"
    item.quantity++; //j'ajoute 1 exemplaire
    orderAmount += item.price; //j'ajoute le prix de cet exemplaire au prix total de la commande
    totalItems++; //j'ajoute 1 aux nombre total d'articles
    localStorage.setItem("savedItem", JSON.stringify(savedItems));
    displayInfos();
  });
  toTrash.addEventListener("click", (e) => {
    //au clic du bouton "poubelle"
    if (window.confirm("Vous allez retirer cet article du panier !")) {
      //j'affiche une fenetre de confirmation, si je valide
      savedItems.splice([i], 1); //j'enleve tous les exemplaires de cet item en suprimant directement l'entrée du tableau
      localStorage.setItem("savedItem", JSON.stringify(savedItems)); //je met à jour le localStorage
      document.location.reload(); //je rafraichis la page
    }
  });
}
