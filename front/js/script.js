//declaration du lien de l'API//
const urlproduct = "http://localhost:3000/api/products";

//declaration de la variable de recuperation de l'id section produit//

let tableitems = document.getElementById("items");

//affichage de la liste//
fetch(urlproduct).then(Response =>{
    return Response.json();
    })
    .then(product =>{
        let articles = "";
    product.forEach(arti => {
        articles += '<a href="./product.html?id='+arti._id+'">'+
        '<article>'+
          '<img src="'+arti.imageUrl+'" alt="'+arti.altTxt+'">'+
          '<h3 class="productName">'+arti.name+'</h3>'+
          '<p class="productDescription">'+arti.description+'.</p>'+
        '</article></a>';
        
    }); 
    tableitems.innerHTML = articles;   
})