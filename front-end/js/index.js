// Zone de création
const displayItemList = document.querySelector("#itemList");

const teddyButton = document.getElementById("teddyButton");
const camButton = document.querySelector("#camButton");
const oakButton = document.querySelector("#oakButton");

const url = ["teddies", "cameras", "furniture"];

teddyButton.addEventListener("click", (e) => {
  getItem(url[0]);
});

camButton.addEventListener("click", (e) => {
  getItem(url[1]);
});

oakButton.addEventListener("click", (e) => {
  getItem(url[2]);
});

window.onload = getItem(url[0]);

//création d'une carte pour un item
const addItem = (type, item_id, itemUrlImg, itemName, itemDescription) => {
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
                href="./front-end/pages/produit.html?type=${type}&id=${item_id}"
                >Voir le produit</a
              >
            </figcaption>
          </figure>`;
  // insertion du modele dans la zone de création
  displayItemList.insertAdjacentHTML("beforeend", addItem);
};

// récupération des informations et création des cartes
async function getItem(url) {
  try {
    //j'attend la réponse du server
    const response = await fetch("http://localhost:3000/api/" + url);
    try {
      //je transforme la réponse en format json
      const itemsList = await response.json();
      // Je supprime le contenu de la zone de création de cartes
      displayItemList.innerHTML = "";
      //création d'autant de cartes que d'items trouvés dans le tableau
      for (i = 0; i < itemsList.length; i++) {
        addItem(
          url,
          itemsList[i]._id,
          itemsList[i].imageUrl,
          itemsList[i].name,
          itemsList[i].description
        );
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
}
