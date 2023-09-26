//nav bar
class MobileNavbar {
  constructor(mobileMenu, navList, navLinks) {
    this.mobileMenu = document.querySelector(mobileMenu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active";

    this.handleClick = this.handleClick.bind(this);
  }

  animateLinks() {
    this.navLinks.forEach((link, index) => {
      link.style.animation
        ? (link.style.animation = "")
        : (link.style.animation = `navLinkFade 0.5s ease forwards ${
            index / 7 + 0.3
          }s`);
    });
  }

  handleClick() {
    this.navList.classList.toggle(this.activeClass);
    this.mobileMenu.classList.toggle(this.activeClass);
    this.animateLinks();
  }

  addClickEvent() {
    this.mobileMenu.addEventListener("click", this.handleClick);
  }

  init() {
    if (this.mobileMenu) {
      this.addClickEvent();
    }
    return this;
  }
}

const mobileNavbar = new MobileNavbar(
  ".mobile-menu",
  ".nav-list",
  ".nav-list li"
);
mobileNavbar.init();

//fim nav bar

//API
  //variveis
const URL = "http://localhost:3400/clientes";

let modoEdicao = false;

let listaClientes = [];
let tabelaCliente = document.querySelector("table>tbody");

const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementsByClassName('close')[0];
let btnSalvar = document.getElementById('btn-salvar');
let btnCancelar = document.getElementById('btn-cancelar');
let btnADD = document.getElementById('openModalBtn');

class Cliente {
  constructor({ id, email, nome, cpfOuCnpj, telefone, dataCadastro }) {
      this.id = id;
      this.email = email;
      this.nome = nome;
      this.cpfOuCnpj = cpfOuCnpj;
      this.telefone = telefone;
      this.dataCadastro = dataCadastro;
  }
}

let formModal = {
  id: document.getElementById('id'),
  nome: document.getElementById('nome'),
  email: document.getElementById('email'),
  telefone: document.getElementById('telefone'),
  cpf: document.getElementById('cpf'),
  dataCadastro: document.getElementById('dataCadastro')
}

function limparModalCliente(){

  formModal.id.value ="";
  formModal.nome.value = "";
  formModal.cpf.value = "";
  formModal.email.value = "";
  formModal.telefone.value = "";
  formModal.dataCadastro.value = "";
}

