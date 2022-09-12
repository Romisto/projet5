//Recuperation des produits de l'Api
let urlliste = "http://localhost:3000/api/products";

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

//  fonction affiche la liste des produits
async function afficheProduits() {
  let produits = await getProduits();
  let html = '';
  produits.forEach(arti => {
    let a = createNode('a');
    let article = createNode('article');
    let img = createNode('img');
    let h3 = createNode('h3');
    let p = createNode('p');
    img.src = arti.imageUrl;
    h3.innerText = `${arti.name}`;
    p.innerText = arti.description;
    a.href = "./product.html?id="+arti._id;
    ajoutelement(article, img);
    ajoutelement(article, h3);
    ajoutelement(article, p);
    ajoutelement(a, article);
    tabitems.appendChild(a);
  });
}

afficheProduits();