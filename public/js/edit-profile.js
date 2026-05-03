async function init() {
  const { data: { session } } = await db.auth.getSession();

  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('nav-email').textContent = session.user.email;
  document.getElementById('email').value = session.user.email;

  const { data: profile, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    showAlert('Could not load your profile. Please try again.', 'error');
    return;
  }

  document.getElementById('first-name').value = profile.first_name || '';
  document.getElementById('last-name').value  = profile.last_name  || '';
  document.getElementById('phone').value       = profile.phone     || '';
  document.getElementById('church').value      = profile.church    || '';

  if (profile.location)           document.getElementById('location').value           = profile.location;
  if (profile.support_preference) document.getElementById('support-preference').value = profile.support_preference;
  if (profile.considerations)     document.getElementById('considerations').value     = profile.considerations;
}

document.getElementById('edit-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();

  const firstName         = document.getElementById('first-name').value.trim();
  const lastName          = document.getElementById('last-name').value.trim();
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

  setLoading(true);

  const { data: { session } } = await db.auth.getSession();

  const { error } = await db
    .from('profiles')
    .update({
      first_name:         firstName,
      last_name:          lastName,
      phone,
      church,
      location,
      support_preference: supportPreference,
      considerations,
    })
    .eq('id', session.user.id);

  if (error) {
    showAlert('Could not save changes: ' + error.message, 'error');
    setLoading(false);
    return;
  }

  window.location.href = 'dashboard.html';
});

function showAlert(message, type) {
  const alertBox = document.getElementById('alert');
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
  alertBox.style.display = 'block';
}

function clearAlert() {
  const alertBox = document.getElementById('alert');
  alertBox.style.display = 'none';
}

function setLoading(loading) {
  const btn = document.getElementById('submit-btn');
  btn.disabled = loading;
  btn.textContent = loading ? 'Saving…' : 'Save Changes';
}

init();
