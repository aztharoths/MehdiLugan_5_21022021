// récupération du type de l'item (se trouvant dans l'url)
const itemType = new URLSearchParams(window.location.search).get("type");

// récupération de l'id de l'item (se trouvant dans l'url)
const idItem = new URLSearchParams(window.location.search).get("id");

//zone d'affichage du nom

const displayItemName = document.querySelector("#displayItemName");

// Zone de création
const displayItem = document.querySelector("#displayItem");

//création d'une carte pour l'item
const addItem = (itemUrlImg, itemName, itemDescription) => {
  // Modele de la carte
  const addItem = `<figure class="item-list__item">
  <img src="${itemUrlImg}" alt="" class="item-list__item__img" />
  <figcaption class="item-list__item__desc">
    <h2 class="item-list__item__desc__heading">${itemName}</h2>
    <p class="item-list__item__desc__txt">${itemDescription}</p>
    <p class="item-list__item__desc__btn btn" href="">
      Ajouter au Panier
    </p>
  </figcaption>
  </figure>`;
  // insertion du modele dans la zone de création
  displayItem.insertAdjacentHTML("beforeend", addItem);
};

const getItem = (type) => {
  fetch("http://localhost:3000/api/" + type).then(async (response) => {
    try {
      const itemsList = await response.json();
      console.log(itemsList);
      const item = itemsList.find(
        (itemSearched) => itemSearched._id === idItem
      );
      displayItemName.innerHTML = item.name;
      addItem(item.imageUrl, item.name, item.description);
    } catch (e) {
      console.log(e);
    }
  });
};
getItem(itemType);
