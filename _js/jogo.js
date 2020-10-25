window.onload = gerarTab();

function gerarTab() {
    var tetris = document.getElementById("tetris");
    
    var altura = (tetris.className == "menor") ? 20 : 44;
    var largura = (tetris.className == "menor") ? 10 : 22;
    var tamCelula = (tetris.className == "menor") ? "celulaMenor" : "celulaMaior";

    var partida = document.createElement("div");
    partida.setAttribute("id", "partida")
    tetris.appendChild(partida);

    for(var i=1; i<=altura; i++) {
        for(var j=1; j<=largura; j++) {
            var celula = document.createElement("div");
            celula.setAttribute("class", tamCelula);
            var id= (i).toString()+"_"+j;
            celula.setAttribute("id", id)
            partida.appendChild(celula);
        }
    }
}
