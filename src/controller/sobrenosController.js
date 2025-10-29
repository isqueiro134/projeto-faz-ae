console.log("Página 'Sobre Nós' carregada com sucesso!");

document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.querySelector("h1");
  if (titulo) titulo.style.color = "#007bff";
});
