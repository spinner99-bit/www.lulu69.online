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
      // 如果未登录，显示提示信息
      headerDiv.innerHTML = `
        <div class="welcome-message">请登录以继续</div>
        <a href="login"><button class="plsLogin-button">立即登录</button></a>
      `;
    } else {
      // 如果已登录，显示欢迎信息和加载状态
      headerDiv.innerHTML = `
        <div class="header-userInfo">
          <i class="fa-solid fa-user"></i>
          <div class="welcome-message">${number}</div>
        </div>
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

const categoryDataUrl = 'https://script.google.com/macros/s/AKfycbz0RhbfORVEizH4uRROHAWVZNJirHagYi8nTlN36kMdbCsmoLObGqAcS2ze6NVeu5gWZg/exec';
const productDataUrl = 'https://script.google.com/macros/s/AKfycbwSfik_ANhvIY9DcEB61sMO66xYSnD9aZhtj4xVigMIzqZGdW44OtgGBSu6sTrYqBmbNw/exec?type=getActiveProduct';
const purchaseLogUrl = 'https://script.google.com/macros/s/AKfycbwczl3ir64QEATYVdkUFdx4QLAPDpOPlD8kcGWjmRfI_ffVwYUWdIoS7kT7JDCw2B7A/exec'; // 替换为实际部署的 URL

// Global variables to store categories and products
let categories = [];
let allProducts = [];
let purchasedProducts = []; // 存储用户已购买的产品
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage

const username = localStorage.getItem('username'); // 从 localStorage 获取用户名


// 如果用户名存在，调用 fetchPurchasedProducts
if (username) {
    fetchPurchasedProducts(username);
} else {
    console.warn('Username not found in localStorage');
}

async function fetchCategories() {
    try {
        const response = await fetch(categoryDataUrl);
        const data = await response.json();
        if (data && data.options) {
            categories = data.options;  // Categories are in "options" array

            // Ensure that categories are fetched before calling displayCategories
            await fetchProducts(); // Wait for products to load before calling displayCategories
        } else {
            console.error('Categories data is missing or incorrectly formatted');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function fetchProducts() {
    try {
        productLoading.style.display = 'block'; // 显示加载动画

        const response = await fetch(productDataUrl);
        const data = await response.json();
        if (data && data.data) {
            allProducts = data.data;  // Products are in "data" array

            // Now call displayCategories with the loaded categories and allProducts
            displayCategories(categories); // Display categories once all products are loaded
        } else {
            console.error('Products data is missing or incorrectly formatted');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// 获取用户已购买的产品
async function fetchPurchasedProducts(username) {
    try {
        const response = await fetch(`${purchaseLogUrl}?action=getPurchaseLog&username=${username}`);
        const data = await response.json();
        if (data.success && data.records) {
            purchasedProducts = data.records.map(record => record[0]); // 假设产品名称在第一列

            // 打印返回的所有数据和已购买的产品列表
            // console.log('Fetched data:', data);
            // console.log('Purchased products:', purchasedProducts);
        } else {
            console.warn('No purchased products found.');
        }
    } catch (error) {
        console.error('Error fetching purchased products:', error);
    }
}


document.getElementById('categoryContainer').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === '全部') {
        displayProducts(allProducts); // 如果选择的是全部，显示所有产品
    } else {
        filterProductsByCategory(selectedCategory);
    }
});

function displayCategories(categories) {
    const categoryContainer = document.getElementById('categoryContainer');
    categoryContainer.innerHTML = ''; // 清空现有选项

    // 默认显示所有产品的选项
    const allOption = document.createElement('option');
    allOption.value = '全部';
    allOption.textContent = `全部 (${allProducts.length})`; // 显示所有产品的数量
    categoryContainer.appendChild(allOption);

    // 为每个分类创建一个选项并显示产品数量
    categories.forEach(category => {
        const normalizedCategory = category.trim().toLowerCase();

        // 过滤符合当前分类的产品
        const filteredProducts = allProducts.filter(product => {
            const productCategory = product[1].trim().toLowerCase();
            return productCategory === normalizedCategory;
        });

        // 调试：输出每个分类和过滤后的产品数量
        // console.log(`Category: ${category}, Filtered Products: ${filteredProducts.length}`);

        const option = document.createElement('option');
        option.value = category;
        option.textContent = `${category} (${filteredProducts.length})`; // 显示分类和数量

        if (filteredProducts.length === 0) {
            option.disabled = true;
        }

        categoryContainer.appendChild(option);
    });

    // 默认显示所有产品
    displayProducts(allProducts);
}

// 根据选定的分类过滤产品
function filterProductsByCategory(selectedCategory) {
    const normalizedCategory = selectedCategory.trim().toLowerCase();
    const filteredProducts = allProducts.filter(product => {
        const productCategory = product[1].trim().toLowerCase();
        return productCategory === normalizedCategory;
    });

    // 调试：输出过滤后的产品数量
    // console.log(`Filtered Products for '${selectedCategory}': ${filteredProducts.length}`);

    displayProducts(filteredProducts);
}


async function displayProducts(products) {
    const productContainer = document.getElementById('productContainer');
    const productLoading = document.getElementById('productLoading'); // 获取加载图标

    // 显示加载动画
    productLoading.style.display = 'block';

    productContainer.innerHTML = ''; // 清空现有内容

    // 模拟产品加载（假设是异步操作，实际情况下可以是从API获取数据）
    setTimeout(() => {
        // 当所有产品加载完成，隐藏加载动画
        productLoading.style.display = 'none';

        if (products.length === 0) {
            productContainer.innerHTML = '<p>No products found.</p>';
        } else {
            products.forEach(product => {
                const [name, category, price, link, image, status, date] = product;

                const productCard = document.createElement('div');
                productCard.classList.add('product-card');

                // 创建产品图片
                const img = document.createElement('img');
                img.src = image;
                img.alt = name;

                // 为图片绑定点击事件，弹出大图
                img.addEventListener('click', () => showPopup(image));

                const nameCategoryDiv = document.createElement('div');
                nameCategoryDiv.classList.add('name-category');

                // 创建产品名称和分类
                const productName = document.createElement('p');
                productName.classList.add('home-productName');
                productName.textContent = name;

                const productCategory = document.createElement('p');
                productCategory.classList.add('home-productCategory');
                productCategory.textContent = category;

                nameCategoryDiv.appendChild(productName);
                nameCategoryDiv.appendChild(productCategory);

                // 创建产品价格
                const productPrice = document.createElement('p');
                productPrice.classList.add('home-productPrice');
                productPrice.innerHTML = `<i class="fa-solid fa-coins"></i> ${parseFloat(price)}`;

                // 创建添加到购物车图标
                const addToCartIcon = document.createElement('i');
                addToCartIcon.classList.add('home-productAddCart');
                addToCartIcon.classList.add('fa-solid', 'fa-cart-plus');

                // 检查该产品是否已购买
                const isPurchased = purchasedProducts.includes(name);
                const isInCart = cart.some(item => item[0] === product[0]);

                if (isPurchased) {
                    // 如果已购买，显示 'fa-folder-open' 并启用点击事件
                    addToCartIcon.classList.remove('fa-cart-plus');
                    addToCartIcon.classList.add('fa-file-circle-check');
                    addToCartIcon.style.color = 'green'; // 设置颜色为红色
                
                    // 启用点击事件
                    addToCartIcon.style.pointerEvents = 'auto'; // 启用点击事件
                
                    // 添加点击事件跳转到 pla.html
                    addToCartIcon.addEventListener('click', () => {
                        // 跳转到 pla.html
                        window.location.href = 'Purchase';
                    });
                } else if (isInCart) {
                    // 如果已添加到购物车，显示 'fa-square-check'
                    addToCartIcon.classList.add('fa-cart-plus');
                    addToCartIcon.style.color = '#20a520'; // 设置颜色为绿色
                }

                addToCartIcon.addEventListener('click', () => toggleCart(addToCartIcon, product));

                // 创建价格和购物车容器
                const priceCartDiv = document.createElement('div');
                priceCartDiv.classList.add('price-cart');
                priceCartDiv.appendChild(productPrice);
                priceCartDiv.appendChild(addToCartIcon);

                // 将元素添加到产品卡片
                const productInfo = document.createElement('div');
                productInfo.classList.add('product-info');
                productInfo.appendChild(nameCategoryDiv);  // 添加名称和分类容器
                productInfo.appendChild(priceCartDiv);    // 添加价格和购物车容器

                productCard.appendChild(img);
                productCard.appendChild(productInfo);

                // 将产品卡片添加到容器
                productContainer.appendChild(productCard);
            });
        }
    }, 500); // 模拟延迟
}

// 确保用户已登录后才执行某些操作
async function fetchAndDisplayProducts() {
    const username = localStorage.getItem('username');
    if (username) {
        // 获取已购买的产品
        await fetchPurchasedProducts(username);
    }
    await fetchCategories();
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

// Toggle cart icon (change from shopping to added state) and save to localStorage
function toggleCart(icon, product) {
    // 检查是否有存储的用户信息（表示用户是否已登录）
    const user = localStorage.getItem('username');  // 假设你在登录时将用户信息存储在 localStorage 中

    if (!user) {
        // 如果没有找到用户，提示用户登录
        alert('请先登录才能添加资源到购物车 !');
        // 跳转到登录页面
        window.location.href = 'login'; 
        return; // 终止函数执行，不再进行后续操作
    }

    const productIndex = cart.findIndex(item => item[0] === product[0]); // 查找购物车中的产品

    if (productIndex === -1) {
        // 如果产品不在购物车中，添加它
        cart.push(product);
        icon.classList.remove('fa-cart-plus');
        icon.classList.add('fa-cart-plus');
        icon.style.color = '#20a520'; // 添加到购物车时更改颜色
    } else {
        // 如果产品已经在购物车中，移除它
        cart.splice(productIndex, 1);
        icon.classList.remove('fa-cart-plus');
        icon.classList.add('fa-cart-plus');
        icon.style.color = ''; // 重置颜色
    }

    // 更新购物车并保存到 localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // 更新购物车数量
    updateCartCount();
}

// 页面加载时
window.onload = function() {
    checkLoginStatus();
    fetchCategories();
    fetchProducts();
    updateCartCount();
};
