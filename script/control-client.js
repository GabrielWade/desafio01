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

const URL = "http://localhost:3400/clientes";

let listaClientes = [];
let tabelaCliente = document.querySelector("table>tbody");

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

  tdAcoes.innerHTML = `<button onclick="editarCliente(${cliente.id})" class="btn btn-primary">
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

function editarCliente() {}

function atualizarClienteNaLista(cliente, removerCliente) {
  let indice = listaClientes.findIndex((c) => c.id == cliente.id);

  removerCliente
    ? listaClientes.splice(indice, 1)
    : listaClientes.splice(indice, 1, cliente);

  popularTabela(listaClientes);
}

obterClientes();
