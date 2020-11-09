const canvas = document.getElementById('tetris');
const context = canvas.getContext("2d");

// TAMANHO PADRÃO INICIAL (20x10)
TAMANHOBLOCO = 20;  // Tamanho de cada bloquinho
canvas.height = 400;
canvas.width = 200;
COLUNAS = canvas.height;
LINHAS = canvas.width;
window.onload = gerarTab();  // Gerar tabuleiro ao iniciar a página


// Variáveis globais para usar no jogo
let tabuleiro = [];  // Criando o tabuleiro do Tetris
let pecaAtual;  // Peça sendo controlada atualmente
let atualX;
let atualY;
let derrota;
let congelado;  // Bool para verificar se a peça está presa no fundo
let tabuleiroInvertido = false;  // true => peças sobem; false => peças descem

// Variáveis dos locais de informação
let tempoPartida = document.getElementById("tempoPartida");
let pontuacao = document.getElementById("pontuacao");
let linhasEliminadas = document.getElementById("linhasEliminadas");
let dificuldade = document.getElementById("dificuldade");


/* **************************************************************
**************** CONTROLE DO TAMANHO DO TABULEIRO ***************
* (SÓ PODEM SER CHAMADOS SE A PARTIDA NÃO ESTIVER EM ANDAMENTO) *
************************************************************** */

function gerarTab() {  // Função que cria o tabuleiro
    LINHA = Math.floor(COLUNAS / TAMANHOBLOCO);
    COLUNA = Math.floor(LINHAS / TAMANHOBLOCO);

    // Gerando cada bloquinho
    for (let l=0; l<LINHA; l++) {
        tabuleiro[l] = [];
        for (let c=0; c<COLUNA; c++) {
            tabuleiro[l][c] = "Black";  // Criando blocos vazios
        }
    }

    // Adicionando cor e borda aos bloquinhos
    for (let l=0; l<LINHA; l++) {
        for (let c=0; c<COLUNA; c++) {
            desenharBloco(c, l, "black", context);
        }
    }
}

function alterarTamanho() {  // Função para alterar o tamanho do tabuleiro
    const redimensao = document.getElementById("redimensao");

    if (TAMANHOBLOCO == 20 && LINHAS == 200 && COLUNAS == 400) {
        TAMANHOBLOCO = 10;
        LINHAS = 220;
        COLUNAS = 420;

        redimensao.innerHTML = "Mudar para 20 x 10";
        
        gerarTab();
    } else {
        TAMANHOBLOCO = 20;
        LINHAS = 200;
        COLUNAS = 400;
        
        redimensao.innerHTML = "Mudar para 44 x 22";

        gerarTab();
    }
}


/* **************************************************************
***** GERAR ASSETS PARA O JOGO (PEÇAS E DESENHOS DAS PEÇAS) *****
************************************************************** */

const Pecas = {  // Informações sobre formato e cor das peças  
    formato: [
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
    ],
    cor: [
        "cyan", "yellow", "orange", "blue", "purple", "green", "red"
    ]
};

function desenharBloco(col, lin, corBloco, context) {  // função pra desenhar cada bloco
    context.fillStyle = corBloco;  // Cor da parte de dentro do bloco
    context.fillRect(col * TAMANHOBLOCO, lin * TAMANHOBLOCO, TAMANHOBLOCO, TAMANHOBLOCO);
    context.strokeStyle = "#696969"; // Cor das bordas do canvas
    context.strokeRect(col * TAMANHOBLOCO, lin * TAMANHOBLOCO, TAMANHOBLOCO, TAMANHOBLOCO);
}

function desenharPeca() {  // Função q será chamada a cada vez que a peça descer um bloco
    context.clearRect(0, 0, LINHAS, COLUNAS);  // Apagando o bloco

    for (let x=0; x<COLUNAS; ++x) {
        for (let y=0; y<LINHAS; ++y) {
            if (tabuleiro[y][x]) {
                desenharBloco(x, y, Pecas.cor[tabuleiro[y][x] - 1], context);
            }
        }
    }

    for (let y=0; y<4; ++y) {
        for (let x=0; x<4; ++x) {
            if (pecaAtual[y][x]) {
                desenharBloco(atualX+x, atualY+y, Pecas.cor[pecaAtual[y][x] - 1], context);
            }
        }
    }
}

