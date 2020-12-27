<!DOCTYPE html>
<head>
    <link rel="stylesheet" href="_css/estilo.css">
</head>
<body>
<?php
// COMANDOS SQL
$create = "CREATE DATABASE tetris";

$usuario = "CREATE TABLE usuarios (
    id INT NOT NULL AUTO_INCREMENT,
    usuario VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    dataNasc VARCHAR(10) NOT NULL,
    telefone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY(id)
)";

$partida = "CREATE TABLE partidas (
    id INT NOT NULL AUTO_INCREMENT,
    usuarioId INT NOT NULL,
    pontos INT NOT NULL,
    nivel INT NOT NULL,
    tempo VARCHAR(7) NOT NULL,
    linhas INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(usuarioId) REFERENCES usuarios(id)
)";

$iu = "INSERT INTO usuarios(usuario, senha, nome, cpf, dataNasc, telefone, email) VALUES 
    ('testador', '202cb962ac59075b964b07152d234b70', 'testador', '000.000.000-00', '01/01/2020', '(11)99999-9999', 'teste@teste.com'),
    ('fulano', '202cb962ac59075b964b07152d234b70', 'fulaninho', '111.111.111-11', '01/12/2005', '(11)98888-8888', 'fulaninho@topper.com'),
    ('ciclano', '202cb962ac59075b964b07152d234b70', 'carinha dali', '222.222.222-22', '15/04/1995', '(11)97777-7777', 'carinha@loco.com')";

$ip = "INSERT INTO partidas(usuarioId, pontos, nivel, tempo, linhas) VALUES 
    (2, 9999999, 17, '90:37', 100),
    (2, 98675, 10, '40:21', 50),
    (3, 168527257, 23, '100:48', 120),
    (3, 1008, 20, '16:36', 21),
    (2, 99, 2, '03:01', 3),
    (3, 6483628, 12, '50:37', 87),
    (3, 264754, 9, '35:57', 68),
    (2, 2675, 5, '30:41', 10),
    (2, 10, 0, '00:30', 0)";


$bd = mysqli_connect("localhost", "root", "");
if($bd) {
    if(mysqli_query($bd, $create)) {
        require_once "conexao/conexao.php";
        echo "Banco de dados criado com sucesso!<br/><br/>";

        if(mysqli_query($conn, $usuario)) {
            echo "Tabela usuarios criada com sucesso!<br/>";
            if(mysqli_query($conn, $iu)) {
                echo "Usuário de teste criado com sucesso!<br/>Usuário: testador<br/>Senha: 123<br/><br/>";
            } else { die("Falha na população da tabela usuarios"); }
        } else { die("Falha na criação da tabela usuario"); }

        if(mysqli_query($conn, $partida)) {
            echo "Tabela partidas criada com sucesso!<br/>";
            if(mysqli_query($conn, $ip)) {
                echo "Tabela de partidas populada com sucesso!<br/>";
            } else { die("Falha na população da tabela partidas"); }
        } else { die("Falha na criação da tabela partida"); }

    } else { die("Falha na criação do banco de dados"); }
} else { die("Falha na conexão: " . $conn->connect_error); }

echo "<br/><button><a href='index.php'>Voltar para a tela inicial</a></button>";
?>
</body>
</html>