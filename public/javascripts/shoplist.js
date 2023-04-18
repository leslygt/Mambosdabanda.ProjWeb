
window.onload = async function () {
    try{
        let slId = sessionStorage.getItem("shoplistId");
        let res = await requestUserShoplist(slId);
        if (!res.successful) throw {msg:"Something went wrong"};
        let shoplist = res.shoplist;
        document.getElementById("name").textContent = shoplist.name;
        // TODO
        populateItems(res.shoplist.items);
        res = await requestProducts(); 
        populateProducts(res.products);
    } catch(err) {
        console.log(err);
    }
}

function populateProducts(prods) {
    let container = document.getElementById("prodId");
    for (let prod of prods) {
        let op = document.createElement("option");
        op.value = prod.id;
        op.textContent = prod.name;
        container.appendChild(op);
    }
}
function populateItems(items) {
    let container = document.getElementById("items");
    for (let it of items) {
        let li = document.createElement("li");
        let img = document.createElement("img");
        if (it.img) {
            img.src = it.img;
        } else {
            img.src = "/images/no-image.png";
        }   
        li.appendChild(img);
        let sec = document.createElement("section");
        li.appendChild(sec);
        // For the section
        let name = document.createElement("h3");
        name.textContent = it.name;
        sec.appendChild(name);
        let quantity = document.createElement("p");
        quantity.textContent = `Quantity: ${it.bought} / ${it.quant}`;
        sec.appendChild(quantity);
        container.appendChild(li);
    }
}

async function addItem() {
    let slId = sessionStorage.getItem("shoplistId");
    let prodId = parseInt(document.getElementById("prodId").value);
    let quant = parseFloat(document.getElementById("quant").value);
    let res = await requestAddItem(slId,prodId,quant,2);
    if (res.successful) {
        let container = document.getElementById("items");
        // Incorrect, should not user innerHTML (TODO)
        container.innerHTML = "";      
        res = await requestUserShoplist(slId);
        populateItems(res.shoplist.items);
        alert("Inserted!");
    } else {
        alert("Error!");
    }
} 