
document.addEventListener("DOMContentLoaded", () => {
    const mediaQuery = window.matchMedia("(min-width: 1251px)");

    if (mediaQuery.matches) { // Executa somente se a largura for >= 1200px
        const projectDivs = document.querySelectorAll(".projects > div"); // Seleciona apenas os filhos diretos de .projects

        projectDivs.forEach(div => {
            div.addEventListener("mouseenter", () => {
                div.style.transition = "transform 0.3s"; // Animação suave
                div.style.transform = "translateY(-50px)"; // Move para cima
            });

            div.addEventListener("mouseleave", () => {
                div.style.transform = "translateY(0px)"; // Volta à posição original
            });
        });
    }
});