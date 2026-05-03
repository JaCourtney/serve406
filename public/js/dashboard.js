async function init() {
  const { data: { session } } = await db.auth.getSession();

  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  const user = session.user;

  document.getElementById('nav-email').textContent = user.email;

  const { data: profile, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    document.getElementById('content').innerHTML =
      '<p style="color:#dc2626">Could not load your profile. Please contact support.</p>';
    return;
  }

  document.getElementById('val-first-name').textContent = profile.first_name || '—';
  document.getElementById('val-last-name').textContent  = profile.last_name  || '—';
  document.getElementById('val-email').textContent      = user.email;
  document.getElementById('val-phone').textContent      = profile.phone  || '—';
  document.getElementById('val-church').textContent     = profile.church || '—';
  document.getElementById('val-area').textContent       = profile.area_preference || '—';
  document.getElementById('val-joined').textContent     = new Date(profile.created_at).toLocaleDateString(
    'en-US', { year: 'numeric', month: 'long', day: 'numeric' }
  );

  if (!user.email_confirmed_at) {
    document.getElementById('verify-banner').style.display = 'block';
  }

  if (profile.is_admin) {
    document.getElementById('admin-link').style.display = 'block';
  }

  document.getElementById('content').style.display = 'block';
  document.getElementById('loading').style.display = 'none';
}

document.getElementById('logout-btn').addEventListener('click', async () => {
  await db.auth.signOut();
  window.location.href = 'index.html';
});

init();
