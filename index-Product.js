document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function (e) {
    if (e.keyCode == 123) { // F12
        e.preventDefault();
    }
});

// 检查用户是否是第一次访问
if (!localStorage.getItem('firstVisit')) {
    // 第一次访问，延迟3秒后显示弹窗和遮罩层
    setTimeout(function() {
        document.getElementById('firstVisit-popUp').style.display = 'block';
        document.getElementById('overlay').style.display = 'block'; // 显示背景遮罩
    }, 3000); // 3000毫秒 = 3秒

    // 设置 localStorage 标记，之后再访问就不会弹窗
    localStorage.setItem('firstVisit', 'true');
}

// 关闭弹窗的功能
document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('firstVisit-popUp').style.display = 'none'; // 隐藏弹窗
    document.getElementById('overlay').style.display = 'none'; // 隐藏背景遮罩
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

const categoryDataUrl = 'https://script.google.com/macros/s/AKfycbwX_6CEh5ag-oWEfKKuxs534ZscyVtti5-9vE-kEBRIiLEAfC1M6wdT6C-NKx7XgYtM/exec?action=getWebCategory';
const productDataUrl = 'https://script.google.com/macros/s/AKfycbwWB9lrviSo_w4EuKuF--AQVR_kgks91EIsP0epDLgMaofZPiiuD0PbsahJ1erJuAlL/exec?action=getWebProducts';
const purchaseLogUrl = 'https://script.google.com/macros/s/AKfycbx7UJW9iZGwLvghAIGvguZk2ZlUDSNssv-0pBibk7fappjtgZrI_mwLCGcMg7Gp7lnH/exec'; // 替换为实际部署的 URL

// Global variables to store categories and products
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
let purchasedProducts = []; // 存储用户已购买的产品
let cart = JSON.parse(localStorage.getItem('cart')) || []; // 从 localStorage 加载购物车数据
let isFetchingCategories = false;
let isFetchingProducts = false;

const username = localStorage.getItem('username'); // 获取用户名

function refeshPurchasedProduct(){
    if (username) {
        fetchPurchasedProducts(username);
    } else {
        console.warn('Username not found in localStorage');
    }
}

const cacheTime = localStorage.getItem('cacheTime');
const cacheDuration = 1000 * 60 * 60 * 4; // 4 小时缓存时间
const isCacheExpired = !cacheTime || Date.now() - cacheTime > cacheDuration;

if (isCacheExpired) {
    console.log('Cache expired or not found. Fetching new data...');
    fetchCategories(); // 重新获取类别
    fetchAndDisplayProducts()
    localStorage.setItem('cacheTime', Date.now()); // 更新缓存时间
} else {
    console.log('Using cached categories and products');
    fetchAndDisplayProducts()
    displayCategories(categories);
}

