document.addEventListener('DOMContentLoaded', () => {
    const botaoHamburguer = document.querySelector('.menu-hamburguer');
    const menuNavegacao = document.querySelector('.menu-navegacao');
  
    botaoHamburguer.addEventListener('click', () => {
      // Alterna a classe 'ativo' no botão e no menu
      botaoHamburguer.classList.toggle('ativo');
      menuNavegacao.classList.toggle('ativo');
  
      // Atualiza o atributo aria-expanded para acessibilidade
      const estaExpandido = botaoHamburguer.classList.contains('ativo');
      botaoHamburguer.setAttribute('aria-expanded', estaExpandido);
    });
  });