document.addEventListener("DOMContentLoaded", () => {
    console.log("AURA Portal: Script cargado con éxito.");
    
    // Comprobar la página actual de forma robusta
    const path = window.location.pathname.toLowerCase();
    const isDashboard = path.includes("dashboard.html");
    
    console.log("Página detectada: " + (isDashboard ? "Dashboard" : "Login"));
    
    if (isDashboard) {
        handleDashboardPage();
    } else {
        handleLoginPage();
    }
});

// --- PÁGINA DE LOGIN ---
function handleLoginPage() {
    const userSession = sessionStorage.getItem("user");
    if (userSession === "fabian") {
        console.log("Sesión activa detectada para 'fabian'. Redirigiendo a dashboard...");
        window.location.href = "dashboard.html";
        return;
    }

    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const submitBtn = document.getElementById("submitBtn");
    const alertContainer = document.getElementById("alertContainer");
    const cardElement = document.querySelector(".login-card");

    if (!loginForm) {
        console.error("Error: No se encontró el formulario '#loginForm'.");
        return;
    }

    // Mostrar alertas guardadas en sessionStorage (por redirección)
    const errorMsg = sessionStorage.getItem("error_msg");
    const successMsg = sessionStorage.getItem("success_msg");
    
    if (errorMsg) {
        showAlert("danger", errorMsg);
        sessionStorage.removeItem("error_msg");
        if (cardElement) {
            cardElement.classList.add("shake");
            setTimeout(() => cardElement.classList.remove("shake"), 500);
        }
    } else if (successMsg) {
        showAlert("success", successMsg);
        sessionStorage.removeItem("success_msg");
    }

    // Comprobar y manejar límite de intentos
    let intentos = parseInt(sessionStorage.getItem("intentos")) || 0;
    console.log("Intentos registrados en esta pestaña: " + intentos);
    
    if (intentos >= 3) {
        blockLoginForm();
    }

    // Evento Submit
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Formulario enviado. Procesando credenciales...");

        if (intentos >= 3) {
            console.warn("Intento de envío bloqueado: límite excedido.");
            return;
        }

        const usuario = usernameInput ? usernameInput.value.trim() : "";
        const contrasena = passwordInput ? passwordInput.value.trim() : "";

        console.log("Validando credenciales para el usuario: " + usuario);

        if (usuario === "fabian" && contrasena === "ingeniero") {
            console.log("¡Acceso concedido! Guardando sesión...");
            sessionStorage.setItem("user", "fabian");
            sessionStorage.removeItem("intentos");
            window.location.href = "dashboard.html";
        } else {
            intentos++;
            sessionStorage.setItem("intentos", intentos);
            console.warn("Credenciales incorrectas. Intentos: " + intentos);

            if (intentos >= 3) {
                blockLoginForm();
            } else {
                showAlert("danger", `Usuario o contraseña incorrectos. Intentos restantes: ${3 - intentos}`);
                
                // Mostrar intentos restantes abajo de la contraseña
                if (passwordInput) {
                    let badge = document.getElementById("attemptsBadge");
                    if (!badge) {
                        badge = document.createElement("div");
                        badge.id = "attemptsBadge";
                        badge.className = "attempts-badge";
                        passwordInput.parentNode.appendChild(badge);
                    }
                    badge.textContent = `Intentos restantes: ${3 - intentos}`;
                }
                
                if (cardElement) {
                    cardElement.classList.add("shake");
                    setTimeout(() => cardElement.classList.remove("shake"), 500);
                }
            }
        }
    });

    function blockLoginForm() {
        console.error("Formulario de acceso bloqueado por superar límite de intentos.");
        showAlert("danger", "<strong>Acceso Bloqueado:</strong> Has alcanzado el máximo de 3 intentos permitidos.");
        if (usernameInput) usernameInput.disabled = true;
        if (passwordInput) passwordInput.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
        
        const badge = document.getElementById("attemptsBadge");
        if (badge) badge.remove();
    }

    function showAlert(type, message) {
        if (!alertContainer) {
            console.warn("No se encontró '#alertContainer' para mostrar la alerta.");
            return;
        }
        
        let iconSvg = "";
        if (type === "danger") {
            iconSvg = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
        } else if (type === "success") {
            iconSvg = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        }

        alertContainer.innerHTML = `
            <div class="alert alert-${type}">
                <span class="alert-icon">${iconSvg}</span>
                <div>${message}</div>
            </div>
        `;
    }
}

// --- PÁGINA DE DASHBOARD ---
function handleDashboardPage() {
    const userSession = sessionStorage.getItem("user");
    if (userSession !== "fabian") {
        console.warn("Acceso denegado: No hay sesión activa. Redirigiendo al login...");
        sessionStorage.setItem("error_msg", "Acceso denegado. Por favor, inicia sesión.");
        window.location.href = "index.html";
        return;
    }

    // Configurar reloj
    const dateSpan = document.getElementById("currentDate");
    if (dateSpan) {
        const updateClock = () => {
            const now = new Date();
            const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            dateSpan.textContent = now.toLocaleDateString('es-ES', options).replace(',', '');
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    // Generar o recuperar ID de sesión simulado
    const sessionIdSpan = document.getElementById("sessionId");
    if (sessionIdSpan) {
        let mockId = sessionStorage.getItem("mock_session_id");
        if (!mockId) {
            const chars = "0123456789ABCDEF";
            mockId = "";
            for (let i = 0; i < 32; i++) {
                mockId += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            sessionStorage.setItem("mock_session_id", mockId);
        }
        sessionIdSpan.textContent = mockId;
    }

    // Configurar hora de creación
    const creationTimeSpan = document.getElementById("creationTime");
    if (creationTimeSpan) {
        let creationTime = sessionStorage.getItem("creation_time");
        if (!creationTime) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('es-ES') + " " + now.toLocaleDateString('es-ES');
            sessionStorage.setItem("creation_time", timeStr);
            creationTime = timeStr;
        }
        creationTimeSpan.textContent = creationTime;
    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Cerrando sesión...");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("creation_time");
            sessionStorage.removeItem("mock_session_id");
            sessionStorage.setItem("success_msg", "Has cerrado sesión correctamente. ¡Vuelve pronto!");
            window.location.href = "index.html";
        });
    }
}
