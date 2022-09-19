// déclaration url de la page courante confirmation
let urlconfirme = window.location.href;

// declaration id pour récupérer id dans le url
let id = "";

// declaration de id order
let orderId = document.getElementById('orderId');

// declaration object URL à partir de l'url de la page
let url = new URL(urlconfirme);

// Déclaration recherche paramétre id dans le url page confirmation
let search_params = new URLSearchParams(url.search); 

// recherche si existe un id dans le url de la page confirmation, si oui attribution id
if(search_params.has('id')) {
    id = search_params.get('id');
    orderId.innerText = id;
}else{
    orderId.innerText = "";
    //rediriger sur page du panier si id du numero de commande n'existe pas
    window.location.href ="cart.html"
}
