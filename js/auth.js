checkAuth();

function checkAuth() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
}
