<?php
require_once "../conexao/conexao.php";

if(!$conn) {
    die("<script>alert('Certifique-se de que já criou o banco de dados!'); history.back();</script>");
}

if($_POST) {
    if(!empty($_POST['usuario']) && !empty($_POST['senha'])) {
        $usuario = trim(addslashes($_POST['usuario']));
        $senha = md5(trim(addslashes($_POST['senha'])));

        $sql = "SELECT * FROM usuarios WHERE usuario = '{$usuario}' AND senha = '{$senha}'";

        if($query = mysqli_query($conn, $sql)) {
            $dados = mysqli_fetch_assoc($query);
            unset($dados["senha"]);

            session_start();
            
            $_SESSION = $dados;

            if($_SESSION) {
                header("Location: ../rt.php");
            } else {
                echo $_SESSION;
            }
        } else {
            die("Dados incorretos!");
        }
    }
}
?>