window.addEventListener('resize', function() {
    var largePage = document.querySelector('.mypage-large');
    var smallPage = document.querySelector('.mypage-small');

    if (window.innerWidth <= 768) {
        // Se a tela for menor ou igual a 768px (versão para telas menores)
        if (!smallPage) {
            // Se a versão para telas menores ainda não foi criada, crie-a
            var newBody = document.createElement('body');
            newBody.className = 'mypage-small';
            document.body.parentNode.appendChild(newBody);

            // Transfira o conteúdo para a nova versão
            while (document.body.firstChild) {
                newBody.appendChild(document.body.firstChild);
            }
        }
        // Oculte a versão para telas maiores
        largePage.style.display = 'none';
    } else {
        // Se a tela for maior que 768px (versão para telas maiores)
        if (smallPage) {
            // Se a versão para telas menores existir, remova-a
            smallPage.parentNode.removeChild(smallPage);
        }
        // Exiba a versão para telas maiores
        largePage.style.display = 'block';
    }
});

// Adicionamos esta parte para garantir que a página volte para a versão "mypage-large"
window.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth > 768) {
        var smallPage = document.querySelector('.mypage-small');
        if (smallPage) {
            smallPage.parentNode.removeChild(smallPage);
            document.querySelector('.mypage-large').style.display = 'block';
        }
    }
});