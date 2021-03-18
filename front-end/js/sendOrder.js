/**
 *
 * const savedItems = JSON.parse(localStorage.getItem("savedItem"));
 * from panier.js
 *
 * const formInput = document.getElementsByTagName("input");
 * from formValidation.js
 *
 **/

//----------------------------------ENVOIS DE LA COMMANDE-----------------------------------//
const formOrder = document.querySelector("#formOrder"); //formulaire html

const testPass = document.getElementsByClassName("valid");

function createContact() {
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
    "contact",
    JSON.stringify(contact)
  );
  return contact;
}

formOrder.addEventListener("submit", (order) => {
  order.preventDefault(); //j'annule l'effet de base du bouton
  let testsToBePassed = formInput.length; //je déclare le nombre de tests à passer grâce au nombre de champs à remplir
  let testPassed = document.getElementsByClassName("valid").length; //je crée une variable qui compte le nombre de RegEx passées
  if (testPassed === testsToBePassed) {
    //si tous les tests sont passés
    let contact = createContact();
    let previewOrder = []; //création d'un tableau pour afficher un aperçu de la commande avant validation
    savedItems.forEach((item) => {
      //remplissage du tableau
      previewOrder.push("\n" + item.name + " X " + item.quantity);
    });
    //affichage du tableau au moment du click
    if (window.confirm("Validez vous cette commande ?" + previewOrder)) {
      //tableau du résumé de la commande
      const orderSummary = [];
      let arrayToFill = 0; //variable qui va vérifier le nombre de tableau attendu dans la commande
      let arrayFilled = 0; //variable qui va compter le nombre de tableau remplis
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
        try {
          let validation = await response.json(); //je récupère la réponse du serveur
          orderSummary.push(validation); //je copie la réponse du serveur dans le tableau "résumé"
          localStorage.setItem("orderSummary", JSON.stringify(orderSummary)); //j'envois le tableau dans le localStorage pour le récupérer dans la page de confirmation
          arrayFilled++; //j'annonce que le tableau à été remplis
        } catch (e) {
          console.log(e);
        }
      }
      //je crée un tableau par type d'objet
      let teddiesOrdered = [];
      let camerasOrdered = [];
      let oakOrdered = [];

      savedItems.forEach((item) => {
        //je controle chaque objet du panier
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
      //je vérifie que le tableau des ours commandés ne soit pas vide
      if (teddiesOrdered.length > 0) {
        // si il n'est pas vide
        arrayToFill++; //j'incrémente ma variable "nombre de tableau attendu"
        let products = teddiesOrdered; //je renomme le tableau en le nom attendu par le serveur
        postOrder("teddies", products); //j'envois la commande
      }
      if (camerasOrdered != "") {
        arrayToFill++;
        let products = camerasOrdered;
        postOrder("cameras", products);
      }
      if (oakOrdered != "") {
        arrayToFill++;
        let products = oakOrdered;
        postOrder("furniture", products);
      }
      const isArraySent = setTimeout(() => {
        //toutes les 0.5 secondes
        if (arrayFilled == arrayToFill) {
          //je vérifie que le nombre de tableaux remplis soit égal au nombre de tableaux attendus
          //lorsque c'est le cas
          localStorage.setItem("orderSummaryPerso", JSON.stringify(savedItems)); //je crée une nouvelle Entrée dans le localStorage pour gérer des informations supplémentaire lors de la page confirmation
          localStorage.removeItem("savedItem"); //je supprime le panier
          clearInterval(isArraySent); //j'arrête l'intervalle
          window.location.href = "./confirmation-commande.html"; //je change de page
        }
      }, 500);
    }
  } else {
    window.alert("Merci de remplir correctement tous les champs du formulaire");
  }
});
