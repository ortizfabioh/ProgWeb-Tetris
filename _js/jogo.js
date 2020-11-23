const canvas = document.getElementById('tetris');
const context = canvas.getContext("2d");

let tabuleiro = [];
let pecaAtual;
let atualX;
let atualY;
let linhasApagadas;
let pontos;
let nivel;
let velocidadeTick = 1000;
let derrota;
let travado;
let iniciado;
let pausado;
let tempo;
let minutos=0;
let segundos=0;
let intervaloTick;
let intervaloDesenhoPeca;
let tabuleiroInvertido;
let pecaEspecial;
let quadrado;

TAMANHOBLOCO = 20;
canvas.height = 400;
canvas.width = 200;
LINHAS = Math.floor(canvas.height / TAMANHOBLOCO);
COLUNAS = Math.floor(canvas.width / TAMANHOBLOCO);
window.onload = gerarTab();

let tempoPartida = document.getElementById("tempoPartida");
let pontuacao = document.getElementById("pontuacao");
let linhasEliminadas = document.getElementById("linhasEliminadas");
let dificuldade = document.getElementById("dificuldade");


function gerarTab() {
    for(let l=0; l<LINHAS; l++) {
        tabuleiro[l] = [];
        for(let c=0; c<COLUNAS; c++) {
            tabuleiro[l][c] = 0;
        }
    }

    for(let l=0; l<LINHAS; l++) {
        for(let c=0; c<COLUNAS; c++) {
            desenharBloco(l, c, "black", context);
        }
    }
    iniciado = false;
    pausado = false;
    tabuleiroInvertido = false;
}

function alterarTamanho() {
    if(!iniciado) {
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

        tabuleiro = [];
        gerarTab();
    } else {
        pausado = true;
        let reiniciar = confirm("Jogo em andamento. Deseja reiniciar o jogo no novo tamanho?");
        if(reiniciar) {
            iniciado = false;
            parar();
            alterarTamanho();
        }
    }
}

const Pecas = {
    formatos: [
        [
            0,0,0,0,
            1,1,1,1,
            0,0,0,0,
            0,0,0,0
        ],
        [
            2,2,0,0,
            2,2,0,0,
            0,0,0,0,
            0,0,0,0
        ],
        [
            0,0,3,0,
            3,3,3,0,
            0,0,0,0,
            0,0,0,0
        ],
        [
            4,0,0,0,
            4,4,4,0,
            0,0,0,0,
            0,0,0,0,
        ],
        [
            0,5,0,0,
            5,5,5,0,
            0,0,0,0,
            0,0,0,0
        ],
        [
            6,0,6,0,
            6,6,6,0,
            0,0,0,0,
            0,0,0,0
        ],
        [
            7,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0
        ]
    ],
    cores: [
        null, "cyan", "yellow", "orange", "blue", "purple", "green", "red"
    ]
};

function desenharBloco(lin, col, corBloco, context) {
    context.fillStyle = corBloco;
    context.fillRect(col * TAMANHOBLOCO, lin * TAMANHOBLOCO, TAMANHOBLOCO, TAMANHOBLOCO);
    context.strokeStyle = "#696969";
    context.strokeRect(col * TAMANHOBLOCO, lin * TAMANHOBLOCO, TAMANHOBLOCO, TAMANHOBLOCO);
}

function desenharPeca() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for(let x=0; x<COLUNAS; ++x) {
        for(let y=0; y<LINHAS; ++y) {
            if(tabuleiro[y][x] == 0) {
                desenharBloco(y, x, "Black", context);
            } else {
                desenharBloco(y, x, Pecas.cores[tabuleiro[y][x]], context);
            }
        }
    }

    for(let y=0; y<4; ++y) {
        for(let x=0; x<4; ++x) {
            if(pecaAtual[y][x]) {
                desenharBloco(atualY+y, atualX+x, Pecas.cores[pecaAtual[y][x]], context);
            }
        }
    }
}

