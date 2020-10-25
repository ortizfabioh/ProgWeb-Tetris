function trocarMaiorMenor() {
    var jogo = document.getElementById("tetris");

    jogo.classList.remove("maior");
    jogo.classList.add("menor");
    removerElemento("partida");
    gerarTab();
}

function trocarMenorMaior() {
    var jogo = document.getElementById("tetris");

    jogo.classList.remove("menor");
    jogo.classList.add("maior");
    removerElemento("partida");
    gerarTab();
}

function removerElemento(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}