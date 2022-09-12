// déclaration url de la page courante produit
let urlproduit = window.location.href;

// declaration id pour récupérer id dans le url
let id = "";

// declaration object URL
let url = new URL(urlproduit);

// Déclaration recherche paramétre id dans le url page produit
let search_params = new URLSearchParams(url.search); 

// recherche si existe un id dans le url de la page produit, si oui attribution id
if(search_params.has('id')) {
  id = search_params.get('id');
}


let urlprod = "http://localhost:3000/api/products/"+id;

// declaration des variables de la fiche produit
const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const colors = document.getElementById('colors');
const itemimg = document.querySelector('.item__img');
let quantite = document.getElementById('quantity');
let addcart = document.getElementById('addToCart');


function nombreAvecEspace(nr) {
	return nr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


// fonction pour recupérer un produit de url api
async function getProduit() {
    try {
        let res = await fetch(urlprod);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

// fonction pour afficher le détail d'un produit
async function detailProduit() {
    let produit = await getProduit();

    // affectation des valeurs à la fiche produit
    title.innerText = produit.name;
    price.innerText = nombreAvecEspace(produit.price);
    description.innerText = produit.description;
    produit.colors.forEach(color => {
        // <option value="blanc">blanc</option>
        let option = document.createElement("option");
        option.innerText = color;
        option.value = color;
        colors.appendChild(option);
    });

    // image du produit
    let img = document.createElement("img");
    img.src = produit.imageUrl;
    itemimg.appendChild(img);

}

detailProduit();

// **************  AJOUT DU PANIER   ***********   //

// fonction validation
function validate() {
      
    if( colors.value == "" ) {
       alert( "Choisir la couleur" );
       colors.focus() ;
       return false;
    }
    if( quantite.value == 0 ) {
        alert( "Saisir la quantité" );
        colors.focus() ;
        return false;
     }
     return true
}

function ajoutpanier(idprod,qte,couleur){
    //declaration localstorage panier
    let objpanier = localStorage.getItem("cart");
    let paniers = [];
    
    // affectation des valeurs du panier
    let panierJson = {
        idproduit : idprod,
        qte : Number(qte),
        couleur : couleur
    }
    paniers.push(panierJson)
    let panier = JSON.stringify(paniers);
    // enregistrer le panier en local si nouveau panier
    if (objpanier == null) {    
        localStorage.setItem("cart", panier);
    }else{
        // convertir notre panier local en json
        let cartJson = JSON.parse(objpanier);
        
        let resultat = cartJson.find( cart => cart['idproduit'] === idprod && cart['couleur'] === couleur);
        const indice = cartJson.findIndex(cart => cart['idproduit'] === idprod && cart['couleur'] === couleur);
       
        if (resultat == null) {
            // ajouter le produit si nouveau produit
            console.log("ajout prod");
            cartJson.push(panierJson);
            localStorage.setItem("cart", JSON.stringify(cartJson));
        
        } else {
            // ajouter un produit si meme produit avec une nouvelle couleur
            console.log("mise a jour qte");
            let qteprod =  0;
           // qteprod = cartJson[indice]['qte'];
            qteprod = Number(qte) + Number(cartJson[indice]['qte']);
            cartJson[indice]['qte'] = qteprod;
            localStorage.setItem("cart", JSON.stringify(cartJson));
        }
    }
}

// click sur le bouton ajouter pnier
addcart.addEventListener('click', function(){
  let valide =  validate();
  if (valide) {
   //localStorage.clear();
    ajoutpanier(id, quantite.value, colors.value);
    alert("Ajouter au panier !");

    // reinitialiser la quantié et la couleur après l'ajout au panier
    quantite.value = 0
    colors.value = ""
  }

})
