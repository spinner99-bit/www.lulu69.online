document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function (e) {
    if (e.keyCode == 123) { // F12
        e.preventDefault();
    }
});

// 检查用户登录状态
async function checkLoginStatus() {
    const username = localStorage.getItem('username');
    const number = localStorage.getItem('wanumber');
    const walletAmount = localStorage.getItem('walletAmount');
    const headerDiv = document.getElementById('header');

    if (!username) {
      // 如果未登录，要求用户先登录并跳转到登录页面
      window.location.href = 'login';  // 重定向到登录页面
    } else {
      // 如果已登录，显示欢迎信息和加载状态
      headerDiv.innerHTML = `
        <div class="headerLeft-Logo">
            <img src="Element/Element/LOGO-2.png">
        </div>
        <div class="headerRight-cover">
            <div class="header-balance">
                <img src="Element/Icon/Coin.webp">
                <i class='bx bx-loader-circle'></i>
            </div>
            <a class="headerRight-menu" href="/Change-Password">
                <img src="Element/Element/Gear.png">
                <p>设置</p>
            </a>
            <a class="headerRight-menu" href="/Purchase">
                <img src="Element/Element/User.png">
                <p>我的</p>
            </a>
        </div>
      `;
  
      // 获取并更新钱包金额
      await fetchWalletAmount(); // 调用更新钱包余额的方法
  
      // 从 localStorage 获取更新后的钱包金额
      const updatedWalletAmount = localStorage.getItem('walletAmount');
  
      // 格式化钱包金额
      const formattedWalletAmount = formatWalletAmount(updatedWalletAmount);
  
      // 更新 header-balance 内容
      const headerBalance = `${formattedWalletAmount}`;
      const balanceDiv = document.querySelector('.header-balance');
      balanceDiv.innerHTML = `
        <img src="Element/Icon/Coin.webp">
        <div class="headerRight-balance">${headerBalance}</div>
      `;
    }
  }
  
  // 调用 Google Apps Script 获取钱包余额
  async function fetchWalletAmount() {
    const username = localStorage.getItem("username");
  
    if (!username) {
      // 如果未登录，显示提示信息
      headerDiv.innerHTML = `
        <div class="welcome-message">请登录以继续</div>
        <a href="login"><button class="plsLogin-button">立即登录</button></a>
      `;
      return; // 提前退出函数
    }
  
    // Google Apps Script 部署的 URL
    const scriptURL = "https://script.google.com/macros/s/AKfycbynE2xV579-Dh76FKRRBowXocfTypdsTyw6Ucki8n4oksnhZ1OdNDHWB-x0w_P_ibVJ/exec";
  
    try {
      // 调用 API 获取钱包余额
      const response = await fetch(`${scriptURL}?action=getWalletAmount&username=${encodeURIComponent(username)}`);
      const result = await response.json();
  
      if (result.success) {
        const walletAmount = result.walletAmount;
  
        // 更新 localStorage 的 walletAmount
        localStorage.setItem("walletAmount", walletAmount);
      } else {
        // alert(`加载中！请稍等片刻`);
        console.log(`${result.message}`);
      }
    } catch (error) {
        // alert(`加载中！请稍等片刻`);
      console.log(`${result.message}`);
    }
  }

// 格式化钱包金额，确保有两位小数并包含千位分隔符
function formatWalletAmount(amount) {
    // 转换为浮点数，并格式化为包含千位分隔符和两位小数
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
        return '0'; // 如果金额无效，返回默认值
    }
    return numAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}


// 退出登录功能
function logout() {
    // 清除登录信息
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('fullName');
    localStorage.removeItem('wanumber');
    localStorage.removeItem('walletAmount');

    // 跳转回登录页面
    window.location.href = 'login';
}

document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname;

    // 检查路径是否以 .html 结尾
    if (currentPath.endsWith('.html')) {
        const newPath = currentPath.slice(0, -5);
        history.replaceState(null, '', newPath);
    }
});

// 计算购物车中的产品数量并显示在 countCart 元素中
function updateCartCount() {
  // 从 localStorage 获取购物车数据
  const cart = JSON.parse(localStorage.getItem('cart')) || [];  // 默认是空数组

  // 获取购物车中产品的数量
  const cartCount = cart.length;

  // 获取显示购物车数量的元素
  const countCartElement = document.getElementById('countCart');

  // 更新显示的内容
  countCartElement.textContent = `购物车 (${cartCount})`;
}

    // 获取元素
    const usernameInput = document.getElementById('username');
    const wanumberInput = document.getElementById('wanumber'); // Update input ID
    const oldPasswordInput = document.getElementById('old-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const editButton = document.getElementById('edit-btn');

    // 模拟 Google Sheets API URL（替换为实际URL）
    const API_URL = 'https://script.google.com/macros/s/AKfycby8FtAtMyuDhd11NnxuazCKXuS8qvNA1u1N_zZJUH5vkrwRWh28DBQQ4wAfiiNEh-qI/exec'; 

    // 从 localStorage 获取用户信息
    const storedUsername = localStorage.getItem('username');
    const storedWanumber = localStorage.getItem('wanumber'); // Update to get wanumber
    const storedPassword = localStorage.getItem('password'); // 假设密码也存储在 localStorage

    // 在第一个 input 中显示 username
    usernameInput.value = storedUsername;
    wanumberInput.value = storedWanumber;

    // 初始状态下所有 input 不可编辑
    let isEditable = false;

    // 当用户点击 Edit 按钮后，允许修改四个 input
    editButton.addEventListener('click', function() {
      if (!isEditable) {
        // 允许修改输入框
        oldPasswordInput.disabled = false;
        newPasswordInput.disabled = false;
        confirmPasswordInput.disabled = false;

        // 将按钮文字改为 Update
        editButton.textContent = '保存密码';
        isEditable = true;
      } else {
        // 点击 Update 按钮后，执行密码修改逻辑
        const oldPassword = oldPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // 检查旧密码是否正确
        if (oldPassword !== storedPassword) {
            alert('旧密码不正确 ！');
            return;
        }

        // 检查新密码是否一致
        if (newPassword !== confirmPassword) {
            alert('新密码和确认密码不一致 ！');
            return;
        }

        // 请求发送到 Google Sheets 保存新密码
        updatePassword(storedUsername, newPassword, oldPassword);  // 传递旧密码
    }
});

// 发送请求到 Google Sheets 保存新密码
function updatePassword(username, newPassword, oldPassword) {
  const formData = new URLSearchParams();
  formData.append('action', 'updatePassword');
  formData.append('username', username);
  formData.append('oldPassword', oldPassword);  // 添加旧密码
  formData.append('newPassword', newPassword);

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      alert('密码更新成功 ！');

      // 更新 localStorage 中的密码
      localStorage.setItem('password', newPassword);

      // 重置输入框并禁用
      oldPasswordInput.value = '';
      newPasswordInput.value = '';
      confirmPasswordInput.value = '';
      oldPasswordInput.disabled = true;
      newPasswordInput.disabled = true;
      confirmPasswordInput.disabled = true;

      // 将按钮文字改回 Edit
      editButton.textContent = 'Edit';
      isEditable = false;
    } else {
      alert(result.message);  // 显示后端返回的错误信息
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('发送了未知错误 ！请重试.');
  });
}


// 页面加载时
window.onload = function() {
    checkLoginStatus();
    updateCartCount();
};
