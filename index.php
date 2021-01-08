<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tela de login</title>
    <link rel="stylesheet" href="_css/estilo.css">
    <link rel="stylesheet" href="_css/form.css">
</head>
<body>
    <div class="container">
        <div class="panel">
            <img src="_img/logo.png" alt="Tetris" class="center">
            <form action="funcoes/logar.php" method="post">
                <h2>Tela de login</h2>
                <p><input type="text" name="usuario" placeholder="Usuário"></p>
                <p><input type="password" name="senha" placeholder="Senha"></p>
                <input type="submit" value="Acessar">
            </form>
            <a href="cadastro.php" class="link">Cadastrar-se</a>
        </div>
    </div>
</body>
</html>