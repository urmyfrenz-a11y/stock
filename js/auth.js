const SUPABASE_URL = 'https://ywofxncimmukmjldcyuk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3b2Z4bmNpbW11a21qbGRjeXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNjU3ODUsImV4cCI6MjA5MTc0MTc4NX0.3IRKsospjDtow4bDcafxfuk1_xi7MYgD29pr26DkTQg';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('panel-login').classList.toggle('active', tab === 'login');
  document.getElementById('panel-signup').classList.toggle('active', tab === 'signup');
}

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'msg ' + type;
}

// 간단한 해시 (SHA-256 via Web Crypto)
async function hashPassword(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function doSignup() {
  const email = document.getElementById('signup-email').value.trim();
  const phone = document.getElementById('signup-phone').value.trim();
  const pw    = document.getElementById('signup-pw').value;

  if (!email || !phone || !pw) {
    showMsg('signup-msg', '모든 항목을 입력해주세요.', 'error'); return;
  }
  if (!/^010\d{8}$/.test(phone)) {
    showMsg('signup-msg', '전화번호는 010으로 시작하는 11자리여야 합니다. (예: 01012345678)', 'error'); return;
  }
  if (pw.length < 8) {
    showMsg('signup-msg', '비밀번호는 8자 이상이어야 합니다.', 'error'); return;
  }

  const btn = document.getElementById('signup-btn');
  btn.disabled = true;
  btn.textContent = '처리 중...';

  const password_hash = await hashPassword(pw);

  const { error } = await supabase.from('signup_requests').insert({ email, phone, password_hash });

  btn.disabled = false;
  btn.textContent = '가입 신청';

  if (error) {
    if (error.code === '23505') {
      showMsg('signup-msg', '이미 가입 신청된 이메일입니다.', 'error');
    } else {
      showMsg('signup-msg', '오류가 발생했습니다: ' + error.message, 'error');
    }
  } else {
    showMsg('signup-msg', '가입 신청이 완료되었습니다. 승인을 기다려주세요.', 'success');
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-phone').value = '';
    document.getElementById('signup-pw').value = '';
  }
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pw    = document.getElementById('login-pw').value;

  if (!email || !pw) {
    showMsg('login-msg', '이메일과 비밀번호를 입력해주세요.', 'error'); return;
  }

  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.textContent = '확인 중...';

  const password_hash = await hashPassword(pw);

  const { data, error } = await supabase
    .from('signup_requests')
    .select('status, password_hash')
    .eq('email', email)
    .single();

  btn.disabled = false;
  btn.textContent = '로그인';

  if (error || !data) {
    showMsg('login-msg', '이메일 또는 비밀번호가 올바르지 않습니다.', 'error'); return;
  }
  if (data.password_hash !== password_hash) {
    showMsg('login-msg', '이메일 또는 비밀번호가 올바르지 않습니다.', 'error'); return;
  }
  if (data.status === 'pending') {
    showMsg('login-msg', '아직 승인 대기 중입니다. 승인 후 로그인 가능합니다.', 'info'); return;
  }
  if (data.status === 'rejected') {
    showMsg('login-msg', '가입이 거절되었습니다. 관리자에게 문의하세요.', 'error'); return;
  }

  // 승인된 경우
  sessionStorage.setItem('sv_user', email);
  window.location.href = 'index.html';
}
