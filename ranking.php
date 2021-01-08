<?php
require_once "conexao/conexao.php";

session_start();
if(!$_SESSION) {
    die("<script>alert('Você não se logou em uma conta! Pare de tentar entrar pela URL'); history.back();</script>");
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" type="text/css" href="_css/estilo.css" />
  <link rel="stylesheet" type="text/css" href="_css/navbar.css" />
  <link rel="stylesheet" type="text/css" href="_css/ranking.css" />
  <title>Ranking Global</title>
</head>
<body>
    <header>
        <?php 
        $jogador = $_SESSION["usuario"];
        $id = $_SESSION["id"];
        include "inc/navbar.php";

        $sql = "SELECT u.usuario, p.pontos, p.usuarioId FROM partidas AS p 
                INNER JOIN usuarios AS u ON p.usuarioId = u.id 
                ORDER BY pontos DESC LIMIT 10";
        $query = mysqli_query($conn, $sql);
        ?>
    </header>

    <h1>Ranking global</h1>
    <div class="content">
        <table>
            <thead>
                <tr>
                    <th>Colocação</th>
                    <th>Usuário</th>
                    <th>Pontuação</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                $i=1;
                $noTop = false;
                while($dados = mysqli_fetch_assoc($query)) { ?>
                <tr>
                    <?php if($dados["usuarioId"] == $id) { ?>
                    <td class="player"><span style="font-weight:bold"><?php echo $i; ?></span></td>
                    <td class="player"><?php echo $dados["usuario"]; ?></td>
                    <td class="player"><?php echo $dados["pontos"]; ?></td>
                    <?php 
                    $noTop = true;
                    } else { ?>
                        <td><span style="font-weight:bold"><?php echo $i; ?></span></td>
                        <td><?php echo $dados["usuario"]; ?></td>
                        <td><?php echo $dados["pontos"]; ?></td>
                    <?php } ?>
                </tr>
                <?php 
                $i++;
                } ?>
            </tbody>
            <?php
            $maxs = "SELECT MAX(pontos) AS maxPonto,  
                            FIND_IN_SET(MAX(pontos), (SELECT GROUP_CONCAT(pontos ORDER BY pontos DESC) FROM partidas)) rank 
                        FROM partidas
                        WHERE usuarioId = $id";
            $maxq = mysqli_query($conn, $maxs);
            $maxd = mysqli_fetch_assoc($maxq);
            
            if(!$noTop) { ?>
            <tfoot>
                <tr>
                    <th colspan="3">Sua posição máxima</th>
                </tr>
                <tr>
                    <td class="player"><span style="font-weight:bold"><?php echo $maxd["rank"]; ?></span></td>
                    <td class="player"><?php echo $jogador; ?></td>
                    <td class="player"><?php echo $maxd["maxPonto"]; ?></td>
                </tr>
            </tfoot>
            <?php } ?>
        </table>
    </div>
</body>
</html>
