const canvas = document.getElementById('tetris');
const context = canvas.getContext("2d");

// Variáveis globais para usar no jogo
let tabuleiro = [];  // Criando o tabuleiro do Tetris
let pecaAtual;  // Peça sendo controlada atualmente
let atualX;
let atualY;
let derrota;
let travado;  // Bool para verificar se a peça está presa no fundo
let tabuleiroInvertido = false;  // true => peças sobem; false => peças descem
let intervaloTick;
let intervaloDesenhoPeca;


// TAMANHO PADRÃO INICIAL (20x10)
TAMANHOBLOCO = 20;  // Tamanho de cada bloquinho
canvas.height = 400;
canvas.width = 200;
LINHAS = Math.floor(canvas.height / TAMANHOBLOCO);
COLUNAS = Math.floor(canvas.width / TAMANHOBLOCO);
window.onload = gerarTab();  // Gerar tabuleiro ao iniciar a página


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
    criarMatrizTab();

    // Adicionando cor e borda aos bloquinhos
    for(let l=0; l<LINHAS; l++) {
        for(let c=0; c<COLUNAS; c++) {
            desenharBloco(c, l, "black", context);
        }
    }
}

function criarMatrizTab() {  // Função que cria a matriz vazia do tabuleiro
    // Gerando cada bloquinho
    for(let l=0; l<LINHAS; l++) {
        tabuleiro[l] = [];
        for(let c=0; c<COLUNAS; c++) {
            tabuleiro[l][c] = 0;  // Criando blocos vazios
        }
    }
}

function alterarTamanho() {  // Função para alterar o tamanho do tabuleiro
    const redimensao = document.getElementById("redimensao");

    if(TAMANHOBLOCO == 20) {
        TAMANHOBLOCO = 10;
        canvas.width = 220;
        canvas.height = 440;

        redimensao.innerHTML = "Mudar para 20 x 10";

    } else {
        TAMANHOBLOCO = 20;
        canvas.width = 200;
        canvas.height = 400;
        
        redimensao.innerHTML = "Mudar para 44 x 22";
        
    }
    LINHAS = Math.floor(canvas.height / TAMANHOBLOCO);
    COLUNAS = Math.floor(canvas.width / TAMANHOBLOCO);

    gerarTab();
}


/* **************************************************************
***** GERAR ASSETS PARA O JOGO (PEÇAS E DESENHOS DAS PEÇAS) *****
************************************************************** */

