//  declaration panier en local
let objpanier = localStorage.getItem("cart");
let cartJson = JSON.parse(objpanier);

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

/**
 * fonction de récupération prix du produit 
 * @param {*} idprod 
 * @returns { Promise }
 */
async function prixProduit(idprod) {
    let urlprod = "http://localhost:3000/api/products/"+idprod;
    try {
        let res = await fetch(urlprod);
        return await res.json();  
    } catch (error) {
        console.log(error);
    }
}


/**
 * fonction calcul du montant et la quantité total du panier
 * @returns { Object } montant
 * @returns { number } montant.totalPrice - total montant du panier
 * @returns { number } montant.totalQuantity - total quantité du panier
 */
async function totalPanier() {
    let totalmontant = 0;
    let totalqte = 0;
    // Vérification du panier, si existe affichage des montants
    if (objpanier != null) {
        
        // parcourrir le panier et calcule du montant total
        
        for (let i in cartJson) {
            let produit = await prixProduit(cartJson[i]['idproduit']);
            let montant = Number(produit.price) * Number(cartJson[i]['qte']);
            totalmontant += montant;
            totalqte += Number(cartJson[i]['qte']);
        }
        
    }
    // retourner les montants
    let montant = {
        'totalmontant': totalmontant,
        'totalqte': totalqte
    }
    //afficher le prix
    totalPrice.innerText = new Intl.NumberFormat().format(totalmontant);
    totalQuantity.innerText = totalqte;
    return montant;
    
}
/**
 * fonction afficher panier
 */
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
            // recupération du produit
            let produit =  await prixProduit(cartJson[j]['idproduit']);
            
            // création element de la page panier
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
            
            cart__item__content__settings__quantity.appendChild(p_qte)
            cart__item__content__settings__quantity.appendChild(input)
            cart__item__content__settings.appendChild(cart__item__content__settings__quantity);
            
            // attribution bouton supprimer
            p_supprime.innerText = "Supprimer";
            p_supprime.className = "deleteItem";
            cart__item__content__settings__delete.appendChild(p_supprime)
            cart__item__content__settings.appendChild(cart__item__content__settings__delete);
            
            cart__item__content.appendChild(cart__item__content__settings);
                                               
            article.appendChild(cart__item__img);
            article.appendChild(cart__item__content);
            cartitems.appendChild(article);
            
        }
        // affichage total panier 
        await totalPanier();
        
        // fonction modification de la quantité
        modification_quantite();
        
        // fonction suppression d'un produit
        suppression_produit()
    }
}

afficherPanier();

/**
 * fonction qui met à jour la quantité saisie de l'utilisateur dans le panier 
 */
async function modification_quantite() {
    //declaration d'une variable pour selectionner toutes les classes quantités
    let quantites = document.querySelectorAll('.itemQuantity');
    
    quantites.forEach(qte => {
        //prise en compte de la quantité saisie si quantité est comprise entre 1 et 100 sinon affichage alerte       
        qte.addEventListener('change', function(){
            if (this.value <= 0 || this.value > 100){
                return alert("Saisir une quantité comprise entre 1 et 100");
            } else {
                // selection des div par la methode closest
                const setting_qte = qte.closest('.cart__item__content__settings__quantity');
                const article_div = setting_qte.closest('.cart__item');
                
                // recuperation du id produit et couleur produit
                const id = article_div.dataset.id;
                const couleur = article_div.dataset.color;
                
                // rechercher id produit et couleur du produit dans le panier local, si c'est bon faire mise à jour quantité
                let resultat = cartJson.find(cart => cart['idproduit'] === id && cart['couleur'] === couleur);
                const indice = cartJson.findIndex(cart => cart['idproduit'] === id && cart['couleur'] === couleur);
                
                if (resultat != null) {
                    cartJson[indice]['qte'] = Number(this.value);
                    localStorage.setItem("cart", JSON.stringify(cartJson));
                    totalPanier();
                }
                
            }
            
        })
        
    })
    
}

/**
 * fonction suppression produit 
 */
async function suppression_produit() {
    //declarer la fonction qui permet de supprimer un produit dans le panier
    let btn_supprimer = document.querySelectorAll('.deleteItem');
    
    btn_supprimer.forEach(btn => {
        btn.addEventListener('click', function(){
            // selection des div avec la methode closest
            let settings_delete = btn.closest('.cart__item__content__settings');
            //  const content__settings = settings_delete.closest('.cart__item__content__settings');
            const articles_div = settings_delete.closest('.cart__item');
                        
            // declarer le nombre de produits dans le panier
            let totalproduit = Number(cartJson.length);
            
            
            
            // recuperation du id produit et la couleur produit
            const id = articles_div.dataset.id;
            const couleur = articles_div.dataset.color;
            
            // rechercher id produit et couleur du produit dans le panier local, si c'est bon faire la suppression
            let resultat = cartJson.find(cart => cart['idproduit'] === id && cart['couleur'] === couleur);
            const indice = cartJson.findIndex(cart => cart['idproduit'] === id && cart['couleur'] === couleur);
            if (resultat != null) {
                // pour un produit dans le panier lors de la suppression, afficher la mention panier vide
                if (totalproduit == 1) {
                    localStorage.removeItem('cart');
                    //masquer la div article, le formulaire commande et le total montant
                    articles_div.style.display = "none";
                    cart__price.style.display = "none";
                    cart__order.style.display = "none";
                    
                    // création element h4 pour afficher un text
                    let h4 = document.createElement('h4');
                    h4.innerText = "Panier vide";
                    h4.style.textAlign = "center";
                    cartitems.appendChild(h4);
                }  else {
                    cartJson.splice(indice,1);  
                    localStorage.setItem("cart", JSON.stringify(cartJson));
                    articles_div.style.display = "none";
                }
                
            }
            
            totalPanier();
            
        })
        
    })
}




