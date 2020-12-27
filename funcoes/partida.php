<?php
require_once "../conexao/conexao.php";
session_start();

if(isset($_GET)) {
    $usuarioId = $_SESSION["id"];
    $pontos = $_GET["pontos"];
    $nivel = $_GET["nivel"];
    $tempo = $_GET["tempo"];
    $linhas = $_GET["linhas"];

    $sql = "INSERT INTO partidas (usuarioId, pontos, nivel, tempo, linhas) 
            VALUES ($usuarioId, $pontos, $nivel, '$tempo', $linhas)";
    if(!mysqli_query($conn, $sql)) {
        echo "Partida não foi cadastrada";
    }
}
?>