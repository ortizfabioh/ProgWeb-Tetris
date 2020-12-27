<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tela de cadastro</title>
    <link rel="stylesheet" href="_css/estilo.css">
    <link rel="stylesheet" href="_css/form.css">
</head>
<body>
    <div class="container">
        <div class="panel">
            <img src="_img/logo.png" alt="Tetris" class="center">
            <form action="funcoes/cadastrar.php" method="post">
                <h2>Tela de cadastro</h2>
                <p>
                    <label for="nome">Nome Completo</label>
                    <input type="text" name="nome" placeholder="José da Silva" required>
                </p>
                <p>
                    <label for="dataNasc">Data de Nascimento</label>
                    <input type="date" name="dataNasc" required>
                </p>
                <p>
                    <label for="cpf">CPF</label>
                    <input type="text" name="cpf" placeholder="000.000.000-00" required>
                </p>
                <p>
                    <label for="telefone">Telefone</label>
                    <input type="tel" name="telefone" placeholder="(00)90000-0000" required>
                </p>
                <p>
                    <label for="usuario">Usuário (Deve ser único e ter a partir de 8 caracteres)</label>
                    <input type="text" name="usuario" placeholder="uniqueUser" required>
                </p>
                <p>
                    <label for="email">Email</label>
                    <input type="text" name="email" placeholder="email@gmail.com" required>
                </p>

                <p>
                    <label for="senha">Senha</label>
                    <input type="password" name="senha" placeholder="********" required>
                </p>
                <p>
                    <label for="confirmarSenha">Confirme sua Senha</label>
                    <input type="password" name="confirmarSenha" placeholder="********" required>
                </p>
                <input type="submit" value="Cadastrar">
            </form>
                <a href="index.php" class="link">Fazer Login</a>
        </div>
    </div>
</body>
</html>