// 获取分类数据
async function fetchCategories() {
    if (isFetchingCategories) return;
    isFetchingCategories = true;

    try {
        const response = await fetch(categoryDataUrl);
        const data = await response.json();
        if (data && data.options) {
            categories = data.options;
            localStorage.setItem('categories', JSON.stringify(categories));

            // 确保获取产品数据后再显示类别
            await fetchProducts();
            displayCategories(categories); // 这里调用
        } else {
            console.error('Categories data is missing or incorrectly formatted');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    } finally {
        isFetchingCategories = false;
    }
}

// 获取产品数据
async function fetchProducts() {
    if (isFetchingProducts) return;
    isFetchingProducts = true;

    try {
        const response = await fetch(productDataUrl);
        const data = await response.json();
        if (data && data.data) {
            allProducts = data.data;
            localStorage.setItem('allProducts', JSON.stringify(allProducts));
        } else {
            console.error('Products data is missing or incorrectly formatted');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        isFetchingProducts = false;
    }
}

// 获取用户已购买的产品
async function fetchPurchasedProducts(username) {
    try {
        const response = await fetch(`${purchaseLogUrl}?action=getPurchaseLog&username=${username}`);
        const data = await response.json();
        localStorage.setItem('purchaseProduct', JSON.stringify(data));
        if (data.success && data.records) {
            purchasedProducts = data.records.map(record => record[0]); // 假设产品名称在第一列
        } else {
            console.warn('No purchased record found.');
        }
    } catch (error) {
        console.error('Error fetching purchased products:', error);
    }
}

// 确保用户已登录后才执行某些操作
async function fetchAndDisplayProducts() {
    const username = localStorage.getItem('username');
    if (username) {
        // 获取已购买的产品
        fetchPurchasedProducts(username);
    }
    await fetchCategories();
}

async function displayCategories(categories) {
    const categoryContainer = document.getElementById('categoryContainer');
    categoryContainer.innerHTML = '';

    // 默认显示所有产品选项
    const allOption = document.createElement('option');
    allOption.value = '全部';
    allOption.textContent = `全部 (${allProducts.length})`;
    categoryContainer.appendChild(allOption);

    // 为每个分类创建选项
    categories.forEach(category => {
        const filteredProducts = allProducts.filter(product => 
            product[1].some(cat => cat.toLowerCase() === category.toLowerCase())
        );

        const option = document.createElement('option');
        option.value = category;
        option.textContent = `${category} (${filteredProducts.length})`;

        if (filteredProducts.length === 0) {
            option.disabled = true;
        }

        categoryContainer.appendChild(option);
    });

    displayProducts(allProducts); // 默认显示所有产品
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
            productContainer.innerHTML = '<p>努力加载资源中...</p>';
        } else {
            products.forEach(product => {
                const [name, categories, price, image, status, date] = product;

                const productCard = document.createElement('div');
                productCard.classList.add('product-card');

                // 创建产品图片
                const img = document.createElement('img');
                img.src = image;
                img.alt = name;

                // 为图片绑定点击事件，弹出大图
                img.addEventListener('click', () => showPopup(image));

                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('image-wrapper');
                imageWrapper.appendChild(img);

                const nameCategoryDiv = document.createElement('div');
                nameCategoryDiv.classList.add('name-category');

                // 创建产品名称和分类
                const productName = document.createElement('p');
                productName.classList.add('home-productName');
                productName.textContent = name;

                const productCategory = document.createElement('p');
                productCategory.classList.add('home-productCategory');
                productCategory.textContent = categories.join(' '); // 显示所有分类

                nameCategoryDiv.appendChild(productName);
                nameCategoryDiv.appendChild(productCategory);

                // 创建产品价格
                const productPrice = document.createElement('p');
                productPrice.classList.add('home-productPrice');
                productPrice.innerHTML = `<img src="Element/Icon/Coin.webp" class="productPrice-coin"> ${parseFloat(price)}`;

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
                    addToCartIcon.style.pointerEvents = 'none'; // 禁用点击
                
                    // 启用点击事件
                    // addToCartIcon.style.pointerEvents = 'auto'; // 启用点击事件
                
                    // 添加点击事件跳转到 pla.html
                    addToCartIcon.addEventListener('click', () => {
                        // 跳转到 pla.html
                        window.location.href = 'Purchase';
                    });
                } else if (isInCart) {
                    // 如果已添加到购物车，显示 'fa-square-check'
                    addToCartIcon.classList.add('fa-cart-plus');
                    addToCartIcon.style.color = '#fbbc04'; // 设置颜色为绿色
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

                productCard.appendChild(imageWrapper); // 添加 imageWrapper 到 productCard
                productCard.appendChild(productInfo);

                // 将产品卡片添加到容器
                productContainer.appendChild(productCard);
            });
        }
    }, ); // 模拟延迟
}

// 监听类别切换事件
document.getElementById('categoryContainer').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === '全部') {
        displayProducts(allProducts); // 如果选择的是全部，显示所有产品
    } else {
        filterProductsByCategory(selectedCategory);
    }
});

