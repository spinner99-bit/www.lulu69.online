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

document.addEventListener("DOMContentLoaded", async () => {
  const productCardsContainer = document.getElementById("productCards");
  const productLoading = document.getElementById("productLoading");
  const username = localStorage.getItem("username");
  const myDataCount = document.getElementById("myDataCount");

  // 如果用户未登录，跳转到登录页面
  if (!username) {
      alert("请先登录！");
      window.location.href = "login.html";
      return;
  }

  // 显示加载动画
  productLoading.style.display = "block";

  // Google Apps Script API URL
  const scriptURL = 'https://script.google.com/macros/s/AKfycbx7UJW9iZGwLvghAIGvguZk2ZlUDSNssv-0pBibk7fappjtgZrI_mwLCGcMg7Gp7lnH/exec'; // 替换为实际的 Google Apps Script 部署 URL

  try {
      // 发送请求获取购买记录
      const response = await fetch(`${scriptURL}?action=getPurchaseLog&username=${username}`);
      const data = await response.json();

      if (data.success && data.records.length > 0) {
          const records = data.records;

          displayProducts(data.records);
          myDataCount.textContent = records.length;
      } else {
          productCardsContainer.innerHTML = "<p>暂无购买记录。</p>";
          myDataCount.textContent = 0; // 如果没有记录，显示 0
      }
  } catch (error) {
      console.error("获取购买记录失败：", error);
      productCardsContainer.innerHTML = "<p>无法加载购买记录，请稍后再试。</p>";
      myDataCount.textContent = 0;
  } finally {
      // 隐藏加载动画
      productLoading.style.display = "none";
  }
});

// 显示产品卡片
function displayProducts(products) {
  const productCardsContainer = document.getElementById("productCards");

  products.forEach(product => {
      const [name, category, price, link, image] = product;

      // 创建产品卡片
      const card = document.createElement("div");
      card.classList.add("product-card");

      // 添加产品图片
      const img = document.createElement("img");
      img.src = image;
      img.alt = name;

      // 为图片绑定点击事件，弹出大图
      img.addEventListener('click', () => showPopup(image));

      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('image-wrapper');
      imageWrapper.appendChild(img);

      // 创建信息容器
      const info = document.createElement("div");
      info.classList.add("product-info");

      // 创建名称和类别容器
      const nameCategory = document.createElement("div");
      nameCategory.classList.add("name-category");

      const productName = document.createElement("p");
      productName.classList.add('home-productName');
      productName.textContent = name;

      const productCategory = document.createElement("p");
      productCategory.classList.add('home-productCategory');
      productCategory.textContent = category;

      nameCategory.appendChild(productName);
      nameCategory.appendChild(productCategory);

      // 创建按钮容器
      const openProductLink = document.createElement("div");
      openProductLink.classList.add("open-productLink");

      const button = document.createElement("button");
      button.innerHTML = `<i class="fa-solid fa-folder-open"></i> 打开资源`;
      button.addEventListener("click", () => {
          window.open(link, "_blank");
      });

      openProductLink.appendChild(button);

      // 组合卡片内容
      info.appendChild(nameCategory);  // 添加名称和类别容器
      info.appendChild(openProductLink);  // 添加按钮容器
      card.appendChild(imageWrapper);  // 添加图片
      card.appendChild(info);  // 添加产品信息

      // 添加卡片到页面
      productCardsContainer.appendChild(card);
  });
}


// 弹出窗口显示图片的功能
function showPopup(url) {
  // 检查是否已有弹窗，避免重复
  if (document.getElementById('popup')) return;

  const popup = document.createElement('div');
  popup.id = 'popup';
  popup.style.position = 'fixed';
  popup.style.top = '0';
  popup.style.left = '0';
  popup.style.width = '100vw';
  popup.style.height = '100vh';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  popup.style.display = 'flex';
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'center';
  popup.style.zIndex = '1000';

  // 点击弹窗外部关闭弹窗
  popup.addEventListener('click', hidePopup);

  const img = document.createElement('img');
  img.src = url;
  img.style.maxWidth = '90%';
  img.style.maxHeight = '90%';
  img.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.7)';
  img.style.borderRadius = '10px';
  img.style.zIndex = '1001';

  // 点击图片时阻止事件冒泡，避免关闭弹窗
  img.addEventListener('click', event => {
      event.stopPropagation();
  });

  popup.appendChild(img);
  document.body.appendChild(popup);
}

// 隐藏弹窗的功能
function hidePopup() {
  const popup = document.getElementById('popup');
  if (popup) {
      popup.remove();
  }
}

function displayUserInfo() {
  // 从 localStorage 获取值
  const fullName = localStorage.getItem('fullName') || 'No Full Name';
  const wanumber = localStorage.getItem('wanumber') || 'No Phone';
  const username = localStorage.getItem('username') || 'No Username';

  // 将值显示到对应的 HTML 元素
  document.getElementById('fullName-Details').textContent = fullName;
  document.getElementById('phone-Details').textContent = wanumber;
  document.getElementById('username-Details').textContent = username;
}


// 页面加载时
window.onload = function() {
  checkLoginStatus();
  updateCartCount();
  displayUserInfo()
};
