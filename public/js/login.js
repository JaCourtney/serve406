const form = document.getElementById('login-form');
const alertBox = document.getElementById('alert');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  setLoading(true);

  const { error } = await db.auth.signInWithPassword({ email, password });

  if (error) {
    showAlert(error.message, 'error');
    setLoading(false);
    return;
  }

  window.location.href = 'dashboard.html';
});

function showAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
  alertBox.style.display = 'block';
}

function clearAlert() {
  alertBox.style.display = 'none';
}

function setLoading(loading) {
  const btn = document.getElementById('submit-btn');
  btn.disabled = loading;
  btn.textContent = loading ? 'Signing in…' : 'Sign In';
}
