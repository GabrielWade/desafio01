// Capturando os 3 campos da tela.
let email = document.getElementById("email");
let senha = document.getElementById("password");
let btnEntrar = document.getElementById("btn-open");

btnEntrar.addEventListener("click", () => {
  let userEmail = email.value;

  let userSenha = senha.value;

  if (!userEmail || !userSenha) {
    alert("Os campos de e-mail e senha são obrigatórios!");
    return;
  }
  autenticar(userEmail, userSenha);
});

function autenticar(email, senha) {
  const urlBase = `http://localhost:3400`;

  fetch(`${urlBase}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (!!response.mensagem) {
        alert(response.mensagem);
      } else {
        verificaUsuario(response.usuario.perfil.descricao);
      }

      salvarToken(response.token);
      salvarUsuario(response.usuario);
    });
}
