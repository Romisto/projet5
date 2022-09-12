// fonction espace en milliers des nombres
function nombreEspace(nr) {
	return nr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

//  declaration panier en local
let objpanier = localStorage.getItem("cart");
let cartJson = JSON.parse(objpanier);
console.log(cartJson);

//  declaration des variables de la page panier
let cartitems = document.getElementById('cart__items');
// total montant
let totalPrice = document.getElementById('totalPrice');
// total quantité
let totalQuantity = document.getElementById('totalQuantity');
 // div montant total
let cart__price = document.querySelector('.cart__price');
// div formulaire commande
let cart__order = document.querySelector('.cart__order');

// fonction de récupération prix du produit
async function prixProduit(idprod) {
   let urlprod = "http://localhost:3000/api/products/"+idprod;
   try {
      let res = await fetch(urlprod);
      return await res.json();  
  } catch (error) {
      console.log(error);
  }
}

// fonction calcul du montant et la quantité total du panier
async function totalPanier() {
   let totalmontant = 0;
   let totalqte = 0;
  // Vérification du panier, si existe affichage des montants
  if (objpanier != null) {

     // parcourir le panier et calcule du montant total
        
     for (let i in cartJson) {
      let produit = await prixProduit(cartJson[i]['idproduit']);
      let montant = Number(produit.price) * Number(cartJson[i]['qte'])
      totalmontant += montant;
      totalqte += Number(cartJson[i]['qte']);
     }
    
  }
  // retourn les montants
  let montant = {
   'totalmontant': totalmontant,
   'totalqte': totalqte
  }
  return montant; 

}

//fonction afficher panier
 async function afficherPanier() {
   if (objpanier == null || objpanier == "[]") {
      // masquer div total montant et formulaire
      cart__price.style.display = "none";
      cart__order.style.display = "none";

      // création element h4 pour afficher un text
      let h4 = document.createElement('h4');
      h4.innerText = "Panier vide";
      h4.style.textAlign = "center";
      cartitems.appendChild(h4);
     
   } else {
       // convertir notre panier local en json
       for (let j in cartJson) {
       //recuperation du produit
         let produit =  await prixProduit(cartJson[j]['idproduit']);
         
         // creation element de la page panier
         let article = document.createElement('article');
         let cart__item__img = document.createElement('div');
         let img = document.createElement('img');
         let cart__item__content = document.createElement('div');
         let cart__item__content__description = document.createElement('div');
         let h2  = document.createElement('h2');
         let p_couleur = document.createElement('p');
         let p_price = document.createElement('p');
         let cart__item__content__settings = document.createElement('div');
         let cart__item__content__settings__quantity = document.createElement('div');
         let p_qte = document.createElement('p');
         let input = document.createElement('input');
         let cart__item__content__settings__delete = document.createElement('div');
         let p_supprime = document.createElement('p');
            
         // attribue element article
         article.className = "cart__item";
         article.setAttribute('data-id' , cartJson[j]['idproduit']);
         article.setAttribute('data-color' , cartJson[j]['couleur']);

         // attribue element div cart__item__img
         cart__item__img.className = "cart__item__img";
         img.src = produit.imageUrl;
         cart__item__img.appendChild(img)

         // attribue element div cart__item__content
         cart__item__content.className = "cart__item__content";
         cart__item__content__description.className = "cart__item__content__description";
         h2.innerText = produit.name;
         p_couleur.innerText = cartJson[j]['couleur'];
         p_price.innerText = produit.price;
         cart__item__content__description.appendChild(h2);
         cart__item__content__description.appendChild(p_couleur);
         cart__item__content__description.appendChild(p_price);
         cart__item__content.appendChild(cart__item__content__description);

         // attribue element div cart__item__content__settings
         cart__item__content__settings.className = "cart__item__content__settings";
         cart__item__content__settings__quantity.className = "cart__item__content__settings__quantity";
         cart__item__content__settings__delete.className = "cart__item__content__settings__delet";
         p_qte.innerText = "Qté : ";
         input.type = "number";
         input.className = "itemQuantity";
         input.name = "itemQuantity";
         input.value =  cartJson[j]['qte'];
         input.min = 1;
         input.max = 100;
        //
         cart__item__content__settings__quantity.appendChild(p_qte)
         cart__item__content__settings__quantity.appendChild(input)
         cart__item__content__settings.appendChild(cart__item__content__settings__quantity);
         //attribution du bouton supprimé
         p_supprime.innerText = "Supprimer";
         p_supprime.className = "deleteItem";
         cart__item__content__settings__delete.appendChild(p_supprime)
         cart__item__content__settings.appendChild(cart__item__content__settings__delete);

         cart__item__content.appendChild(cart__item__content__settings);

         //mise a jour quantité à partir de notre input
         input.addEventListener('change', function(){
         //recuperation de la quantité saisie
         cartJson[j]['qte'] = Number(this.value);
         //mise à jour de la quantité dans le panier
          localStorage.setItem("cart", JSON.stringify(cartJson));
         //raffraichir la page panier
          window.location.reload();
            
         });

         // supprimer le produit concerné
         p_supprime.addEventListener('click', function(){
            cartJson.splice(j,1);
            localStorage.setItem("cart", JSON.stringify(cartJson));
            window.location.reload();
            })

         article.appendChild(cart__item__img);
         article.appendChild(cart__item__content);
         cartitems.appendChild(article);
         
       }
      const mont = await totalPanier();
      //affectation des valeurs total montant et total panier
      totalPrice.innerText = nombreEspace(mont.totalmontant);
      totalQuantity.innerText = mont.totalqte;
   }
}

afficherPanier();


// ******* FONCTION PASSER COMMANDE *****  //
//declaration des elements du formulaire commande
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('firstName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
const addressErrorMsg = document.getElementById('addressErrorMsg');
const cityErrorMsg = document.getElementById('cityErrorMsg');
const emailErrorMsg = document.getElementById('emailErrorMsg');

// fonction validation
function validate() {
   
   let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   let valider = 0
   //tester notre formulaire
   if( firstName.value == "" ) {
      firstNameErrorMsg.innerText ="Saisir votre prénoms";
      firstName.focus() ;
      valider+=1;
    
   }
   else( firstNameErrorMsg.innerText ="");
   valider = valider;

   if( lastName.value == "" ) {
       lastNameErrorMsg.innerText = "Saisir votre nom";
       lastName.focus() ;
       valider+=1;
       
    }
    else( lastNameErrorMsg.innerText ="" );
    valider = valider;

    if( address.value == "" ) {
      addressErrorMsg.innerText = "Saisir votre adresse";
      address.focus() ;
      valider+=1;
      
   }
   else( addressErrorMsg.innerText ="");
   valider = valider;

   if( city.value == "" ) {
      cityErrorMsg.innerText = "Saisir votre ville";
      city.focus() ;
      valider+=1;
      
   }
   else( cityErrorMsg.innerText ="");
   valider = valider;

   if( email.value == "" ) {
      emailErrorMsg.innerText = "Saisir votre email";
      email.focus() ;
      valider+=1;
          
   }
   else( emailErrorMsg.innerText ="");
   valider = valider;

   if (!email.value.match(mailformat)) {
      emailErrorMsg.innerText = "Saisir une adresse e-mail valide";
      email.focus() ;
      valider+=1;
      
   }
   else( emailErrorMsg.innerText ="");
   valider = valider;
    return valider
}
//declaration du bouton commande
let btncommande = document.getElementById('order');
// fonction sur l'element click du bouton commande

btncommande.addEventListener('click', function(e) {
   e.preventDefault();
  //Appel de la fonction commande
   commande();
  
});

//fonction pour passer la commande
async function commande() {
   // déclaration url api
   let url = "http://localhost:3000/api/products/order";
   // declaration liste commande utilisateur
   let commandes = [];
   
   // appel de la fonction validation formaulaire
   let valide = validate();

   if (valide ==0) {
   //parcours de notre panier
      cartJson.forEach(cart => {
    //ajout de l'id du produit dans la liste commande
      commandes.push(cart['idproduit'])
      });
     //declaration de la variable contact
      let contact = {
         'firstName' : firstName.value,
         'lastName' : lastName.value,
         'address' : address.value,
         'city' : city.value,
         'email' : email.value,
      }
     //declaration de la variable commande
      let commande = {
         "contact": contact,
         'products' : commandes,
      }
     //creation et enregistrement de la commande
      let response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(commande)
      });
      //recuperation du resultat de la commande en json    
      let result = await response.json();
      //recuperation du numero de la commande
      const orderId = result.orderId;

      //pour sauvegarder la commande
/*
      const mont = await totalPanier();
      const resultcommande = {
         contact : result.contact,
         order : result.orderId,
         totalcde: mont.totalmontant
,
      }
      if (commandeproduit == null) {
         commandeproduit = [];
         commandeproduit.push(resultcommande);
         localStorage.setItem("commande", JSON.stringify(commandeproduit));
      }else {
         commandeproduit.push(resultcommande);
         localStorage.setItem("commande", JSON.stringify(commandeproduit));
      }
   */ 
  //supprimer le panier en local  
      localStorage.removeItem('cart');
      // reinitialiser les valeurs du formulaire
      firstName.value = "";
      lastName.value = "";
      address.value = "";
      city.value = "";
      email.value = "";
    //redirection de la page confirmation commande
      window.location.href = "confirmation.html?id="+orderId;
   }

}
