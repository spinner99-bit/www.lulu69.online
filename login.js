const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5q2CQrT4S05mN039gHnYOVvh_QdbIkiOcXOIs2QgC9DkzQ9HiWEGZHWuVFZjOq0Fw/exec'; // 替换为你的 Google Apps Script URL

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

  const password = document.getElementById('registerPassword').value.trim();
  const fullName = document.getElementById('registerFullName').value.trim();
  let wanumber = document.getElementById('registerWaNumber').value.trim();

  // 自动生成 Username
  const username = 'L69' + (Math.floor(Date.now() / 1000) % 10000) + Math.floor(Math.random() * 100);

  // 输入长度验证
  if (password.length < 4) {
    alert('密码不得少于 4 个字符！');
    submitButton.disabled = false;
    submitButton.textContent = '注册账号';
    return;
  }

  if (wanumber.length < 8) {
    alert('请输入有效的手机号码！');
    submitButton.disabled = false;
    submitButton.textContent = '注册账号';
    return;
  }

  // 检查 waNumber 开头并进行修改
  if (wanumber.startsWith('1')) {
    wanumber = '60' + wanumber; // 如果以1开头，添加60
  } else if (wanumber.startsWith('0')) {
    wanumber = '6' + wanumber; // 如果以0开头，添加6并保留0
  } else if (!wanumber.startsWith('6')) {
    console.warn('手机号码必须以 6、0 或 1 开头。');
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
        wallet: 125,
      })
    });

    const result = await response.json();
    if (result.success) {
      // 保存所有信息到 localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('wanumber', wanumber);
      localStorage.setItem('walletAmount', 125);

      // 注册成功后跳转到 profile.html
      window.location.href = 'index';
    } else {
      alert(result.message); // 使用 alert 显示失败信息
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('注册失败，请重试.'); // 使用 alert 显示错误信息
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = '注册账号';
  }
}

// 提交登录表单
async function submitLogin() {
  const submitButton = document.querySelector('.loginSubmitBtn'); // 使用相应的类名
  submitButton.disabled = true;
  submitButton.textContent = '登入中...';

  const wanumber = document.getElementById('loginWaNumber').value.trim(); // 去除空格
  const password = document.getElementById('loginPassword').value.trim(); // 去除空格

  // 输入长度验证
  if (wanumber.length < 8) {
    alert('请输入有效的手机号码。');
    submitButton.disabled = false;
    submitButton.textContent = '登入账号';
    return;
  }

  if (password.length < 4) {
    alert('密码不得少于 4 个字符。');
    submitButton.disabled = false;
    submitButton.textContent = '登入账号';
    return;
  }

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
      alert(result.message); // 使用 alert 显示失败信息
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('登入失败，请重试。'); // 使用 alert 显示错误信息
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = '登入账号';
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
