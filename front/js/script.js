//déclaration de l'url des produits de l'Api
let urlliste = "http://localhost:3000/api/products";

//declaration de l'id de la page index
let tabitems = document.getElementById('items');

// fonction créer un element
function createNode(element) {
    return document.createElement(element);
}

// fonction ajouter element dans un element parent
function ajoutelement(parent, el) {
    return parent.appendChild(el);
}

// fonction pour recupérer la liste produits a partir de url api
async function getProduits() {
    try {
        let res = await fetch(urlliste);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

//  fonction affiche la liste des produits dans la page index
async function afficheProduits() {
    
    //declaration liste des produits recupérés    
    let produits = await getProduits();
    
    //parcourir chaque ligne de produits
    produits.forEach(arti => {
        //creation des elements de la page index  
        let a = createNode('a');
        let article = createNode('article');
        let img = createNode('img');
        let h3 = createNode('h3');
        let p = createNode('p');
        //attribution de l'image à l'element img
        img.src = arti.imageUrl;
        //affichage du titre du produit
        h3.innerText = `${arti.name}`;
        //affichage de la description du produit
        p.innerText = arti.description;
        //attribution du lien du bouton affichez produit
        a.href = "./product.html?id="+arti._id;
        //fonction pour ajouter les elements de la page index dans les elements parents
        ajoutelement(article, img);
        ajoutelement(article, h3);
        ajoutelement(article, p);
        ajoutelement(a, article);
        tabitems.appendChild(a);
    });
}

afficheProduits();