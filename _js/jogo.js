let tabuleiro = [];
const canvas = document.getElementById('tetris');
TAMANHOBLOCO = 20;
VAZIO = "BLACK";

const cores = [null, "purple", "yellow", "orange", "blue", "cyan", "green", "red"];
function pecas(tipo) {
    if(type==="t"){
        return [
            [0,0,0],
            [1,1,1],
            [0,1,0]
        ];
    }
    else if(type==="o"){
        return [
            [2,2],
            [2,2]
        ];
    }
    else if(type==="l"){
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3]
        ];
    }
    else if(type==="j"){
        return [
            [0,4,0],
            [0,4,0],
            [4,4,0]
        ];
    }
    else if(type==="i"){
        return [
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0]
        ];
    }
    else if(type==="s"){
        return [
            [0,0,0],
            [6,0,6],
            [6,6,6]
        ];
    }
    else if(type==="z"){
        return [
            [7]
        ];
    }
}


function gerarTab() {
    TAMANHOBLOCO = 20;
    canvas.height = 400;
    canvas.width = 200;
    canvas.
    LINHA = Math.floor(canvas.height / TAMANHOBLOCO);
    COLUNA = Math.floor(canvas.width / TAMANHOBLOCO);

    for (let l = 0; l < LINHA; l++) {
        tabuleiro[l] = [];
        for (let c = 0; c < COLUNA; c++) {
            tabuleiro[l][c] = "BLACK";
        }
    }
}

context.clearRect(0,0,canvas.width,canvas.height);
		context.fillStyle="#000000";
		context.fillRect(0,0,canvas.width,canvas.height);