function rotacionar(pecaAtual) {
    if(!quadrado) {
        var novoAtual = [];

        for(var y=0; y<4; ++y) {
            novoAtual[y] = [];
            for(var x=0; x<4; ++x) {
                novoAtual[y][x] = pecaAtual[3-x][y];
            }
        }
        return novoAtual;
    } else {
        return pecaAtual;
    }
}

function novaPeca() {
    let id = Math.floor(Math.random() * Pecas.formatos.length);
    let formato = Pecas.formatos[id];

    quadrado = (id == 1 || id == 6) ? true : false;
    pecaEspecial = (id == 6) ? true : false;

    pecaAtual = [];
    for(let y=0; y<4; ++y) {
        pecaAtual[y] = [];
        for(let x=0; x<4; ++x) {
            let i = 4 * y + x;
            if(typeof formato[i] != 'undefined' && formato[i]) {
                pecaAtual[y][x] = id + 1;
            } else {
                pecaAtual[y][x] = 0;
            }
        }
    }

    travado = false;
    atualX = (TAMANHOBLOCO == 20) ? 4 : 9;
    atualY = (!tabuleiroInvertido) ? 0 : LINHAS-2;
}

function movimentoValido(proxX, proxY, novoAtual) {
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
                    if(!tabuleiroInvertido) {
                        if(proxY == 1 && travado) {
                            derrota = true;
                        }
                    } else {
                        if(proxY == LINHAS-2 && travado) {
                            derrota = true;
                        }
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

function tick() {
    if(!pausado) {
        if(!tabuleiroInvertido) {
            if(movimentoValido(0, 1)) {
            ++atualY;
            } else {
                travarPeca();
                movimentoValido(0, 1);
                apagarLinhaPreenchida();
                if(derrota) {
                    resetInterval();
                    gameOver();
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
                    resetInterval();
                    gameOver();
                }
                novaPeca();
            }
        }
    }
}

function travarPeca() {
    for(let y=0; y<4; ++y) {
        for(let x=0; x<4; ++x) {
            if(pecaAtual[y][x]) {
                tabuleiro[y+atualY][x+atualX] = pecaAtual[y][x];
            }
        }
    }
    travado = true;
}

function apagarLinhaPreenchida() {
    let cont=0;

    if(!tabuleiroInvertido) {
        for(let l=LINHAS-1; l>=0; l--) {
            let linhaPreenchida = true;
            for(let c=0; c<COLUNAS; c++) {
                if(typeof tabuleiro[l][c] != 'undefined' && tabuleiro[l][c] == 0) {
                    linhaPreenchida = false;
                    break;
                }
            }
    
            if(linhaPreenchida) {
                cont++;
                for(let l2=l; l2>0; --l2) {
                    for(let c=0; c<COLUNAS; ++c) {
                        tabuleiro[l2][c] = tabuleiro[l2-1][c];
                    }
                }
                ++l;
                linhasApagadas++;
    
                if(pecaEspecial) {
                    tabuleiro = inverterTabuleiro(tabuleiro);
                }
            }
        }
    } else {
        for(let l=0; l<=LINHAS-1; l++) {
            let linhaPreenchida = true;
            for(let c=0; c<COLUNAS; c++) {
                if(typeof tabuleiro[l][c] != 'undefined' && tabuleiro[l][c] == 0) {
                    linhaPreenchida = false;
                    break;
                }
            }

            if(linhaPreenchida) {
                cont++;
                for(let l2=l; l2<LINHAS-1; ++l2) {
                    for(let c=0; c<COLUNAS; ++c) {
                        tabuleiro[l2][c] = tabuleiro[l2+1][c];
                    }
                }
                --l;
                linhasApagadas++;
    
                if(pecaEspecial) {
                    tabuleiro = inverterTabuleiro(tabuleiro);
                }
            }
        }
    }

    if(cont > 0) {
        let extra = (cont * 10) * cont;
        pontos += extra;
        velocidadeTick -= nivel*75;
        if(pontos >= 300*nivel) {
            nivel++;
        }
        attInfo(pontos, linhasApagadas, nivel);
    }
}

function inverterTabuleiro(tabuleiro) {
    let novoTabuleiro = [];
    let lin=0;

    for(let l=0; l<LINHAS; l++) {
        novoTabuleiro[l] = [];
        for(let c=0; c<COLUNAS; c++) {
            novoTabuleiro[l][c] = 0;
        }
    }
    
    for(let l=LINHAS-1; l>=0; l--) {
        let col=0;
        for(let c=COLUNAS-1; c>=0; c--) {
            if(tabuleiro[l][c] != 0) {
                novoTabuleiro[lin][col] = tabuleiro[l][c];
            }
            col++;
        }
        lin++;
    }
    tabuleiroInvertido = (!tabuleiroInvertido) ? true : false;
    return novoTabuleiro;
}

function relogio() {
    if(!pausado && iniciado) {
        if(segundos < 10) {
            segundos = "0" + segundos;
        }
        tempoPartida.innerHTML = minutos+":"+segundos;
        tempo = setTimeout(relogio, 1000);
        
        segundos++;
        if(segundos == 60) {
            segundos = 0;
            minutos++;
            if(minutos > 0 && minutos < 10) {
                minutos = "0" + minutos;
            }
        }
    } 
}

function gameOver() {
    if(derrota) {
        iniciado = false;
        document.getElementById("parar").innerHTML = "Nova partida";
        let reiniciar = confirm("Partida finalizada! Sua pontuação será salva! Deseja jogar outra partida?");
        if(reiniciar) {
            location.reload();
        }
    }
}

document.addEventListener("keydown", controle);
function controle(event) {
    if(event.key === "ArrowLeft") {
        if(movimentoValido(-1)) {
            --atualX;
        }
    } else if(event.key === "ArrowRight") {
        if(movimentoValido(1)) {
            ++atualX;
        }
    } else if(event.key === "ArrowDown") {
        if(!tabuleiroInvertido) {
            if(movimentoValido(0, 1)) {
                ++atualY;
            }  
        } else {
            var rotacionado = rotacionar(pecaAtual);
            if(movimentoValido(0, 0, rotacionado)) {
                pecaAtual = rotacionado;
            }
        }
    } else if(event.key === "ArrowUp") {
        if(!tabuleiroInvertido) {
            var rotacionado = rotacionar(pecaAtual);
            if(movimentoValido(0, 0, rotacionado)) {
                pecaAtual = rotacionado;
            }
        } else {
            if(movimentoValido(0, -1)) {
                --atualY;
            }
        }
    }
}

function iniciar() {
    iniciado = true;
    document.getElementById("iniciar").disabled = true;
    resetInterval();
    relogio();

    pontos = 0;
    nivel = 1;
    linhasApagadas = 0;
    velocidadeTick;
    derrota = false;

    intervaloTick = setInterval(tick, velocidadeTick);
    intervaloDesenhoPeca = setInterval(desenharPeca, 30);
    
    attInfo(pontos, linhasApagadas, nivel);
    novaPeca();
}

function pausar() {
    let botao = document.getElementById("pausar");
    if(iniciado) {
        if(!pausado) {
            pausado = true;
            botao.innerHTML = "Continuar jogo";
            clearTimeout(tempo);
        } else {
            pausado = false;
            relogio();
            botao.innerHTML = "Pausar jogo";
        }
    }
}

function parar() {
    if(iniciado) {
        pausado = true;
        let pergunta = confirm("Tem certeza que deseja parar o jogo? O seu progresso não será salvo.");
        if(pergunta) {
            location.reload();
        } else {
            pausado = false;
        }
    } else {
        if(derrota) {
            location.reload();
        }
    }
}

function attInfo(pontos, linhasApagadas, nivel) {
    pontuacao.innerHTML = pontos;
    linhasEliminadas.innerHTML = linhasApagadas;
    dificuldade.innerHTML = nivel;
}  

function resetInterval() {
    clearInterval(intervaloTick);
    clearInterval(intervaloDesenhoPeca);
    clearTimeout(tempo);
}