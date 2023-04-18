async function register() {
    let msgDOM = document.getElementById("msg");
    msgDOM.textContent = "";
    try {
        let email = document.getElementById("nome").value;
        let name = document.getElementById("email").value;
        let pass = document.getElementById("palavraPasse").value;
        let res = await requestRegister(email,name,pass);
        if (res.successful) {
            msgDOM.textContent = "Conta criada com sucesso! Vá para a página de login.";
        } else {
            msgDOM.textContent = "Não foi possível criar a conta.";
        }      
    } catch (err) {
        console.log(err);
        msgDOM.textContent = "Ocorreu um erro ao criar a conta";   
    }
}


