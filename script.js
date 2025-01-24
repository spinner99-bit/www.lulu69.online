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
        <div class="header-userInfo">
            <img src="Element/Element/ID-Card.png">
            <div class="welcome-message">${number}</div>
        </div>
        <div class="header-balance">
            <div>
                <img src="Element/Icon/Coin.webp">
                <i class='bx bx-loader-circle'></i>
            </div>
            <a class="header-csCover" href="https://t.me/lulu69_mega">
                <img scr="Element/Element/Call.png">
                <p>客服</p>
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
        <div class="welcome-message">${headerBalance}</div>
        <a class="header-csCover" href="https://t.me/lulu69_mega">
            <i class="fa-solid fa-headset"></i>
            <p>客服</p>
        </a>
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

// 页面加载时
window.onload = function() {
    checkLoginStatus();
    updateCartCount();
};
