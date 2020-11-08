let tabuleiro = [];  // Criando o tabuleiro do Tetris

const canvas = document.getElementById('tetris');
const context = canvas.getContext("2d");
const redimensa0 = document.getElementById("redimensao");

let tempoPartida = document.getElementById("tempoPartida");
let pontuacao = document.getElementById("pontuacao");
let linhasEliminadas = document.getElementById("linhasEliminadas");
let dificuldade = document.getElementById("dificuldade");

// TAMANHO PADRÃO INICIAL (20x10)
TAMANHOBLOCO = 20;  // Tamanho de cada bloquinho
canvas.height = 400;
canvas.width = 200;
window.onload = gerarTab();  // Gerar tabuleiro ao iniciar a página

function gerarTab() {  // só poderá ser chamado se a partida não estiver em andamento
    LINHA = Math.floor(canvas.height / TAMANHOBLOCO);
    COLUNA = Math.floor(canvas.width / TAMANHOBLOCO);

    // Gerando cada bloquinho
    for (let l=0; l<LINHA; l++) {
        tabuleiro[l] = [];
        for (let c=0; c<COLUNA; c++) {
            tabuleiro[l][c] = "Black";  // Criando blocos vazios
        }
    }

    // Adicionando cor e borda aos bloquinhos
    for (let l = 0; l < LINHA; l++) {
        for (let c = 0; c < COLUNA; c++) {
            desenharBloco(c, l, "black", context);
        }
    }
}

function alterarTamanho() {
    if (TAMANHOBLOCO === 20 && canvas.width === 200 && canvas.height === 400) {
        TAMANHOBLOCO = 10;
        canvas.width = 220;
        canvas.height = 420;

        redimensao.innerHTML = "Mudar para 20 x 10";
        
        gerarTab();
    } else {
        TAMANHOBLOCO = 20;
        canvas.width = 200;
        canvas.height = 400;
        
        redimensao.innerHTML = "Mudar para 44 x 22";

        gerarTab();
    }
}

// função pra desenhar cada bloquinho (é usado para desenhar inclusive os blocos com peças)
function desenharBloco(col, lin, corBloco, context) {
    context.fillStyle = corBloco;
    context.fillRect(col * TAMANHOBLOCO, lin * TAMANHOBLOCO, TAMANHOBLOCO, TAMANHOBLOCO);
    context.strokeStyle = "#696969"; // Cor das bordas do canvas
    context.strokeRect(col * TAMANHOBLOCO, lin * TAMANHOBLOCO, TAMANHOBLOCO, TAMANHOBLOCO);
}


/* ******************************************************
***** GERAR ASSETS PARA O JOGO (PECAS E MOVIMENTOS) *****
****************************************************** */

// criando os formatos das peças  
const formatoPecas = [
    [
        1,1,1,1
    ],
    [
        1,1,0,0,
        1,1
    ],
    [
        1,1,1,0,
        1
    ],
    [
        1,1,1,0,
        0,0,1
    ],
    [
        0,1,0,0,
        1,1,1
    ],
    [
        1,0,1,0,
        1,1,1
    ],
    [
        1,0,0,0
    ]
];

// Os índices das cores são os mesmos dos formatos
const coresPecas = ["cyan", "yellow", "orange", "blue", "purple", "green", "red"];
