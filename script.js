let products = {
    data: [

 
    {category: "照片",image: "Data/PIC-2.jpg"},

    {category: "照片",image: "Data/PIC-2.jpg"},
    {category: "照片",image: "Data/zw-1.mp4"},




    ],
};


for(let i of products.data) {
    //Creare Card
    let card = document.createElement("div");
    //Card should have category
    card.classList.add("card",i.category,"hide");

    //image div
    let imgContainer = document.createElement("div");
    imgContainer.classList.add("image-container");


    //img tag
    let image = document.createElement("img");
    image.setAttribute("src", i.image);
    imgContainer.appendChild(image);
    card.appendChild(imgContainer);

    //container
    let container = document.createElement("div");
    container.classList.add("container");


    card.appendChild(container);
    document.getElementById("products").appendChild(card);
}


function filterProduct(value){
    let buttons = document.querySelectorAll(".button-pro-menu");
    buttons.forEach((button) => {
        if(value.toUpperCase() == button.innerText.toUpperCase()) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });

    let elements = document.querySelectorAll(".card");
    elements.forEach((element) => {
        if(value == "全部"){
            element.classList.remove("hide");
        }
        else{
            if(element.classList.contains(value)){
                element.classList.remove("hide");
            }
            else{
                element.classList.add("hide");
            }
        }
    });
}


window.onload = () => {
    filterProduct("全部");
};
