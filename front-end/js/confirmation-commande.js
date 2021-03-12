const orderSummary = JSON.parse(localStorage.getItem("orderSummary")); //récupération de la réponse du serveur mise dans le local storage
const orderSummaryPerso = JSON.parse(localStorage.getItem("orderSummaryPerso")); //récupération d'informations plus complètes que la réponse du serveur
const orderId = orderSummary[0].orderId; //récupération de l'id de la commande
const contact = orderSummary[0].contact; //récupération de la page contact
const displayContactInfos = document.querySelector("#displayContactInfos"); //récupération de la zone d'affichage des informations du client
//création du texte de remerciement avec les infos client
const infoText = `<span>${contact.firstName} ${contact.lastName}</span>, votre commande <span>n° ${orderId}</span> à bien été enregistrée et vous sera envoyée dans les plus bref delais au <span>${contact.address}</span> à <span>${contact.city}</span>.<br/>
Un récapitulatif de la commande vous à déjà été envoyé sur votre adresse mail : <span>${contact.email}</span><br/> <span>Toute l'équipe d'Orinoco vous remercie et vous souhaite une bonne journée !</span>`;
//insertion du texte dans la zone d'affichage.
displayContactInfos.insertAdjacentHTML("beforeend", infoText);

//zone d'affichage de l'id de la commande
const displayOrderId = document.querySelector("#orderId");
//affichage de l'id de la commande
displayOrderId.innerHTML = orderId;

let totalItemDisplayed = 0; //total d'item commandés initialisé
let totalPriceDisplayed = 0; //total du prix de la commande initialisé

//modèle de création d'une carte item pour récapitulatif
function addSummaryCard(urlImg, itemName, option, quantity, price) {
  const displaySummary = document.querySelector("#displaySummary"); //zone d'affichage
  const card = `<figure class="summary__items__item">
<img
  class="summary__items__item__img"
  src="${urlImg}"
  alt=""
/>
<figcaption class="summary__items__item__desc">
  <h3>${itemName}</h3>
  <p class="summary__items__item__desc__option">${option}<p>
  <p>Quantité: ${quantity}<p>
  <p>prix : ${quantity * price} €</p>
</figcaption>
</figure>`;
  displaySummary.insertAdjacentHTML("beforeend", card); //aficher la carte dans la zone
}
orderSummaryPerso.forEach((item) => {
  //pour chaque item commandé
  addSummaryCard(
    //créer une carte avec les info correspondante
    item.imageUrl,
    item.name,
    item.option,
    item.quantity,
    item.price
  );
  totalItemDisplayed += item.quantity; //ajouter le nombre d'article au total
  totalPriceDisplayed += item.quantity * item.price; //ajouter le prix au total
});

const displayTotal = document.querySelector("#displayTotal"); //zone d'affichage des totaux
displayTotal.insertAdjacentHTML(
  //affichage des totaux
  "beforeend",
  `Vous avez commandé ${totalItemDisplayed} articles pour un total de ${totalPriceDisplayed} €`
);

const victory = document.querySelector("#victory"); //bouton retour à l'accueil
victory.addEventListener("click", (e) => {
  localStorage.clear(); //supprimer TOUTES les données du localStorage
  window.location.href = "../index.html"; //retour à l'accueil
});

//VICTOIRE !
