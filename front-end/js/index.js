// Zone de création
const displayItemList = document.querySelector("#itemList");

//création d'une carte pour un item
const addItem = (
  itemType,
  itemOptions,
  item_id,
  itemUrlImg,
  itemName,
  itemDescription
) => {
  // Modele d'une carte
  const addItem = `<figure class="item-list__item">
            <img
              src="${itemUrlImg}"
              alt=""              
              class="item-list__item__img"
            />
            <figcaption class="item-list__item__desc">
              <h2 class="item-list__item__desc__heading">${itemName}</h2>
              <p class="item-list__item__desc__txt">
              ${itemDescription}                
              </p>
              <a
                class="item-list__item__desc__btn btn"
                href="./front-end/pages/produit.html?type=${itemType}&options=${itemOptions}&id=${item_id}"
                >Voir le produit</a
              >
            </figcaption>
          </figure>`;
  // insertion du modele dans la zone de création
  displayItemList.insertAdjacentHTML("beforeend", addItem);
};

// récupération des informations et création des cartes
const getItem = (url, itemType, itemOptions) => {
  fetch(url).then(async (response) => {
    try {
      const itemsList = await response.json();
      // Je supprime le contenu de la zone de création de cartes
      displayItemList.innerHTML = "";
      //création d'autant de cartes que d'items trouvés dans le tableau
      for (i = 0; i < itemsList.length; i++) {
        addItem(
          itemType,
          itemOptions,
          itemsList[i]._id,
          itemsList[i].imageUrl,
          itemsList[i].name,
          itemsList[i].description
        );
      }
    } catch (e) {
      console.log(e);
    }
  });
};

const teddyButton = document.querySelector("#teddyButton");
const camButton = document.querySelector("#camButton");
const oakButton = document.querySelector("#oakButton");

const teddiesUrl = "http://localhost:3000/api/teddies";
const camUrl = "http://localhost:3000/api/cameras";
const oakUrl = "http://localhost:3000/api/furniture";

const itemsType = ["teddies", "cameras", "furniture"];
const itemsOptions = ["colors", "lenses", "varnish"];

teddyButton.addEventListener("click", (e) => {
  getItem(teddiesUrl, itemsType[0], itemsOptions[0]);
});

camButton.addEventListener("click", (e) => {
  getItem(camUrl, itemsType[1], itemsOptions[1]);
});

oakButton.addEventListener("click", (e) => {
  getItem(oakUrl, itemsType[2], itemsOptions[2]);
});
