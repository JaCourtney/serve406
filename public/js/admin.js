async function init() {
  const { data: { session } } = await db.auth.getSession();

  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  const admin = await db.rpc('is_admin');
  if (!admin.data) {
    window.location.href = 'dashboard.html';
    return;
  }

  document.getElementById('nav-email').textContent = session.user.email;
  await loadRegistrations();
}

async function loadRegistrations() {
  const { data, error } = await db
    .from('profiles')
    .select('id, first_name, last_name, phone, church, location, support_preference, considerations, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    document.getElementById('table-wrap').innerHTML =
      '<p style="color:#dc2626">Could not load registrations: ' + error.message + '</p>';
    return;
  }

  window.allRows = data;
  renderTable(data);
  document.getElementById('total-count').textContent = data.length;
}

function renderTable(rows) {
  const tbody = document.getElementById('reg-tbody');

  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#94a3b8;padding:2rem;">No registrations found.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${esc(r.first_name || '—')}</td>
      <td>${esc(r.last_name  || '—')}</td>
      <td>${esc(r.phone      || '—')}</td>
      <td>${esc(r.church     || '—')}</td>
      <td><span class="badge badge-blue">${esc(r.location || '—')}</span></td>
      <td>${esc(r.support_preference || '—')}</td>
      <td>${esc(r.considerations    || '—')}</td>
      <td>
        <select class="role-select" data-id="${esc(r.id)}" onchange="changeRole(this)">
          <option value="volunteer"     ${r.role === 'volunteer'     ? 'selected' : ''}>Volunteer</option>
          <option value="project_lead"  ${r.role === 'project_lead'  ? 'selected' : ''}>Project Lead</option>
          <option value="city_lead"     ${r.role === 'city_lead'     ? 'selected' : ''}>City Lead</option>
          <option value="admin"         ${r.role === 'admin'         ? 'selected' : ''}>Admin</option>
        </select>
      </td>
      <td>${new Date(r.created_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</td>
    </tr>
  `).join('');
}

async function changeRole(select) {
  const id      = select.dataset.id;
  const newRole = select.value;
  select.disabled = true;

  const { error } = await db
    .from('profiles')
    .update({ role: newRole })
    .eq('id', id);

  select.disabled = false;

  if (error) {
    alert('Could not update role: ' + error.message);
    await loadRegistrations();
  }
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getFiltered() {
  const search   = document.getElementById('search').value.toLowerCase();
  const location = document.getElementById('location-filter').value;

  return window.allRows.filter(r => {
    const matchSearch = !search ||
      (r.first_name || '').toLowerCase().includes(search) ||
      (r.last_name  || '').toLowerCase().includes(search) ||
      (r.church     || '').toLowerCase().includes(search) ||
      (r.phone      || '').toLowerCase().includes(search);
    const matchLocation = !location || r.location === location;
    return matchSearch && matchLocation;
  });
}

function applyFilters() {
  const filtered = getFiltered();
  renderTable(filtered);
  document.getElementById('filtered-count').textContent =
    filtered.length !== window.allRows.length
      ? `Showing ${filtered.length} of ${window.allRows.length}`
      : '';
}

function exportCSV() {
  const rows = getFiltered();

  const headers = ['First Name', 'Last Name', 'Phone', 'Church', 'Location', 'Support Preference', 'Considerations', 'Role', 'Registered On'];
  const lines = [
    headers.join(','),
    ...rows.map(r => [
      `"${r.first_name        || ''}"`,
      `"${r.last_name         || ''}"`,
      `"${r.phone             || ''}"`,
      `"${r.church            || ''}"`,
      `"${r.location          || ''}"`,
      `"${r.support_preference|| ''}"`,
      `"${r.considerations    || ''}"`,
      `"${r.role              || 'volunteer'}"`,
      `"${new Date(r.created_at).toLocaleDateString()}"`,
    ].join(','))
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `serve406-registrations-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('location-filter').addEventListener('change', applyFilters);
document.getElementById('export-btn').addEventListener('click', exportCSV);
document.getElementById('logout-btn').addEventListener('click', async () => {
  await db.auth.signOut();
  window.location.href = 'index.html';
});

init();
