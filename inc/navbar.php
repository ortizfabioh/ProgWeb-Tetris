<div class="navbar">
    <a href="rt.php"><img src="_img/logo.png" alt="Tetris" class="img"></a>
    <?php if(basename($_SERVER['PHP_SELF']) == "rt.php") { ?>
        <div class="dropdown">
            <button class="dropbtn">Altere o tamanho do tetris (Altura x Largura)</button>
            <div class="dropdown-content">
                <a id="redimensao" href="#" onclick="alterarTamanho()">Mudar para 44 x 22</a>
            </div>
        </div>
    <?php } ?>
    <div class="dropdown jogador">
        <button class="dropbtn"><?php echo $jogador; ?></button>
        <div class="dropdown-content direita">
            <a href="ranking.php">Ranking Global</a>
            <a href="edicao.php">Editar Perfil</a>
            <a href="funcoes/logout.php">Log out</a>
        </div>
    </div>
</div>