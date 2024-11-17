const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzKNejXZNkbN7uJH87Yaa3VqGfx0gUE77WNB1Ibe1rrK9g_oCOjtVgkAQ6Ot_PfLCWz/exec'; // 替换为你的 Google Apps Script URL

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function (e) {
    if (e.keyCode == 123) { // F12
        e.preventDefault();
    }
});

// 显示注册表单，隐藏登录表单
function showRegisterForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

// 显示登录表单，隐藏注册表单
function showLoginForm() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
}

// 提交注册表单
async function submitRegister() {
  const submitButton = document.querySelector('.loginSubmitBtn');
  submitButton.disabled = true;
  submitButton.textContent = '注册中...';

  const password = document.getElementById('registerPassword').value;
  const fullName = document.getElementById('registerFullName').value;
  let wanumber = document.getElementById('registerWaNumber').value;

  // 自动生成 Username
  const username = 'user_' + Math.floor(Math.random() * 100000);

  // 检查 waNumber 开头并进行修改
  if (wanumber.startsWith('1')) {
    wanumber = '60' + wanumber; // 如果以1开头，添加60
  } else if (wanumber.startsWith('0')) {
    wanumber = '6' + wanumber; // 如果以0开头，添加6并保留0
  } else if (!wanumber.startsWith('6')) {
    console.warn('Wasap number must start with 6, 0, or 1.');
  }

  try {
    const response = await fetch(APP_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'register',
        username: username,
        password: password,
        fullName: fullName,
        wanumber: wanumber,
      })
    });

    const result = await response.json();
    if (result.success) {
      // 保存所有信息到 localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('wanumber', wanumber);
      localStorage.setItem('walletAmount', 0.00);

      // 登录成功后跳转到 profile.html
      window.location.href = 'index';
    } else {
      document.getElementById('registerMessage').textContent = result.message;
    }
  } catch (error) {
    console.error('Error during registration:', error);
    document.getElementById('registerMessage').textContent = 'Registration failed. Please try again.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Sign Up';
  }
}


// 提交登录表单
async function submitLogin() {
  const submitButton = document.querySelector('.loginSubmitBtn'); // 使用相应的类名
  submitButton.disabled = true;
  submitButton.textContent = '登入中...';

  const wanumber = document.getElementById('loginWaNumber').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(APP_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'login',
        wanumber: wanumber,
        password: password,
      })
    });

    const result = await response.json();

    if (result.success) {
      // 登录成功后，将用户信息保存到 localStorage
      localStorage.setItem('username', result.data.username);
      localStorage.setItem('password', result.data.password);
      localStorage.setItem('fullName', result.data.fullName);
      localStorage.setItem('wanumber', result.data.wanumber);
      localStorage.setItem('walletAmount', result.data.walletAmount);

      // 跳转到 profile.html
      window.location.href = 'index';
    } else {
      document.getElementById('loginMessage').textContent = result.message;
    }
  } catch (error) {
    console.error('Error during login:', error);
    document.getElementById('loginMessage').textContent = 'An error occurred while logging in. Please try again.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Sign In';
  }
}
    
    document.addEventListener("DOMContentLoaded", function() {
      const currentPath = window.location.pathname;
    
      // 检查路径是否以 .html 结尾
      if (currentPath.endsWith('.html')) {
          const newPath = currentPath.slice(0, -5);
          history.replaceState(null, '', newPath);
      }
});