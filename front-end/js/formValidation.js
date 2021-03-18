//----------------------------------GESTION DU FORMULAIRE DE COMMANDE-----------------------------------//

const formInput = document.getElementsByTagName("input"); // tous les input du formulaire
const infos = JSON.parse(localStorage.getItem("contact")); // récupération des informations de l'utilisateur (si elles existent, sinon vaut null)
if (infos) {
  //si les informations de l'utilisateur existent
  //On remplis les champs du formulaire par ces infos
  formInput["lastName"].value = infos.lastName;
  formInput["firstName"].value = infos.firstName;
  formInput["email"].value = infos.email;
  formInput["address"].value = infos.address;
  formInput["city"].value = infos.city;
}
//déclaration des RegEx
const regText = /^[a-zA-Zâäàêëéèîïôöœûü-\s]+$/;
const regMail = /^[\w\.-]+@[\w-]+\.[a-zA-Z]{1,3}$/;
const regAddress = /^[a-zA-Z\s0-9âäàêëéèîïôöœûü-]+$/;
//pour chaque champs du formulaire
for (let i = 0; i < formInput.length; i++) {
  const input = formInput[i];
  //je déclare la fonction qui va tester les champs
  function isValid() {
    //je controle ce que doit contenir le formulaire
    if (input.id == ["address"]) {
      //si c'est une adresse que l'on attend
      if (input.value == "" || regAddress.test(input.value) == false) {
        //si le champ est vide ou ne passe pas le test de la regEx
        input.className = "invalid"; //je lui donne une classe "invalid" qui met la bordure du champ en rouge
      } else {
        //si le champ est remplis correctement
        input.className = "valid"; //je lui donne une classe "valid" qui met la bordure du champ en vert
      }
    } else if (input.id == ["email"]) {
      //si c'est un mail qu'on attend
      if (input.value == "" || regMail.test(input.value) == false) {
        input.className = "invalid";
      } else {
        input.className = "valid";
      }
    } else {
      //pour les autres champs
      if (input.value == "" || regText.test(input.value) == false) {
        input.className = "invalid";
      } else {
        input.className = "valid";
      }
    }
  }
  //je teste les champs
  isValid();
  //à la saisie dans le champ
  input.addEventListener("input", (e) => {
    isValid(); //je teste le champ
  });
}
