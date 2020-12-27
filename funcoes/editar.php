<?php
require_once '../conexao/conexao.php';

if (isset($_POST['id']) && !empty($_POST['id'])) {
    $id = $_POST['id'];
} else {
    die("<script>alert('Você não forneceu um parametro válido!');location.href='../home.php';</script>");
}

if(!empty($_POST)) {
    $nome = trim(addslashes($_POST['novoNome']));
    $email = trim(addslashes($_POST['novoEmail']));
    $telefone = trim(addslashes($_POST['novoTelefone']));
    
    $sql = "UPDATE usuarios SET nome = '{$nome}', email = '{$email}', telefone = '{$telefone}'";

    if(!empty($_POST['novoSenha'])) {
        $senha = trim(addslashes($_POST['novoSenha']));
        $confirmarSenha = trim(addslashes($_POST['novoConfirmarSenha']));
        if($senha === $confirmarSenha) {
            $senha = md5($senha);
        } else {
            die("<script>alert('As senhas precisam ser iguais!');location.href='cadastro.php';</script>");
        }
        $sql .= ", senha = '{$senha}'";
    }
    $sql .= " WHERE id = {$id}";

    $query = mysqli_query($conn, $sql);

    if($query) {
        header("Location: ../rt.php");
    } else {
        echo "<script>alert('Erro na alteração dos dados'); history.back();</script>";
    }
}
?>