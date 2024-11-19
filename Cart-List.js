document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function (e) {
    if (e.keyCode == 123) { // F12
        e.preventDefault();
    }
});

// 检查用户登录状态
async function checkLoginStatus() {
    const username = localStorage.getItem('username');
    const cartCount = cart.length;
    const number = localStorage.getItem('wanumber');
    const walletAmount = localStorage.getItem('walletAmount');
    const headerDiv = document.getElementById('header');

    if (!username) {
        // 如果未登录，要求用户先登录并跳转到登录页面
        window.location.href = 'login';  // 重定向到登录页面
    } else {
        // 如果已登录，显示欢迎信息和加载状态
        headerDiv.innerHTML = `
            <div onclick="window.history.back()"><i class="fa-solid fa-arrow-left"></i></div>
            <span>购物车 (${cartCount})</span>
            <div class="header-balance">
                <i class="fa-solid fa-coins"></i>
            <i class='bx bx-loader-circle'></i> <!-- 显示加载图标 -->
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
        <i class="fa-solid fa-coins"></i>
        <div class="welcome-message">${headerBalance}</div>
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
        alert(`加载中！请稍等片刻`);
        console.log(`${result.message}`);
      }
    } catch (error) {
        alert(`加载中！请稍等片刻`);
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

// 获取购物车中的产品数据
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 显示购物车中的产品
function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutButton = document.getElementById('checkoutButton');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    
    cartItemsContainer.innerHTML = ''; // 清空现有内容

    let totalPrice = 0;  // 总价
    let selectedCount = 0; // 已选中产品的数量

    // 如果购物车为空，显示提示
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="ifCartBlank">购物车中没有物品</p>';
        totalPriceElement.innerHTML = '总价：<i class="fa-solid fa-coins"></i> 0';
        checkoutButton.textContent = '结账 (0)';
        return;
    }

    // 遍历购物车中的每个产品
    cart.forEach(product => {
        const [name, category, price, image, status, date] = product;

        // 创建购物车项
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('product-checkbox');
        checkbox.checked = true; // 默认选中
        checkbox.addEventListener('change', () => updateTotalPrice());

        // 创建产品信息部分
        const productImg = document.createElement('img');
        productImg.src = image;
        productImg.alt = name;

        // 为图片绑定点击事件，弹出大图
        productImg.addEventListener('click', () => showPopup(image));

        const details = document.createElement('div');
        details.classList.add('details');

        const productName = document.createElement('div');
        productName.classList.add('product-name');
        productName.textContent = name;

        const productPrice = document.createElement('div');
        productPrice.classList.add('product-price');
        productPrice.innerHTML = `<i class="fa-solid fa-coins"></i> ${parseFloat(price)}`;

        details.appendChild(productName);
        details.appendChild(productPrice);

        // 删除按钮
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash-can');
        deleteIcon.addEventListener('click', () => removeProduct(product));

        // 组合整个购物车项
        const actions = document.createElement('div');
        actions.classList.add('actions');
        actions.appendChild(deleteIcon);

        cartItem.appendChild(checkbox);
        cartItem.appendChild(productImg);
        cartItem.appendChild(details);
        cartItem.appendChild(actions);

        cartItemsContainer.appendChild(cartItem);
    });

    // 监听全选复选框的状态变化
    selectAllCheckbox.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked; // 设置所有复选框与全选框状态一致
        });
        updateTotalPrice(); // 更新总价
    });

    // 更新总价和选中产品的数量
    updateTotalPrice();
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

// 用户自己删除购物车内的产品
function removeProduct(product) {
    // 从购物车中移除该产品
    cart = cart.filter(item => item[0] !== product[0]); // 比较产品名称

    // 更新 localStorage 和页面显示
    localStorage.setItem('cart', JSON.stringify(cart)); // 更新 localStorage 中的购物车数据
    displayCart(); // 刷新页面上的购物车显示
}

// 更新选中复选框的总价和已选中的产品数量
function updateTotalPrice() {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutButton = document.getElementById('checkoutButton');
    let totalPrice = 0;
    let selectedCount = 0;

    // 计算选中的产品总价和数量
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const product = cart[index];
            totalPrice += parseFloat(product[2]);
            selectedCount++;
        }
    });

    totalPriceElement.innerHTML = `总价：<i class="fa-solid fa-coins"></i> ${totalPrice}`;
    checkoutButton.textContent = `结账 (${selectedCount})`; // 更新结账按钮文本
}

// 结账后删除已经购买的产品
function deleteProduct(product) {
    // 从购物车中移除该产品
    cart = cart.filter(item => item[0] !== product.name);  // 注意使用 `product.name`

    // 更新 localStorage 和页面显示
    localStorage.setItem('cart', JSON.stringify(cart));  // 更新 localStorage 中的购物车数据
    displayCart();  // 刷新页面上的购物车显示
}

// 当购物车或产品选择状态发生变化时更新按钮状态
document.addEventListener('change', () => {
    updateCheckoutButtonState();
});

// 结账按钮功能
document.getElementById('checkoutButton').addEventListener('click', async () => {
    const checkoutButton = document.getElementById('checkoutButton');
    
    // 禁用按钮并更改文本
    checkoutButton.disabled = true;
    checkoutButton.textContent = '处理中...';

    const totalPriceElement = document.getElementById('totalPrice');
    const totalPrice = parseFloat(totalPriceElement.textContent.replace('总价：', ''));
    const walletAmount = parseFloat(localStorage.getItem('walletAmount'));
    const username = localStorage.getItem('username');
    
    // 检查用户是否登录
    if (!username) {
        alert('请先登录！');
        resetCheckoutButton();
        return;
    }

    // 检查余额是否足够
    if (walletAmount < totalPrice) {
        alert('余额不足，请先充值！');
        window.location.href = 'Reload-Points.html';
        resetCheckoutButton();
        return;
    }

    // 保存购买前余额
    const beforeBalance = walletAmount;

    // 扣除余额并更新 localStorage
    const newWalletAmount = walletAmount - totalPrice;
    localStorage.setItem('walletAmount', newWalletAmount.toFixed(2));

    // 保存购买后余额
    const afterBalance = newWalletAmount;

    // 获取已选择的产品
    const products = getSelectedProducts();

    // 保存购买记录到 Google Sheets
    const purchaseLog = {
        username,
        products,
        beforeBalance,
        afterBalance,
        timestamp: new Date().toLocaleString('zh-CN', { hour12: false })
    };

    try {
        const response = await savePurchaseLog(purchaseLog, username, newWalletAmount);
        if (response.success) {
            alert('付款成功！感谢您的购买。');
            
            // 从购物车中移除已购买的产品
            removePurchasedProducts(products);
            
            // 清空购物车并更新 localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart(); // 更新页面上的购物车显示
            checkLoginStatus();
            window.location.href = 'Purchase';
        } else {
            alert('付款失败，请稍后再试。');
        }
    } catch (error) {
        alert(`付款失败，请稍后再试。${error.message}`);
    }

    // 处理完成后恢复按钮状态
    resetCheckoutButton();
});

// 获取选中的产品
function getSelectedProducts() {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    const selectedProducts = [];
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const product = cart[index];
            selectedProducts.push({
                name: product[0],       // 产品名称
                category: product[1],
                price: product[2],      // 产品价格
                link: product[3],       // 产品链接
                image: product[4],      // 产品图片
            });
        }
    });
    return selectedProducts;
}

// 保存购买记录到 Google Sheets，并更新余额
async function savePurchaseLog(purchaseLog, username, newWalletAmount) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyZ_6RRdmA9ZxDKXIj8hG4cCbPVvXoojkYO5m_a2D3wwXJqFO_voB-2np410wpukrR3/exec'; // 替换为您的 Google Apps Script 部署 URL
    const response = await fetch(`${scriptURL}?action=savePurchaseLog`, {
        method: 'POST',
        body: JSON.stringify(purchaseLog)
    });

    // 更新余额到 Google Sheets 的 Users 页面
    const updateBalanceResponse = await updateUserBalance(username, newWalletAmount);
    if (!updateBalanceResponse.success) {
        alert('付款失败，请稍后再试。');
    }

    return response.json();
}

// 更新用户余额到 Google Sheets
async function updateUserBalance(username, newBalance) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwdRGV1AiJd2mvIFZOBoyjn77Boild8arwCH0JAzFqB3lCCaaKkYffsOeRB3AO7FnaF/exec'; // 替换为您的 Google Apps Script 部署 URL
    const response = await fetch(`${scriptURL}?action=updateBalance`, {
        method: 'POST',
        body: JSON.stringify({ username, newBalance })
    });
    return response.json();
}

// 从购物车中移除已购买的产品
function removePurchasedProducts(selectedProducts) {
    selectedProducts.forEach(selectedProduct => {
        deleteProduct(selectedProduct);  // 删除每个选中的产品
    });

    // 购物车已更新，重新保存到 localStorage
    localStorage.setItem('cart', JSON.stringify(cart));  // 确保购物车更新到 localStorage

    // 刷新购物车显示
    displayCart();
}

// 检查购物车并更新按钮状态
function updateCheckoutButtonState() {
    const checkoutButton = document.getElementById('checkoutButton');
    const selectedProducts = getSelectedProducts();
    checkoutButton.disabled = selectedProducts.length === 0;
}

// 恢复结账按钮的初始状态
function resetCheckoutButton() {
    const checkoutButton = document.getElementById('checkoutButton');
    checkoutButton.disabled = false;
    checkoutButton.textContent = '结账';
}


// 页面加载时显示购物车内容
window.onload = function() {
    checkLoginStatus();
    displayCart()
    updateCheckoutButtonState();
};
