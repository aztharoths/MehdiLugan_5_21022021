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

//----------------------------------GESTION DU PANIER-----------------------------------//
//création et insèrtion d'un modèle d'item
function addItemSaved(
  itemImageUrl,
  itemName,
  itemOption,
  itemQuantity,
  itemPrice,
  id
) {
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
        class="shopping-list__display-items-selected__items-selected__desc__trash btn"
        id="toTrash${id}"
      >
        <i class="fas fa-trash-alt"></i>
      </button>
    </figcaption>
  </figure>`;
  displayShoppingList.insertAdjacentHTML("beforeend", addItemSaved);
}
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
