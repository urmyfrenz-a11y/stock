const SUPABASE_URL = 'https://ywofxncimmukmjldcyuk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3b2Z4bmNpbW11a21qbGRjeXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNjU3ODUsImV4cCI6MjA5MTc0MTc4NX0.3IRKsospjDtow4bDcafxfuk1_xi7MYgD29pr26DkTQg';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 관리자 비밀번호 (변경 원하시면 수정)
const ADMIN_PASSWORD = 'admin1234';

let currentFilter = 'all';

function checkAdminPw() {
  const val = document.getElementById('admin-pw-input').value;
  if (val === ADMIN_PASSWORD) {
    sessionStorage.setItem('sv_admin', '1');
    document.getElementById('login-gate').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadRequests();
  } else {
    document.getElementById('admin-login-err').style.display = 'block';
  }
}

function adminLogout() {
  sessionStorage.removeItem('sv_admin');
  location.reload();
}

function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadRequests();
}

async function loadRequests() {
  const tbody = document.getElementById('requests-tbody');
  tbody.innerHTML = '<tr><td colspan="6" class="empty">불러오는 중...</td></tr>';

  let query = supabase.from('signup_requests').select('*').order('created_at', { ascending: false });
  if (currentFilter !== 'all') query = query.eq('status', currentFilter);

  const { data, error } = await query;

  if (error) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">오류: ${error.message}</td></tr>`;
    return;
  }
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">신청 내역이 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(r => `
    <tr>
      <td>${new Date(r.created_at).toLocaleString('ko-KR')}</td>
      <td>${r.email}</td>
      <td>${r.phone}</td>
      <td class="mono">${r.password_hash.substring(0, 16)}...</td>
      <td><span class="badge ${r.status}">${statusLabel(r.status)}</span></td>
      <td>
        <div class="action-btns">
          ${r.status !== 'approved' ? `<button class="action-btn btn-approve" onclick="updateStatus('${r.id}', 'approved')">승인</button>` : ''}
          ${r.status !== 'rejected' ? `<button class="action-btn btn-reject"  onclick="updateStatus('${r.id}', 'rejected')">거절</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function statusLabel(s) {
  return { pending: '대기중', approved: '승인됨', rejected: '거절됨' }[s] || s;
}

async function updateStatus(id, status) {
  const { error } = await supabase.from('signup_requests').update({ status }).eq('id', id);
  if (error) { alert('오류: ' + error.message); return; }
  loadRequests();
}

// 이미 로그인된 경우 바로 패널 표시
if (sessionStorage.getItem('sv_admin') === '1') {
  document.getElementById('login-gate').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
  loadRequests();
}
