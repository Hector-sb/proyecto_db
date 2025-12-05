document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    // Guardamos el usuario para usarlo en el dashboard
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    window.location.href = "dashboard.html";
  } else {
    alert("Error: " + data.error);
  }
});