function novaPeca() {  // Escolhe uma peça aleatória e define posição de spawn dela
    let id = Math.floor(Math.random() * formatoPecas.length);  // Gerar um índice aleatório para pegar um formato de peça
    let formato = formatoPecas[id]; // O id será usado para pegar a cor da peça

    pecaAtual = [];
    for (let y=0; y<4; ++y) {
        pecaAtual[y] = [];
        for (let x=0; x<4; ++x) {
            let i = 4 * y + x;
            if (typeof formato[i] != 'undefined' && formato[i] ) { // Verificar se existe aquele formato
                pecaAtual[y][x] = id + 1;
            }
            else {
                pecaAtual[y][x] = 0;
            }
        }
    }
    
    congelado = false;
    // Local onde as peças irão surgir
    if(TAMANHOBLOCO == 20) {
        currentX = 5;
        currentY = 0;
    } else {
        currentX = 11;
        currentY = 0;
    }
}

function rotacionar(pecaAtual) {  // Rotaciona a peça em sentido anti-horário
    let novoAtual = [];
    for (let y=0; y<4; ++y) {
        novoAtual[y] = [];
        for (let x=0; x<4; ++x) {
            novoAtual[y][x] = pecaAtual[3-x][y];
        }
    }

    return novoAtual;
}


/* **************************************************************
********************* MOVIMENTAÇÃO DAS PEÇAS ********************
************************************************************** */

getElementById("tetris").addEventListener("keydown", controle);  // Espera uma tecla sem valor (setas) ser pressionada no jogo

// Funcao que move a peça de acordo com o clique
function controle(event) {
    if (event.key === "ArrowLeft") {  // Seta esquerda
        if (movimentoValido(-1)) {
            --atualX;
        }
    } else if (event.key === "ArrowRight") {  // Seta direita
        if (movimentoValido(1)) {
            ++atualX;
        }
    } else if (event.key === "ArrowDown") {  // Seta baixo
        if(!tabuleiroInvertido) {  // Tabuleiro comum
            while(movimentoValido(0, 1)) {
                ++atualY;
            }        
        } else {
            var rotacionado = rotacionar(pecaAtual);
            if (movimentoValido(0, 0, rotacionado)) {
                pecaAtual = rotacionado;
            }
        }
    } else if (event.key === "ArrowUp") {  // Seta cima
        if(tabuleiroInvertido) {  // Tabuleiro invertido
            while(movimentoValido(0, -1)) {
                --atualY;
            }        
        } else {
            var rotacionado = rotacionar(pecaAtual);
            if (movimentoValido(0, 0, rotacionado)) {
                pecaAtual = rotacionado;
            }
        }
    }
}


/* **************************************************************
************ REGRAS DE JOGO E GERENCIAMENTO DA PARTIDA **********
************************************************************** */

function movimentoValido(proxX, proxY, novoAtual ) {
    // Operadores || nas variáveis significa que caso o primeiro valor seja false, o segundo valor será atribuído
    proxX = proxX || 0;
    proxY = proxY || 0;
    proxX = atualX + proxX;
    proxY = atualY + proxY;
    novoAtual = novoAtual || current;

    for (let y=0; y<4; ++y) {
        for (let x=0; x<4; ++x) {
            if (novoAtual[y][x]) {
                if (typeof tabuleiro[y+proxY] == 'undefined' || typeof tabuleiro[y+proxY][x+proxX] == 'undefined'
                  || y+proxY >= LINHAS || x+proxX >= COLUNAS
                  || tabuleiro[y+proxY][x+proxX]
                  || x+proxX < 0) {
                    if (proxY == 1 && freezed) {  // Peça presa na primeira linha
                        derrota = true; 
                    } 
                    return false;
                }
            }
        }
    }
    return true;
}

function iniciar() {

}

function pausar() {

}

function parar() {

}