const form = document.getElementById('register-form');
const alertBox = document.getElementById('alert');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();

  const firstName         = document.getElementById('first-name').value.trim();
  const lastName          = document.getElementById('last-name').value.trim();
  const email             = document.getElementById('email').value.trim();
  const password          = document.getElementById('password').value;
  const confirm           = document.getElementById('confirm-password').value;
  const phone             = document.getElementById('phone').value.trim();
  const church            = document.getElementById('church').value.trim();
  const location          = document.getElementById('location').value;
  const supportPreference = document.getElementById('support-preference').value;
  const considerations    = document.getElementById('considerations').value;

  if (!firstName || !lastName) {
    showAlert('Please enter your first and last name.', 'error');
    return;
  }


  if (!location) {
    showAlert('Please select a location.', 'error');
    return;
  }

  if (password !== confirm) {
    showAlert('Passwords do not match.', 'error');
    return;
  }

  if (password.length < 6) {
    showAlert('Password must be at least 6 characters.', 'error');
    return;
  }

  setLoading(true);

  const { data, error } = await db.auth.signUp({ email, password });

  if (error) {
    showAlert(error.message, 'error');
    setLoading(false);
    return;
  }

  const userId = data.user.id;

  const { error: profileError } = await db
    .from('profiles')
    .insert({
      id: userId,
      first_name:         firstName,
      last_name:          lastName,
      phone,
      church,
      location,
      support_preference: supportPreference,
      considerations,
    });

  if (profileError) {
    showAlert('Account created but profile save failed: ' + profileError.message, 'error');
    setLoading(false);
    return;
  }

  window.location.href = 'thankyou.html';
});

function showAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
  alertBox.style.display = 'block';
}

function clearAlert() {
  alertBox.style.display = 'none';
  alertBox.textContent = '';
}

function setLoading(loading) {
  const btn = document.getElementById('submit-btn');
  btn.disabled = loading;
  btn.textContent = loading ? 'Registering…' : 'Create Account';
}