  // Obter cliente e exibir na tela
function obterClientes() {
  fetch(URL, {
    method: "GET",
    headers: {
      Authorization: obterToken(),
    },
  })
    .then((response) => response.json())
    .then((clientes) => {
      listaClientes = clientes;
      popularTabela(clientes);
    })
    .catch();
}

function popularTabela(clientes) {
  tabelaCliente.textContent = "";

  clientes.forEach((cliente) => {
    criarLinhaNaTabela(cliente);
  });
}

function criarLinhaNaTabela(cliente) {
  let tr = document.createElement("tr");

  let tdId = document.createElement("td");
  let tdNome = document.createElement("td");
  let tdCPF = document.createElement("td");
  let tdEmail = document.createElement("td");
  let tdTelefone = document.createElement("td");
  let tdDataCadastro = document.createElement("td");
  let tdAcoes = document.createElement("td");

  tdId.textContent = cliente.id;
  tdNome.textContent = cliente.nome;
  tdCPF.textContent = cliente.cpfOuCnpj;
  tdEmail.textContent = cliente.email;
  tdDataCadastro.textContent = new Date(
    cliente.dataCadastro
  ).toLocaleDateString();
  tdTelefone.textContent = cliente.telefone;

  tdAcoes.innerHTML = `<button onclick="editarCliente(${cliente.id}); openModal();" class="btn btn-primary">
                           Editar
                       </button>
                       <button onclick="excluirCliente(${cliente.id})" class="btn btn-danger">
                           Excluir
                       </button>`;

  tr.appendChild(tdId);
  tr.appendChild(tdNome);
  tr.appendChild(tdCPF);
  tr.appendChild(tdEmail);
  tr.appendChild(tdTelefone);
  tr.appendChild(tdDataCadastro);
  tr.appendChild(tdAcoes);

  tabelaCliente.appendChild(tr);
}
  //excluir cliente
function excluirCliente(id) {
  let cliente = listaClientes.find((c) => c.id == id);

  if (confirm("Deseja realmente excluir o cliente " + cliente.nome)) {
    excluirClienteBackEnd(cliente);
  }
}

function excluirClienteBackEnd(cliente) {
  fetch(`${URL}/${cliente.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: obterToken(),
    },
  })
    .then((response) => response.json())
    .then(() => {
      atualizarClienteNaLista(cliente, true);
      modalCliente.hide();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Cliente excluido com sucesso!",
        showConfirmButton: false,
        timer: 2500,
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

  //editar clienet
function editarCliente(id){
  modoEdicao = true;

  let cliente = listaClientes.find(cliente => cliente.id == id);
  
  atualizarModalCliente(cliente);

  openModal();
}

function atualizarModalCliente(cliente){

  formModal.id.value = cliente.id;
  formModal.nome.value = cliente.nome;
  formModal.cpf.value = cliente.cpfOuCnpj;
  formModal.email.value = cliente.email;
  formModal.telefone.value = cliente.telefone;
  formModal.dataCadastro.value = cliente.dataCadastro.substring(0,10);
}

function atualizarClienteNaLista(cliente, removerCliente) {
  let indice = listaClientes.findIndex((c) => c.id == cliente.id);

  removerCliente
    ? listaClientes.splice(indice, 1)
    : listaClientes.splice(indice, 1, cliente);

  popularTabela(listaClientes);
}

function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

openModalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
  if (event.target === modal) {
      closeModal();
  }
});


btnSalvar.addEventListener('click', () => {
  // 1° Capturar os dados do modal
  let cliente = obterClienteDoModal();

  // 2° Se os campos obrigatorios foram preenchidos.
  if(!cliente.cpfOuCnpj || !cliente.email){
      alert("E-mail e CPF são obrigatórios.")
      return;
  }

  // if(modoEdicao){
  //     atualizarClienteBackEnd(cliente);
  // }else{
  //     adicionarClienteBackEnd(cliente);
  // }

  (modoEdicao) ? atualizarClienteBackEnd(cliente) : adicionarClienteBackEnd(cliente);

});

function obterClienteDoModal(){

  return new Cliente({
      id: formModal.id.value,
      email: formModal.email.value,
      nome: formModal.nome.value,
      cpfOuCnpj: formModal.cpf.value,
      telefone: formModal.telefone.value,
      dataCadastro: (formModal.dataCadastro.value) 
              ? new Date(formModal.dataCadastro.value).toISOString()
              : new Date().toISOString()
  });
}

function atualizarClienteBackEnd(cliente){

  fetch(`${URL}/${cliente.id}`, {
      method: "PUT",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': obterToken()
      },
      body : JSON.stringify(cliente)
  })
  .then(response => response.json())
  .then(() => {
      atualizarClienteNaLista(cliente, false);
      closeModal();

      Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cliente atualizado com sucesso!',
          showConfirmButton: false,
          timer: 2500
      });
  })
  .catch(error => {
      console.log(error)
  })
}

function adicionarClienteBackEnd(cliente){

  cliente.dataCadastro = new Date().toISOString();

  fetch(URL, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': obterToken()
      },
      body : JSON.stringify(cliente)
  })
  .then(response => response.json())
  .then(response => {

      let novoCliente = new Cliente(response);
      listaClientes.push(novoCliente);

      popularTabela(listaClientes)

      closeModal();
      Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cliente cadastrado com sucesso!',
          showConfirmButton: false,
          timer: 2500
      });
  })
  .catch(error => {
      console.log(error)
  })
}

btnADD.addEventListener('click', () =>{
  modoEdicao = false;
  limparModalCliente();
  openModal();
});


obterClientes();
