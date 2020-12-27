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
    <title>Tela de edição</title>
    <link rel="stylesheet" href="_css/estilo.css">
    <link rel="stylesheet" href="_css/form.css">
    <link rel="stylesheet" href="_css/navbar.css">
</head>
<body>
    <header>
        <?php 
            $jogador = $_SESSION["usuario"];
            include "inc/navbar.php";
        ?>
    </header>
    
    <div class="container">
        <div class="panel">
            <?php
                $id = $_SESSION['id'];

                $query = mysqli_query($conn, "SELECT * FROM usuarios WHERE id = {$id}");
                $dados = mysqli_fetch_assoc($query);
            ?>
            <form action="funcoes/editar.php" method="post">
                <h2>Tela de Edição</h2>
                <input type="hidden" name="id" value="<?php echo $dados["id"] ?>">
                <p>
                    <label for="usuario">Usuário</label>
                    <input type="text" name="usuario" value="<?php echo $dados["usuario"] ?>" disabled>
                </p>
                <p>
                    <label for="novoNome">Nome Completo</label>
                    <input type="text" name="novoNome" value="<?php echo $dados["nome"] ?>">
                </p>
                <p>
                    <label for="novoEmail">E-mail</label>
                    <input type="text" name="novoEmail" value="<?php echo $dados["email"] ?>">
                </p>
                <p>
                    <label for="novoTelefone">Telefone</label>
                    <input type="tel" name="novoTelefone" value="<?php echo $dados["telefone"] ?>">
                </p>
                <p>
                    <label for="novoSenha">Nova Senha</label>
                    <input type="password" name="novoSenha" placeholder="********">
                </p>
                <p>
                    <label for="novoConfirmarSenha">Confirme sua Senha</label>
                    <input type="password" name="novoConfirmarSenha" placeholder="********">
                </p>
                <input type="submit" value="Alterar informações">
            </form>
        </div>
    </div>
</body>
</html>