// 根据选定的分类过滤产品
function filterProductsByCategory(selectedCategory) {
    if (selectedCategory === '全部') {
        displayProducts(allProducts);
        return;
    }

    const normalizedCategory = selectedCategory.toLowerCase();
    const filteredProducts = allProducts.filter(product => 
        product[1].some(cat => cat.toLowerCase() === normalizedCategory)
    );

    displayProducts(filteredProducts);
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
        icon.style.color = '#fbbc04'; // 添加到购物车时更改颜色
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

const swiperContainer = document.querySelector('.swiperContainer');
const images = document.querySelectorAll('.swiperContainer img');
const progressDotsContainer = document.querySelector('.progressDots'); 
let currentIndex = 0;
let totalImages = images.length;
let autoPlayInterval;
let startX = 0;
let isDragging = false;
let diffX = 0;  // 用于记录拖动的差值
let initialTransform = 0;  // 记录拖动开始时的初始位移

// 生成进度条上的点
function generateProgressDots() {
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('div');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSwiperPosition();
            updateProgressDots();
        });
        progressDotsContainer.appendChild(dot);
    }
    updateProgressDots();
}

// 更新进度点的状态
function updateProgressDots() {
    const dots = document.querySelectorAll('.progressDots div');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentIndex) {
            dot.classList.add('active');
        }
    });
}

// 更新滑动位置
function updateSwiperPosition() {
    const offset = -currentIndex * 100;
    swiperContainer.style.transform = `translateX(${offset}%)`;
}

// 切换到下一张图片
function nextImage() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateSwiperPosition();
    updateProgressDots();
}

// 切换到上一张图片
function prevImage() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateSwiperPosition();
    updateProgressDots();
}

// 启动自动播放
function startAutoPlay() {
    autoPlayInterval = setInterval(nextImage, 3000); // 每3秒切换一次
}

// 停止自动播放
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// 鼠标拖动切换图片
swiperContainer.addEventListener('mousedown', (e) => {
    startX = e.pageX;
    isDragging = true;
    initialTransform = parseInt(swiperContainer.style.transform.replace('translateX(', '').replace('%)', '') || 0); // 记录初始位移
    swiperContainer.style.cursor = 'grabbing'; // 设置为抓取手型
    images.forEach(img => img.classList.add('dragging')); // 拖动时添加拖动效果
});

swiperContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    diffX = e.pageX - startX; // 计算拖动差值
    const moveX = initialTransform + (diffX / window.innerWidth) * 100; // 根据差值计算新的位移

    swiperContainer.style.transform = `translateX(${moveX}%)`; // 更新滑动位置
});

swiperContainer.addEventListener('mouseup', () => {
    isDragging = false;
    swiperContainer.style.cursor = 'pointer'; // 恢复鼠标样式为指针
    images.forEach(img => img.classList.remove('dragging')); // 移除拖动效果

    // 根据拖动的距离判断是否切换图片
    if (diffX > 50) {
        nextImage();
    } else if (diffX < -50) {
        prevImage();
    } else {
        updateSwiperPosition(); // 否则回到原来的位置
    }
    stopAutoPlay();
    startAutoPlay(); // 重启自动播放
});

swiperContainer.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        swiperContainer.style.cursor = 'pointer'; // 恢复鼠标样式
        images.forEach(img => img.classList.remove('dragging')); // 移除拖动效果
        updateSwiperPosition(); // 重置图片位置
    }
});

// 页面加载时，确保在 DOM 加载后启动自动播放
document.addEventListener('DOMContentLoaded', () => {
    generateProgressDots(); // 生成进度条点
    updateSwiperPosition();
    updateProgressDots();
    startAutoPlay(); // 启动自动播放
});


// 页面加载时
window.onload = function() {
    checkLoginStatus();
    updateCartCount();
    fetchAndDisplayProducts();
};
