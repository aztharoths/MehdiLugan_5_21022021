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

//création et insèrtion d'un modèle d'item
const addItemSaved = (
  itemImageUrl,
  itemName,
  itemOption,
  itemQuantity,
  itemPrice
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
      <p>Quantité :&nbsp${itemQuantity}</p>      
      <p
        class="shopping-list__display-items-selected__items-selected__desc__price-u"
      >
        Prix :&nbsp; <span>${itemPrice}</span>&nbsp;€
      </p>      
      <button
        class="shopping-list__display-items-selected__items-selected__desc__btn btn toTrash"
      >
        <i class="fas fa-trash-alt"></i>
      </button>
    </figcaption>
  </figure>`;
  displayShoppingList.insertAdjacentHTML("beforeend", addItemSaved);
};
//Inspecter le panier (localstorage)
if (savedItems == null) {
  //si il est vide
  document.querySelector(
    "main" //Vider le main de la page et insérer un message personalisé
  ).innerHTML = `<h1>Vous n'avez pas d'articles dans votre panier !</h1>
  <section class="oops"><img class="oops__img" src="../img/oops.jpeg"/></section>`;
} else {
  //si le panier comprend au moins un article
  let orderAmount = 0; //initialiser le prix total à 0
  let totalItems = 0; //initialiser le nombre d'article à 0
  savedItems.forEach((item) => {
    //pour chaque item
    addItemSaved(
      //remplir la carte avec ses infos
      item.imageUrl,
      item.name,
      item.option,
      item.quantity,
      item.price * item.quantity
    );
    //ajouter son prix au prix total
    orderAmount = orderAmount + item.price;
    totalItems = totalItems + item.quantity;
  });
  displayHeadingItemsNumber.innerHTML = totalItems; //afficher le nombre d'articles dans le titre
  displayTotalItemsNumber.innerHTML = totalItems; //afficher le nombre d'articles dans le récap
  const displayOrderAmount = document.querySelector("#displayOrderAmount"); //zone d'affichage du prix total
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
  let toTrash = document.querySelectorAll(".toTrash");
  console.log(toTrash);
}
//----------------------------------CHANGER LE NOMBRE D'ARTICLES DEPUIS LE PANIER-----------------------------------//
