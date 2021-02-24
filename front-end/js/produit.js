// récupération du type de l'item (se trouvant dans l'url)
const itemType = new URLSearchParams(window.location.search).get("type");

// récupération de l'id de l'item (se trouvant dans l'url)
const idItem = new URLSearchParams(window.location.search).get("id");

// récupération des l'options de l'item (se trouvant dans l'url)
const optionsItem = new URLSearchParams(window.location.search).get("options");

//zone d'affichage du nom

const displayItemName = document.querySelector("#displayItemName");

// Zone de création
const displayItem = document.querySelector("#displayItem");

//création d'une carte pour l'item
const addItem = (itemUrlImg, itemName, itemDescription, price) => {
  // Modele de la carte
  const addItem = `<figure class="item">
  <img src="${itemUrlImg}" alt="" class="item__img" />
  <figcaption class="item__desc">
    <h2 class="item__desc__heading">${itemName}</h2>
    <p class="item__desc__txt">${itemDescription}</p>    
    <form class="item__desc__options">
    <label class="item__desc__options__name" id="optionsName" for="itemOptions"></label>
    <select class="item__desc__options__selector" name="itemOptions" id="itemOptions">
    </select>
    <p class="item__desc__options__price">Prix :&nbsp;<span>${price}</span> € </p>
    </form>        
    <div class="item__desc__btn-div"> <button type="button" class="item__desc__btn-div__btn btn" href="">
    Ajouter au Panier
  </button> </div>
    
  </figcaption>
  </figure>`;
  // insertion du modele dans la zone de création
  displayItem.insertAdjacentHTML("beforeend", addItem);
};

//récupération de l'item et création de sa carte
const getItem = async (type) => {
  try {
    //requete
    const response = await fetch("http://localhost:3000/api/" + type);
    try {
      //récupération de la liste des items
      const itemsList = await response.json();
      //récupération de l'item dans la liste
      const item = itemsList.find(
        (itemSearched) => itemSearched._id === idItem
      );
      //Affichage des informations de l'item
      displayItemName.innerHTML = item.name;
      addItem(item.imageUrl, item.name, item.description, item.price / 100);
      return item;
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  }
};

const itemsOptions = ["colors", "lenses", "varnish"];

//création des options de l'item
const getOptions = async (optionsName) => {
  try {
    //création de la carte de l'item
    const item = await getItem(itemType);
    try {
      //zone d'affichage des options
      const displayItemOptions = document.querySelector("#itemOptions");
      //zone d'affichage du type d'options
      const displayOptionsName = document.querySelector("#optionsName");
      // modèle des options
      const addOption = (itemOption) => {
        const addOption = `<option class="item__desc__options__selector__selection" value="${itemOption}">${itemOption}</option`;
        // insertion du modèle dans la zone d'affichage
        displayItemOptions.insertAdjacentHTML("beforeend", addOption);
      };
      if (optionsName == itemsOptions[0]) {
        displayOptionsName.innerHTML = "Couleur :&nbsp;";
        for (i = 0; i < item.colors.length; i++) addOption(item.colors[i]);
      } else if (optionsName == itemsOptions[1]) {
        displayOptionsName.innerHTML = "Lentille :&nbsp;";
        for (i = 0; i < item.lenses.length; i++) addOption(item.lenses[i]);
      } else if (optionsName == itemsOptions[2]) {
        displayOptionsName.innerHTML = "Vernis :&nbsp;";
        for (i = 0; i < item.varnish.length; i++) addOption(item.varnish[i]);
      }

      console.log();
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  }
};

getOptions(optionsItem);
