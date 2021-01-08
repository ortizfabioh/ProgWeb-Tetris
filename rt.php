<?php
require_once "conexao/conexao.php";

session_start();
if(!$_SESSION) {
    die("<script>alert('Você não se logou em uma conta! Pare de tentar entrar pela URL'); history.back();</script>");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rolling Tetris</title>
    <link rel="stylesheet" href="_css/estilo.css">
    <link rel="stylesheet" href="_css/navbar.css">
    <link rel="stylesheet" href="_css/tetris.css">
</head>
<body>
    <header>
        <?php 
            $jogador = $_SESSION["usuario"];
            $id = $_SESSION["id"];
            include "inc/navbar.php";
        ?>
    </header>

    <div class="botoes">
        <p><button id="iniciar" onclick="iniciar()">Iniciar jogo</button></p>
        <p><button id="pausar" onclick="pausar()">Pausar jogo</button></p>
        <p><button id="parar" onclick="parar()">Finalizar jogo</button></p>
    </div>

    <div class="tabuleiro">
        <canvas id="tetris"></canvas>
    </div>

    <div class="info">
        <span>Tempo de partida:</span>
        <div id="tempoPartida" class="caixa"></div>
        <span>Pontuação:</span>
        <div id="pontuacao" class="caixa"></div>
        <span>Linhas eliminadas:</span>
        <div id="linhasEliminadas" class="caixa"></div>
        <span>Dificuldade:</span>
        <div id="dificuldade" class="caixa"></div>
        <span>Ranking do jogador:<br/></span>
        <span>(jogador - pontuação - nível - tempo)</span>
        <div id="rankJogador" class="ranking">
            <div class="rank">         
                <?php
                $sql = "SELECT pontos, nivel, tempo FROM partidas WHERE usuarioId = $id";
                $query = mysqli_query($conn, $sql);
                while($dados = mysqli_fetch_assoc($query)) { ?>
                (<?php echo $jogador; ?> - <?php echo $dados["pontos"]; ?> - <?php echo $dados["nivel"]; ?> - <?php echo $dados["tempo"]; ?>)<br/>
                <?php } ?>
            </div>
        </div>
    </div>

    <script src="_js/jogo.js"></script>
</body>
</html>