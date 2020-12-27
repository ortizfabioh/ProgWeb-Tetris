const canvas = document.getElementById('tetris');
const context = canvas.getContext("2d");

// VARIÁVEIS GLOBAIS DO JOGO
let tabuleiro = [];  // Criando o tabuleiro do Tetris
let pecaAtual;  // Peça sendo controlada atualmente
let atualX;  // Coluna atual 
let atualY;  // Linha atual
let linhasApagadas;  // Quantidade de linhas apagadas
let pontos;  // Quantidade de pontos
let nivel;  // Nível atual
let velocidadeTick = 1000;  // Velocidade inicial de deslocamento da peça
let derrota;  // Bool para verificar se a partida foi perdida
let travado;  // Bool para verificar se a peça está presa no fundo
let iniciado;  // Bool para verificar se o jogo foi iniciado
let pausado;  // Bool para verificar se o jogo está pausado
let tempo;  // Tempo de partida
let minutos=0;
let segundos=0;
let intervaloTick;  // setInterval do tick
let intervaloDesenhoPeca;  // setInterval do desenhoPeca
let tabuleiroInvertido;  // true => peças sobem; false => peças descem
let pecaEspecial;  // Bool pra verificar se a peça atual é a especial
let quadrado;  // Bool pra verificar se a peça é a 1 ou a 6 (quadrados não rotacionam)


// TAMANHO PADRÃO INICIAL (20x10)
TAMANHOBLOCO = 20;  // Tamanho de cada bloquinho
canvas.height = 400;
canvas.width = 200;
LINHAS = Math.floor(canvas.height / TAMANHOBLOCO);
COLUNAS = Math.floor(canvas.width / TAMANHOBLOCO);
window.onload = gerarTab();  // Gerar tabuleiro ao iniciar a página


// VARIÁVEIS DOS LOCAIS DE INFORMAÇÃO
let tempoPartida = document.getElementById("tempoPartida");
let pontuacao = document.getElementById("pontuacao");
let linhasEliminadas = document.getElementById("linhasEliminadas");
let dificuldade = document.getElementById("dificuldade");


/* **************************************************************
**************** CONTROLE DO TAMANHO DO TABULEIRO ***************
* (SÓ PODEM SER CHAMADOS SE A PARTIDA NÃO ESTIVER EM ANDAMENTO) *
************************************************************** */

function gerarTab() {  // Função para criar o tabuleiro
    // Gera a matriz do tabuleiro
    for(let l=0; l<LINHAS; l++) {
        tabuleiro[l] = [];
        for(let c=0; c<COLUNAS; c++) {
            tabuleiro[l][c] = 0;  // Criando blocos vazios
        }
    }

    // Pinta os blocos do tabuleiro
    for(let l=0; l<LINHAS; l++) {
        for(let c=0; c<COLUNAS; c++) {
            desenharBloco(l, c, "black", context);
        }
    }

    iniciado = false;
    pausado = false;
    tabuleiroInvertido = false;
}

