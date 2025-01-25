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
        <div onclick="window.history.back()" class="cartList-BackIcon"><img src="Element/Element/Arrow-Left.png"></div>
        <span>购物车 (${cartCount})</span>
          <div class="header-balance">
              <img src="Element/Icon/Coin.webp">
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
          <img src="Element/Icon/Coin.webp">
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
        totalPriceElement.innerHTML = '<img src="Element/Icon/Coin.webp"> 0';
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

        const productPriceWraper = document.createElement('div');
        productPriceWraper.classList.add('productPrice-Wrapper');

        const productPrice = document.createElement('div');
        productPrice.classList.add('product-price');
        productPrice.innerHTML = `<img src="Element/Icon/Coin.webp"> ${parseFloat(price)}`;

        productPriceWraper.appendChild(productPrice);
        
        details.appendChild(productName);
        details.appendChild(productPriceWraper);

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

    totalPriceElement.innerHTML = `<img src="Element/Icon/Coin.webp"> ${totalPrice}`;
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

document.getElementById('checkoutButton').addEventListener('click', async () => {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    const username = localStorage.getItem('username'); // 从 LocalStorage 获取用户名
    const selectedProducts = [];

    // 获取选中的产品名称
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedProducts.push(cart[index][0]); // 产品名称是 cart[index][0]
        }
    });

    if (selectedProducts.length === 0) {
        alert('请选择至少一个产品进行结账！');
        return;
    }

    // 显示支付处理中的提示
    document.getElementById('paymentResult').style.display = 'block';
    document.getElementById('productLoading').style.display = 'block';
    document.getElementById('successfulPay').style.display = 'none';
    document.getElementById('UnsuccessfulPay').style.display = 'none';

    // 构造数据
    const formData = new FormData();
    formData.append('username', username);
    formData.append('products', JSON.stringify(selectedProducts)); // 将产品名称数组序列化为字符串

    try {
        const response = await fetch(
            'https://script.google.com/macros/s/AKfycbyunBpZ2XbMg_4fRDSp9IqtyYlXopfx-WfEO0zZKTWNH5RewpQKdmHbqJYU5Se0W99_/exec?action=proccessPurchase', // 替换为你的Google Apps Script网址
            {
                method: 'POST',
                body: formData,
            }
        );

        const result = await response.json();
        if (result.success) {
            // 结账成功
            document.getElementById('successfulPay').style.display = 'block';
            document.getElementById('productLoading').style.display = 'none';
            document.getElementById('UnsuccessfulPay').style.display = 'none';

            // 在 1.3 秒后播放音频
            setTimeout(() => {
                const audio = new Audio('Element/applepay.mp3');
                audio.play();

                // 等待音频播放结束后，再等待 3 秒后跳转
                audio.onended = () => {
                    setTimeout(() => {
                        window.location.href = 'Purchase'; // 跳转到 Purchase 页面
                    }, 2000); // 等待 2 秒
                };
            }, 1300);

            // 更新 LocalStorage 中的 walletAmount
            localStorage.setItem('walletAmount', result.balanceAfter);

            // 清空购物车并更新显示
            cart = cart.filter(product => !selectedProducts.includes(product[0]));
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            checkLoginStatus(); // 如果需要更新登录状态
        } else {
            document.getElementById('UnsuccessfulPay').style.display = 'none';
            alert(result.message || '结账失败！请稍后重试。');
            document.getElementById('paymentResult').style.display = 'none';
            document.getElementById('productLoading').style.display = 'none';
        }
    } catch (error) {
        console.error('结账失败:', error);
        alert('网络错误，请稍后重试！');
        document.getElementById('paymentResult').style.display = 'none';
        document.getElementById('UnsuccessfulPay').style.display = 'none';
        document.getElementById('productLoading').style.display = 'none';
    }
});

window.onload = function() {
    checkLoginStatus();
    displayCart()
};
