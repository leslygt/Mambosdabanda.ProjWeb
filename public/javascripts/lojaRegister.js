async function lojaRegister() {
    let msgDOM = document.getElementById("msg");
    msgDOM.textContent = "";
    try {
        let email = document.getElementById("nome").value;
        let name = document.getElementById("email").value;
        let pass = document.getElementById("palavraPasse").value;
        let endereco = document.getElementById("Endereco").value;
        let cpostal = document.getElementById("palavraPasse").value;
        let contacto = document.getElementById("Contacto").value;
        

        let res = await requestlojaRegister(email,name,pass,endereco,cpostal,contacto);
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