function alterarTamanho() {  // Função para alterar o tamanho do tabuleiro
    if(!iniciado) {  // Só é possível alterar o tamanho se não estiver em partida
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


/* **************************************************************
************************ FUNÇÕES DO JOGO ************************
************************************************************** */

const Pecas = {  // Informações sobre formato e cor das peças  
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

function desenharBloco(lin, col, corBloco, context) {  // função pra desenhar cada bloco
    context.fillStyle = corBloco;  // Cor da parte de dentro do bloco
    context.fillRect(col * TAMANHOBLOCO, lin * TAMANHOBLOCO, TAMANHOBLOCO, TAMANHOBLOCO);
    context.strokeStyle = "#696969"; // Cor das bordas de cada bloco
    context.strokeRect(col * TAMANHOBLOCO, lin * TAMANHOBLOCO, TAMANHOBLOCO, TAMANHOBLOCO);
}

function desenharPeca() {  // Função que será chamada a cada vez que a peça descer um bloco
    context.clearRect(0, 0, canvas.width, canvas.height);  // Apaga o tabuleiro

    // Atualiza o tabuleiro a cada tick
    for(let x=0; x<COLUNAS; ++x) {
        for(let y=0; y<LINHAS; ++y) {
            if(tabuleiro[y][x] == 0) {
                desenharBloco(y, x, "Black", context);
            } else {
                desenharBloco(y, x, Pecas.cores[tabuleiro[y][x]], context);
            }
        }
    }

    // Desenha a peça
    for(let y=0; y<4; ++y) {
        for(let x=0; x<4; ++x) {
            if(pecaAtual[y][x]) {
                desenharBloco(atualY+y, atualX+x, Pecas.cores[pecaAtual[y][x]], context);
            }
        }
    }
}

function rotacionar(pecaAtual) {  // Rotaciona a peça em sentido anti-horário
    if(!quadrado) {  // Quadrados não rotacionam
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

function novaPeca() {  // Escolhe uma peça aleatória e define posição de spawn dela
    let id = Math.floor(Math.random() * Pecas.formatos.length);  // Gera um índice aleatório para pegar um formato de peça
    let formato = Pecas.formatos[id];

    quadrado = (id == 1 || id == 6) ? true : false;  // Verificação de peça quadrada
    pecaEspecial = (id == 6) ? true : false;  // Verificação de peça especial

    pecaAtual = [];
    for(let y=0; y<4; ++y) {
        pecaAtual[y] = [];
        for(let x=0; x<4; ++x) {
            let i = 4 * y + x;
            if(typeof formato[i] != 'undefined' && formato[i]) { // Verifica se existe aquele formato
                pecaAtual[y][x] = id + 1;
            } else {
                pecaAtual[y][x] = 0;
            }
        }
    }
    
    travado = false;

    // Local onde as peças irão surgir
    atualX = (TAMANHOBLOCO == 20) ? 4 : 9;
    atualY = (!tabuleiroInvertido) ? 0 : LINHAS-2;
}

function movimentoValido(proxX, proxY, novoAtual) {  // Verifica se a próxima posição da peça é válida
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
                    if(!tabuleiroInvertido) {
                        if(proxY == 1 && travado) {  // Peça presa na linha seguinte de spawn
                            derrota = true;
                        }
                    } else {
                        if(proxY == LINHAS-2 && travado) {  // Peça presa na linha seguinte de spawn
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

function tick() {  // Mantém a peça movendo pra baixo/cima
    if(!pausado) {
        if(!tabuleiroInvertido) {
            if(movimentoValido(0, 1)) {
            ++atualY;  // Move a peça
            } else {  // Não tem mais pra onde ir
                travarPeca();
                movimentoValido(0, 1);  // Atualiza status do derrota
                apagarLinhaPreenchida();
                if(derrota) {
                    resetInterval();
                    gameOver();
                }
                novaPeca();
            }
        } else {
            if(movimentoValido(0, -1)) {
                --atualY;  // Move a peça
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

function apagarLinhaPreenchida() {  // Verifica se alguma linha está preenchida e apaga se estiver / Calcula e adiciona a pontuação
    let cont=0;  // Conta as linhas preenchidas de uma vez

    if(!tabuleiroInvertido) {
        for(let l=LINHAS-1; l>=0; l--) {
            let linhaPreenchida = true;
            for(let c=0; c<COLUNAS; c++) {
                if(typeof tabuleiro[l][c] != 'undefined' && tabuleiro[l][c] == 0) {
                    linhaPreenchida = false;
                    break;
                }
            }
    
            if(linhaPreenchida) {  // Havia linha preenchida
                cont++;
                for(let l2=l; l2>0; --l2) {
                    for(let c=0; c<COLUNAS; ++c) {
                        tabuleiro[l2][c] = tabuleiro[l2-1][c];
                    }
                }
                ++l;
                linhasApagadas++;
    
                if(pecaEspecial) {  // Inverter tabuleiro quando a peça especial preencher uma linha
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

            if(linhaPreenchida) {  // Havia linha preenchida
                cont++;
                for(let l2=l; l2<LINHAS-1; ++l2) {
                    for(let c=0; c<COLUNAS; ++c) {
                        tabuleiro[l2][c] = tabuleiro[l2+1][c];
                    }
                }
                --l;
                linhasApagadas++;
    
                if(pecaEspecial) {  // Inverter tabuleiro quando a peça especial preencher uma linha
                    tabuleiro = inverterTabuleiro(tabuleiro);
                }
            }
        }
    }

    /* Acréscimo de pontos */
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

function inverterTabuleiro(tabuleiro) {  // Inverte o tabuleiro
    let novoTabuleiro = [];
    let lin=0;

    // Gera novo tabuleiro
    for(let l=0; l<LINHAS; l++) {
        novoTabuleiro[l] = [];
        for(let c=0; c<COLUNAS; c++) {
            novoTabuleiro[l][c] = 0;
        }
    }
    
    // Substitui os valores dos blocos
    for(let l=LINHAS-1; l>=0; l--) {
        let col=0;
        for(let c=COLUNAS-1; c>=0; c--) {
            if(tabuleiro[l][c] != 0) {  // Ignora blocos vazios
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
    if(!pausado && iniciado) {  // Partida em andamento
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

        let tempo = tempoPartida.innerHTML;

        let xhr = new XMLHttpRequest();
        let url = "funcoes/partida.php?pontos="+pontos+"&nivel="+nivel+"&tempo="+tempo+"&linhas="+linhasApagadas;
        xhr.open("GET", url, true);
        xhr.send();

        xhr.onload = function() {
            alert(xhr.responseText)
        }

        let reiniciar = confirm("Partida finalizada! Sua pontuação será salva! Deseja jogar outra partida?");
        if(reiniciar) {
            location.reload();
        }
    }
}


/* **************************************************************
********************* MOVIMENTAÇÃO DAS PEÇAS ********************
************************************************************** */

document.addEventListener("keydown", controle);  // Espera uma tecla sem valor (setas) ser pressionada na página

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
            if(movimentoValido(0, 1)) {
                ++atualY;
            }  
        } else {  // Tabuleiro invertido
            var rotacionado = rotacionar(pecaAtual);
            if(movimentoValido(0, 0, rotacionado)) {
                pecaAtual = rotacionado;
            }
        }
    } else if(event.key === "ArrowUp") {  // Seta cima
        if(!tabuleiroInvertido) {  // Tabuleiro comum
            var rotacionado = rotacionar(pecaAtual);
            if(movimentoValido(0, 0, rotacionado)) {
                pecaAtual = rotacionado;
            }
        } else {  // Tabuleiro invertido
            if(movimentoValido(0, -1)) {
                --atualY;
            }
        }
    }
}


/* **************************************************************
******************* GERENCIAMENTO DA PARTIDA ********************
************************************************************** */

function iniciar() {
    iniciado = true;
    document.getElementById("iniciar").disabled = true;  // desabilita o botão após iniciar

    resetInterval();

    relogio();  // Iniciar relógio

    pontos = 0;
    nivel = 1;
    linhasApagadas = 0;
    derrota = false;

    intervaloTick = setInterval(tick, velocidadeTick);  // Tempo que leva pra cair/subir a peça
    intervaloDesenhoPeca = setInterval(desenharPeca, 30);  // Tempo que leva pra atualizar o tabuleiro
    
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


/* **************************************************************
*********************** FUNÇÕES DE AJUDA ************************
************************************************************** */

function attInfo(pontos, linhasApagadas, nivel) {  // Atualiza as informações na tela do jogo
    pontuacao.innerHTML = pontos;
    linhasEliminadas.innerHTML = linhasApagadas;
    dificuldade.innerHTML = nivel;
}  

function resetInterval() {  // Reseta os intervalos criados
    clearInterval(intervaloTick);
    clearInterval(intervaloDesenhoPeca);
    clearTimeout(tempo);
}