// ===== LOGIN PADRÃO =====
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); 

    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    if (user === "admin" && password === "123") {
        msg.style.color = "green";
        msg.textContent = "Login realizado com sucesso!";
        
        setTimeout(() => {
            window.location.href = "/";
        }, 800);

    } else {
        msg.style.color = "red";
        msg.textContent = "Usuário ou senha incorretos!";
    }
});


// ===== MODAL DE RECUPERAÇÃO =====
const modal = document.getElementById("recoverModal");
const openBtn = document.getElementById("openRecover");
const closeBtn = document.getElementById("closeRecover");
const sendBtn = document.getElementById("sendRecover");
const recoverMsg = document.getElementById("recoverMsg");

openBtn.addEventListener("click", () => modal.style.display = "flex");
closeBtn.addEventListener("click", () => modal.style.display = "none");

sendBtn.addEventListener("click", () => {
    const email = document.getElementById("emailRecover").value;

    if (!email.includes("@")) {
        recoverMsg.style.color = "red";
        recoverMsg.textContent = "E-mail inválido.";
    } else {
        recoverMsg.style.color = "green";
        recoverMsg.textContent = "E-mail enviado com sucesso!";
        setTimeout(() => modal.style.display = "none", 1200);
    }
});


// ===== LOGIN COM GOOGLE =====
document.getElementById("googleLogin").addEventListener("click", () => {
    google.accounts.id.initialize({
        client_id: "SUA_GOOGLE_CLIENT_ID_AQUI",
        callback: handleGoogleLogin
    });

    google.accounts.id.prompt();
});

function handleGoogleLogin(response) {
    console.log("TOKEN GOOGLE:", response.credential);

    alert("Login Google realizado!");
    window.location.href = "home.html";
}


// ===== LOGIN COM LINKEDIN =====
document.getElementById("linkedinLogin").addEventListener("click", () => {
    const clientId = "SUA_LINKEDIN_CLIENT_ID_AQUI";
    const redirect = "http://localhost:5500/src/html/home.html";

    const link = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirect}&scope=openid%20profile%20email`;

    window.location.href = link;
});
