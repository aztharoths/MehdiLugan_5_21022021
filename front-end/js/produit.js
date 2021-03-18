// récupération de l'id de l'item (se trouvant dans l'url)
const itemId = new URLSearchParams(window.location.search).get("id");

// récupération de le type de l'item (se trouvant dans l'url)
const itemType = new URLSearchParams(window.location.search).get("type");

//zone d'affichage du nom
const displayItemName = document.querySelector("#displayItemName");

// Zone de création
const displayItem = document.querySelector("#displayItem");
//initialisation de la quantité de l'item
let quantity = 1;

//création d'une carte pour l'item
function addItem(itemUrlImg, itemName, itemDescription, price) {
  // Modele de la carte
  const addItem = `<figure class="item">
  <img src="${itemUrlImg}" alt="" class="item__img" />
  <figcaption class="item__desc">
    <h2 class="item__desc__heading">${itemName}</h2>
    <p class="item__desc__txt">${itemDescription}</p>
    <div class="item__desc__infos"><form class="item__desc__infos__options">
    <label class="item__desc__infos__options__name" id="optionsName" for="itemOptions"></label>
    <select class="item__desc__infos__options__selector" name="itemOptions" id="itemOptions">
    </select>
    </form> 
    <p class="item__desc__infos__quantity"><span id="decrement" class="btn">-</span>Quantité :&nbsp<span id="displayQuantity"></span><span id="increment" class="btn">+</span></p>        
    <p class="item__desc__infos__price">Prix :&nbsp;<span id="displayPrice">${price}</span> € </p>
    <button type="button" class="item__desc__infos__btn btn" id="addToShoppingListButton">
    Ajouter au Panier
  </button></div>   
        
  </figcaption>
  </figure>`;
  // insertion du modele dans la zone de création
  displayItem.insertAdjacentHTML("beforeend", addItem);
}

window.onload = getItem(itemType, itemId);

//récupération de l'item par son ID
async function getItem(type, id) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/" + type + "/" + id
    );
    try {
      //récupération de l'item avec son id
      const item = await response.json();
      //Affichage des informations de l'item
      displayItemName.innerHTML = item.name;
      addItem(item.imageUrl, item.name, item.description, item.price / 100);
      //Affichage des options
      let optionsName = Object.keys(item)[0];
      let optionArray = Object.values(item)[0];
      const itemsOptions = ["colors", "lenses", "varnish"];

      const labelOption = document.getElementById("optionsName");
      if (optionsName == itemsOptions[0]) {
        labelOption.innerHTML = "Couleur :&nbsp;";
      } else if (optionsName == itemsOptions[1]) {
        labelOption.innerHTML = "Lentille :&nbsp;";
      } else if (optionsName == itemsOptions[2]) {
        labelOption.innerHTML = "Vernis :&nbsp;";
      }

      const displayItemOptions = document.querySelector("#itemOptions");
      optionArray.forEach((itemOption) => {
        let addOption = `<option class="item__desc__options__selector__selection" value="${itemOption}">${itemOption}</option`;
        displayItemOptions.insertAdjacentHTML("beforeend", addOption);
      });
      //Gestion quantite
      const displayQuantity = document.querySelector("#displayQuantity");
      const displayPrice = document.querySelector("#displayPrice");
      const decrement = document.querySelector("#decrement");
      const increment = document.querySelector("#increment");

      displayQuantity.innerHTML = quantity;
      decrement.addEventListener("click", (e) => {
        if (quantity > 1) {
          quantity--;
          displayQuantity.innerHTML = quantity;
          displayPrice.innerHTML = (quantity * item.price) / 100;
        }
      });
      increment.addEventListener("click", (e) => {
        quantity++;
        displayQuantity.innerHTML = quantity;
        displayPrice.innerHTML = (quantity * item.price) / 100;
      });

      //Gestion du panier
      addItemToShoppingList(item);
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  }
}

const itemsTypes = ["teddies", "cameras", "furniture"];

//---------------------------------GESTION DU PANIER----------------------------------------//

//Ajouter un produit au panier

function addItemToShoppingList(item) {
  // selectionne le bouton "Ajouter au panier" crée via add Item
  const addToShoppingListButton = document.querySelector(
    "#addToShoppingListButton"
  );
  // Action à effectuer au clic du bouton
  addToShoppingListButton.addEventListener("click", (event) => {
    //Récupération de l'option choisie
    const optionSelected = document.querySelector("#itemOptions").value;
    //Création d'une id interne pour la gestion du panier
    const localId = item.name.substr(0, 3) + optionSelected.substr(0, 3);
    //Récupération des informations du produit
    const itemSelected = {
      imageUrl: item.imageUrl,
      name: item.name,
      option: optionSelected,
      price: item.price / 100,
      quantity: quantity,
      type: itemType,
      id: localId,
      _id: item._id,
    };
    //Récupération des données du localstorage pour le tableau "savedItem"
    const savedItems = JSON.parse(localStorage.getItem("savedItem"));
    //afficher une alerte
    if (
      //si l'usager confirme
      window.confirm(
        `Vous avez selectionné ${item.name} et ${optionSelected} voulez vous confirmer ?`
      )
    ) {
      //je vérifie qu'il y ai le tableau dans le localstorage
      if (Array.isArray(savedItems)) {
        let alreadyExist = false;
        savedItems.forEach((e) => {
          //si il existe, je vérifie si l'objet ajouté existe déjà dans le tableau

          if (e.name == itemSelected.name && e.option == itemSelected.option) {
            e.quantity++; //si oui, j'incrémente
            alreadyExist = true;
            return false; //je sort de la boucle
          }
        });

        //j'insère mon produit dans le tableau
        if (!alreadyExist) {
          savedItems.push(itemSelected);
        }

        localStorage.setItem("savedItem", JSON.stringify(savedItems));
      } else {
        //si non, je le crée et j'insère mon produit dedans.
        const savedItems = [];
        savedItems.push(itemSelected);
        localStorage.setItem("savedItem", JSON.stringify(savedItems));
      } //je redirige l'usager vers le panier
      window.location.href = "./mon-panier.html";
    } else {
      //si l'usager refuse, je le redirige vers l'accueil
      window.location.href = "../index.html";
    }
  });
}