// ******* FONCTION PASSER COMMANDE *****  //
// declaration des éléments du formulaire commande
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
const firstNameError = document.getElementById('firstNameErrorMsg');
const lastNameError = document.getElementById('lastNameErrorMsg');
const adresseError = document.getElementById('addressErrorMsg');
const cityError = document.getElementById('cityErrorMsg');
const emailError = document.getElementById('emailErrorMsg');

/**
 * fonction validation 
 * @returns {void}
 */
function validate() {
    
    // declaration variable mail
    let format_mail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    let lblvalider = 0;

    let format_nom_prenoms = /^[a-zA-Z -]+$/g;
    
    
    if( firstName.value == "" ) {
        firstNameError.innerText = "Saisir votre prénoms";
        firstName.focus();
        
        lblvalider += 1;

        
    } else if (!firstName.value.match(format_nom_prenoms)) {
        firstNameError.innerText = "le prenom doit comporter des chaines de caractere";
        firstName.focus();
        
        lblvalider += 1;
    } else {
        firstNameError.innerText = "";
        lblvalider = lblvalider;
        
    } 

    
    if ( lastName.value == "" ) {
        lastNameError.innerText =  "Saisir votre nom";
        lastName.focus() ;
        lblvalider += 1;

    } else if (!lastName.value.match(format_nom_prenoms)) {
        lastNameError.innerText = "le nom doit comporter des chaines de caractere";
        lastName.focus();
        
        lblvalider += 1; 

    } else {
        lastNameError.innerText = "";
        lblvalider = lblvalider;
    }
    
    if ( address.value == "" ) {
        adresseError.innerText = "Saisir votre adresse";
        address.focus() ;
        lblvalider += 1;
        
    } else {
        adresseError.innerText = "";
        lblvalider = lblvalider;
    }
    
    if ( city.value == "" ) {
        cityError.innerText = "Saisir votre ville";
        city.focus() ;
        lblvalider += 1;
        
    } else {
        cityError.innerText = "";
        lblvalider = lblvalider;
    }
    if ( email.value == "" ) {
        emailError.innerText ="Saisir une adresse e-mail";
        email.focus() ;
        lblvalider += 1;
        
    } else if (!email.value.match(format_mail)) {
        emailError.innerText = "Saisir une adresse e-mail valide";
        email.focus() ;
        lblvalider += 1;
        
    } else {
        emailError.innerText = "";
        lblvalider = lblvalider;
    }
    return lblvalider;
}

// declaration du bouton commande
let btncommande = document.getElementById('order');

// fonction sur click bouton commande
btncommande.addEventListener('click', function(e) {
    // bloquer la soumission du formulaire
    e.preventDefault();
    // appel de la fonction commande
    commande();
    
});


/**
 * fonction pour passer la commande 
 */
async function commande() {
    // déclaration url api
    let url = "http://localhost:3000/api/products/order";
    // declaration liste commande utilisateur
    let commandes = [];
    //let commandeproduit = JSON.parse(localStorage.getItem('commande'));
    // appel de la fonction validation formaulaire
    let valide = validate();
    
    if (valide == 0) {
        
        cartJson.forEach(cart => {
            // ajout du id produit dans la liste commandes
            commandes.push(cart['idproduit'])
        });
        
        // declaration variable contact
        let contact = {
            'firstName' : firstName.value,
            'lastName' : lastName.value,
            'address' : address.value,
            'city' : city.value,
            'email' : email.value,
        }
        // declarataion de la variable commande
        let commande = {
            "contact": contact,
            'products' : commandes,
        }
        // enregistrement de la commande
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(commande)
        });
        
        // recupration du resultat de la commande
        let result = await response.json();
        
        // récupération du numéro de la commande
        const orderId = result.orderId;
       
        localStorage.removeItem('cart');
        // reinitialiser les valeurs du formulaire
        firstName.value = "";
        lastName.value = "";
        address.value = "";
        city.value = "";
        email.value = "";
        // redirection de la page confirmation commande
        window.location.href = "confirmation.html?id="+orderId;
    }
    
}
