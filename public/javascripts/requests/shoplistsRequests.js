
async function requestUserShoplists() {
    try {
        const response = await fetch(`/api/shoplists/auth`);
        var result = await response.json();
        return { successful: response.status == 200,
                 unauthenticated: response.status == 401,
                 shoplists: result};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}


async function requestUserShoplist(shlId) {
    try {
        const response = await fetch(`/api/shoplists/auth/${shlId}`);
        var result = await response.json();
        return { successful: response.status == 200,
                 unauthenticated: response.status == 401,
                 shoplist: result};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}




async function requestProducts() {
    try {
        const response = await fetch(`/api/products`);
        var result = await response.json();
        return { successful: response.status == 200,
                 products: result};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}

async function requestAddItem(shopListId, prodId, quant, unitId) {
    try {
        const response = await fetch(`/api/shoplists/auth/${shopListId}/items`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          method: "POST",
          body: JSON.stringify({
            prodId: prodId, 
            quant: quant, 
            unitId: unitId
          })
        });
        // We are not checking for errors (considering the GUI is only allowing correct choices)
        // We only need to send if the user registered or not 
        return { successful: response.status == 200};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}