const Pecas = {  // Informações sobre formato e cor das peças  
    formatos: [
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
    cores: [
        "cyan", "yellow", "orange", "blue", "purple", "green", "red"
    ]
};

function desenharBloco(col, lin, corBloco, context) {  // função pra desenhar cada bloco
    context.fillStyle = corBloco;  // Cor da parte de dentro do bloco
    context.fillRect(col * TAMANHOBLOCO, lin * TAMANHOBLOCO, TAMANHOBLOCO, TAMANHOBLOCO);
    context.strokeStyle = "#696969"; // Cor das bordas de cada bloco
    context.strokeRect(col * TAMANHOBLOCO, lin * TAMANHOBLOCO, TAMANHOBLOCO, TAMANHOBLOCO);
}

function desenharPeca() {  // Função q será chamada a cada vez que a peça descer um bloco
    context.clearRect(0, 0, canvas.width, canvas.height);  // Apagando o tabuleiro

    for(let x=0; x<COLUNAS; ++x) {
        for(let y=0; y<LINHAS; ++y) {
            if(tabuleiro[y][x]) {
                desenharBloco(x, y, Pecas.cores[tabuleiro[y][x] - 1], context);
            }
        }
    }

    for(let y=0; y<4; ++y) {
        for(let x=0; x<4; ++x) {
            if(pecaAtual[y][x]) {
                desenharBloco(atualX+x, atualY+y, Pecas.cores[pecaAtual[y][x] - 1], context);
            }
        }
    }
}

function novaPeca() {  // Escolhe uma peça aleatória e define posição de spawn dela
    let id = Math.floor(Math.random() * Pecas.formatos.length);  // Gerar um índice aleatório para pegar um formato de peça
    let formato = Pecas.formatos[id];

    pecaAtual = [];
    for(let y=0; y<4; ++y) {
        pecaAtual[y] = [];
        for(let x=0; x<4; ++x) {
            let i = 4 * y + x;
            if(typeof formato[i] != 'undefined' && formato[i]) { // Verificar se existe aquele formato
                pecaAtual[y][x] = id + 1;
            } else {
                pecaAtual[y][x] = 0;
            }
        }
    }
    
    travado = false;
    // Local onde as peças irão surgir
    if(TAMANHOBLOCO == 20) {
        atualX = 5;
        atualY = 0;
    } else {
        atualX = 11;
        atualY = 0;
    }
}

function rotacionar(pecaAtual) {  // Rotaciona a peça em sentido anti-horário
    let novoAtual = [];
    for(let y=0; y<4; ++y) {
        novoAtual[y] = [];
        for(let x=0; x<4; ++x) {
            novoAtual[y][x] = pecaAtual[3-x][y];
        }
    }

    return novoAtual;
}


/* **************************************************************
********************* MOVIMENTAÇÃO DAS PEÇAS ********************
************************************************************** */

document.addEventListener("keydown", controle);  // Espera uma tecla sem valor (setas) ser pressionada no jogo

function controle(event) {  // Função que atribui os movimentos das setas
    if(event.key === "ArrowLeft") {  // Seta esquerda
        if(movimentoValido(-1)) {
            --atualX;
        }
    } else if(event.key === "ArrowRight") {  // Seta direita
        if(movimentoValido(1)) {
            ++atualX;
        }
    } else if(event.key === "ArrowDown") {  // Seta baixo
        if(!tabuleiroInvertido) {  // Tabuleiro comum
            while(movimentoValido(0, 1)) {  // Pra poder mover a peça até o final
                ++atualY;
            }  
        } else {
            var rotacionado = rotacionar(pecaAtual);
            if(movimentoValido(0, 0, rotacionado)) {
                pecaAtual = rotacionado;
            }
        }
    } else if(event.key === "ArrowUp") {  // Seta cima
        if(tabuleiroInvertido) {  // Tabuleiro invertido
            while(movimentoValido(0, -1)) {  // Pra poder mover a peça até o final
                --atualY;
            }        
        } else {
            var rotacionado = rotacionar(pecaAtual);
            if(movimentoValido(0, 0, rotacionado)) {
                pecaAtual = rotacionado;
            }
        }
    }
}


/* **************************************************************
************ REGRAS DE JOGO E GERENCIAMENTO DA PARTIDA **********
************************************************************** */

function movimentoValido(proxX, proxY, novoAtual ) {  // Verifica se a próxima posição da peça é válida
    // Operadores || nas variáveis significa que caso o primeiro valor seja false, o segundo valor será atribuído
    proxX = proxX || 0;
    proxY = proxY || 0;
    proxX = atualX + proxX;
    proxY = atualY + proxY;
    novoAtual = novoAtual || pecaAtual;

    for(let y=0; y<4; ++y) {
        for(let x=0; x<4; ++x) {
            if(novoAtual[y][x]) {
                if(typeof tabuleiro[y+proxY] == 'undefined' || typeof tabuleiro[y+proxY][x+proxX] == 'undefined'
                  || y+proxY >= canvas.width || x+proxX >= canvas.height
                  || tabuleiro[y+proxY][x+proxX]
                  || x+proxX < 0) {
                    if(proxY == 1 && travado) {  // Peça presa na primeira linha
                        derrota = true; 
                    } 
                    return false;
                }
            }
        }
    }
    return true;
}

function tick() {  // Mantém a peça movendo pra baixo/cima
    if(!tabuleiroInvertido) {
        if(movimentoValido(0, 1)) {
            ++atualY;
        } else {
            travarPeca();
            movimentoValido(0, 1);
            apagarLinhaPreenchida();
            if(derrota) {
                resetIntervalos();
                return false;
            }
            novaPeca();
        }
    } else {
        if(movimentoValido(0, -1)) {
            --atualY;
        } else {
            travarPeca();
            movimentoValido(0, -1);
            apagarLinhaPreenchida();
            if(derrota) {
                resetIntervalos();
                return false;
            }
            novaPeca();
        }
    }
}

function travarPeca() {  // Trava a peça no tabuleiro ao final do movimento
    for(let y=0; y<4; ++y) {
        for(let x=0; x<4; ++x) {
            if(pecaAtual[y][x]) {
                tabuleiro[y+atualY][x+atualX] = pecaAtual[y][x];
            }
        }
    }
    travado = true;
}

function apagarLinhaPreenchida() {  // Verifica se alguma linha está preenchida e apaga se estiver
    for(let y=canvas.width-1; y>=0; --y) {
        let linhaPreenchida = true;
        for(let x=0; x<canvas.height; ++x) {
            if (tabuleiro[y][x] == 0) {  // Bloco vazio
                linhaPreenchida = false;
                break;
            }
        }
        if(linhaPreenchida) {
            for(let y2=y; y2>0; --y2) {
                for(let x=0; x<canvas.height; ++x) {
                    tabuleiro[y2][x] = tabuleiro[y2-1][x];
                }
            }
            ++y;
        }
    }
}

function resetIntervalos(){  // Reseta os intervalos criados no jogo
    clearInterval(intervaloTick);
    clearInterval(intervaloDesenhoPeca);
}

function iniciar() {
    resetIntervalos();
    intervaloDesenhoPeca = setInterval(desenharPeca, 3);
    criarMatrizTab();
    novaPeca();
    derrota = false;
    intervaloTick = setInterval(tick, 400);
}

function pausar() {

}

function parar() {

}