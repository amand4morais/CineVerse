/* ===============================
   LOCAL STORAGE – FAVORITOS
================================ */
function getFavoritosSalvos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function salvarFavoritos(favoritos) {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

/* ===============================
   ELEMENTOS GERAIS
================================ */
const inputPesquisa = document.getElementById("pesquisa");
const cards = document.querySelectorAll(".card-serie");
const filtros = document.querySelectorAll(".filtro");
const msgNenhumResultado = document.getElementById("nenhum-resultado");

/* ===============================
   CARROSSEL PRINCIPAL
================================ */
const carrossel = document.querySelector(".carrossel");
const setaDireita = document.querySelector(".seta-direita");
const setaEsquerda = document.querySelector(".seta-esquerda");
const scrollAmount = 300;

setaDireita.addEventListener("click", () => {
    carrossel.scrollLeft += scrollAmount;
});

setaEsquerda.addEventListener("click", () => {
    carrossel.scrollLeft -= scrollAmount;
});

/* ===============================
   CONTROLE DAS SETAS (PRINCIPAL)
================================ */
function atualizarSetasPrincipal() {
    const cardsVisiveis = Array.from(cards).filter(
        card => card.style.display !== "none"
    );

    if (cardsVisiveis.length === 0) {
        setaDireita.style.display = "none";
        setaEsquerda.style.display = "none";
    } else {
        setaDireita.style.display = "flex";
        setaEsquerda.style.display = "flex";
    }
}

/* ===============================
   PESQUISA
================================ */
inputPesquisa.addEventListener("input", () => {
    const texto = inputPesquisa.value.toLowerCase();
    let encontrou = false;

    cards.forEach(card => {
        const titulo = card.querySelector("h3").innerText.toLowerCase();
        const genero = card.dataset.genero.toLowerCase();

        if (titulo.includes(texto) || genero.includes(texto)) {
            card.style.display = "block";
            encontrou = true;
        } else {
            card.style.display = "none";
        }
    });

    msgNenhumResultado.style.display = encontrou ? "none" : "block";
    atualizarSetasPrincipal();
});

/* ===============================
   FILTROS POR GÊNERO
================================ */
filtros.forEach(botao => {
    botao.addEventListener("click", () => {
        const generoSelecionado = botao.dataset.filtro.toLowerCase();
        inputPesquisa.value = "";
        let encontrou = false;

        cards.forEach(card => {
            const genero = card.dataset.genero.toLowerCase();

            if (generoSelecionado === "todos" || genero.includes(generoSelecionado)) {
                card.style.display = "block";
                encontrou = true;
            } else {
                card.style.display = "none";
            }
        });

        msgNenhumResultado.style.display = encontrou ? "none" : "block";
        atualizarSetasPrincipal();
    });
});

/* ===============================
   MODAL DAS SÉRIES
================================ */
const modal = document.getElementById("modal-serie");
const modalImgBackground = document.querySelector(".modal-background");
const modalTitulo = document.getElementById("modal-titulo");
const modalSinopse = document.getElementById("modal-sinopse");
const btnFechar = document.getElementById("fechar-modal");
const btnTrailer = document.getElementById("btn-trailer");

cards.forEach(card => {
    card.addEventListener("click", () => {
        const imagemSrc = card.querySelector("img").src;
        const titulo = card.querySelector("h3").innerText;
        const descricao = card.querySelector(".descricao").innerText;
        const linkTrailer = card.dataset.link || "#";

        modalImgBackground.style.backgroundImage = `url('${imagemSrc}')`;
        modalTitulo.innerText = titulo;
        modalSinopse.innerText = descricao;
        btnTrailer.href = linkTrailer;

        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    });
});

btnFechar.addEventListener("click", fecharModal);

window.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
});

function fecharModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

/* ===============================
   FAVORITOS
================================ */
const botoesFavorito = document.querySelectorAll(".btn-fav");
const carrosselFavoritos = document.getElementById("carrossel-favoritos");
const msgSemFavoritos = document.getElementById("msg-sem-favoritos");

botoesFavorito.forEach(botao => {
    botao.addEventListener("click", (event) => {
        event.stopPropagation();

        const card = botao.closest(".card-serie");
        const id = card.dataset.id;

        let favoritos = getFavoritosSalvos();

        if (botao.classList.contains("favorito")) {
            botao.classList.remove("favorito");
            favoritos = favoritos.filter(favId => favId !== id);

            const cardFavorito = carrosselFavoritos.querySelector(
                `.card-serie[data-id="${id}"]`
            );
            if (cardFavorito) cardFavorito.remove();

        } else {
            botao.classList.add("favorito");
            animarPop(botao);
            favoritos.push(id);

            const clone = card.cloneNode(true);
            clone.querySelector(".btn-fav").remove();
            carrosselFavoritos.appendChild(clone);
        }

        salvarFavoritos(favoritos);
        atualizarUIFavoritos();
    });
});

function animarPop(botao) {
    botao.classList.add("pop");
    setTimeout(() => botao.classList.remove("pop"), 350);
}

function atualizarMensagemFavoritos() {
    msgSemFavoritos.style.display =
        carrosselFavoritos.children.length === 0 ? "block" : "none";
}

/* ===============================
   SETAS DOS FAVORITOS
================================ */
const favDireita = document.querySelector(".fav-direita");
const favEsquerda = document.querySelector(".fav-esquerda");

favDireita.addEventListener("click", () => {
    carrosselFavoritos.scrollLeft += scrollAmount;
});

favEsquerda.addEventListener("click", () => {
    carrosselFavoritos.scrollLeft -= scrollAmount;
});

function atualizarSetasFavoritos() {
    if (carrosselFavoritos.children.length === 0) {
        favDireita.style.display = "none";
        favEsquerda.style.display = "none";
    } else {
        favDireita.style.display = "flex";
        favEsquerda.style.display = "flex";
    }
}

/* ===============================
   ATUALIZA UI FAVORITOS
================================ */
function atualizarUIFavoritos() {
    atualizarMensagemFavoritos();
    atualizarSetasFavoritos();
}

/* ===============================
   CARREGAR FAVORITOS SALVOS
================================ */
function carregarFavoritosSalvos() {
    const favoritos = getFavoritosSalvos();

    favoritos.forEach(id => {
        const cardOriginal = document.querySelector(
            `.card-serie[data-id="${id}"]`
        );
        if (!cardOriginal) return;

        const botaoFav = cardOriginal.querySelector(".btn-fav");
        botaoFav.classList.add("favorito");

        const clone = cardOriginal.cloneNode(true);
        clone.querySelector(".btn-fav").remove();
        carrosselFavoritos.appendChild(clone);
    });

    atualizarUIFavoritos();
}

/* ===============================
   INICIALIZAÇÃO
================================ */
carregarFavoritosSalvos();
atualizarSetasPrincipal();


const anoAtual = new Date().getFullYear();
document.getElementById("ano-atual").textContent = anoAtual;


