<?php

if(!empty($_POST)) {
    require_once "../conexao/conexao.php";
    if(!$conn) {
        die("<script>alert('Certifique-se de que já criou o banco de dados!'); history.back();</script>");
    }

    $usuario = trim(addslashes($_POST['usuario']));
    $senha = trim(addslashes($_POST['senha']));
    $nome = trim(addslashes($_POST['nome']));
    $cpf = trim(addslashes($_POST['cpf']));
    $dataNasc = trim(addslashes($_POST['dataNasc']));
    $telefone = trim(addslashes($_POST['telefone']));
    $email = trim(addslashes($_POST['email']));
    $confirmarSenha = trim(addslashes($_POST['confirmarSenha']));

    if(strlen($usuario) < 8) {
        die("<script>alert('O seu nome de usuário deve ter mais de 8 caracteres!');location.href='cadastro.php';</script>");
    }

    if($senha === $confirmarSenha) {
        $senha = md5($senha);
    } else {
        die("<script>alert('As senhas precisam ser iguais!');location.href='cadastro.php';</script>");
    }

    $verificarUsuario = mysqli_query($conn, "SELECT * FROM usuarios WHERE usuario = '{$usuario}'");

    if(mysqli_num_rows($verificarUsuario) == 0) {
        $sql = "INSERT INTO usuarios (usuario, senha, nome, cpf, dataNasc, telefone, email) 
                VALUES ('{$usuario}', '{$senha}', '{$nome}', '{$cpf}', {$dataNasc}, '{$telefone}', '{$email}')";
        $query = mysqli_query($conn, $sql);
        if($query) {
            header("Location: ../index.php");
            echo "<script>alert('Usuário cadastrado com sucesso!');</script>";
        } else {
            exit('Erro no cadastro do usuário');
        }
    } else {
        die("<script>alert('Este nome de usuário já está cadastrado');location.href='cadastro.php';</script>");
    }
}
?>