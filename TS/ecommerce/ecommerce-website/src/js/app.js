// Product data with 50 items
const products = [
    { id: 1, name: "Laptop", price: 999, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300", category: "Electronics" },
    { id: 2, name: "Smartphone", price: 699, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300", category: "Electronics" },
    { id: 3, name: "Headphones", price: 199, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", category: "Electronics" },
    { id: 4, name: "Smart Watch", price: 299, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", category: "Electronics" },
    { id: 5, name: "Running Shoes", price: 89, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", category: "Fashion" },
    { id: 6, name: "Backpack", price: 49, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", category: "Accessories" },
    { id: 7, name: "Wireless Mouse", price: 29, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300", category: "Electronics" },
    { id: 8, name: "Keyboard", price: 79, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300", category: "Electronics" },
    { id: 9, name: "Monitor", price: 349, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300", category: "Electronics" },
    { id: 10, name: "Webcam", price: 69, image: "https://images.unsplash.com/photo-1588412079929-790b9f593d8e?w=300", category: "Electronics" },
    { id: 11, name: "USB Cable", price: 12, image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300", category: "Accessories" },
    { id: 12, name: "Power Bank", price: 39, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300", category: "Electronics" },
    { id: 13, name: "Phone Case", price: 19, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300", category: "Accessories" },
    { id: 14, name: "Tablet", price: 449, image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300", category: "Electronics" },
    { id: 15, name: "Camera", price: 899, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300", category: "Electronics" },
    { id: 16, name: "Tripod", price: 45, image: "https://images.unsplash.com/photo-1602394237605-f59df2970c1e?w=300", category: "Accessories" },
    { id: 17, name: "Memory Card", price: 25, image: "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=300", category: "Electronics" },
    { id: 18, name: "Bluetooth Speaker", price: 59, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300", category: "Electronics" },
    { id: 19, name: "Gaming Chair", price: 249, image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=300", category: "Furniture" },
    { id: 20, name: "Desk Lamp", price: 35, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300", category: "Home" },
    { id: 21, name: "Coffee Maker", price: 89, image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300", category: "Home" },
    { id: 22, name: "Water Bottle", price: 22, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300", category: "Accessories" },
    { id: 23, name: "Yoga Mat", price: 28, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300", category: "Sports" },
    { id: 24, name: "Dumbbells", price: 45, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300", category: "Sports" },
    { id: 25, name: "Sunglasses", price: 79, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300", category: "Fashion" },
    { id: 26, name: "Wallet", price: 39, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300", category: "Accessories" },
    { id: 27, name: "Belt", price: 29, image: "https://images.unsplash.com/photo-1624222247344-70a5cd0d0efd?w=300", category: "Fashion" },
    { id: 28, name: "T-Shirt", price: 19, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300", category: "Fashion" },
    { id: 29, name: "Jeans", price: 59, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300", category: "Fashion" },
    { id: 30, name: "Jacket", price: 129, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300", category: "Fashion" },
    { id: 31, name: "Sneakers", price: 99, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300", category: "Fashion" },
    { id: 32, name: "Hat", price: 24, image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=300", category: "Fashion" },
    { id: 33, name: "Scarf", price: 32, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300", category: "Fashion" },
    { id: 34, name: "Gloves", price: 18, image: "https://images.unsplash.com/photo-1614700604664-2e6f6d3a3973?w=300", category: "Fashion" },
    { id: 35, name: "Socks Pack", price: 15, image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=300", category: "Fashion" },
    { id: 36, name: "Office Chair", price: 199, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=300", category: "Furniture" },
    { id: 37, name: "Desk", price: 299, image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300", category: "Furniture" },
    { id: 38, name: "Bookshelf", price: 149, image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=300", category: "Furniture" },
    { id: 39, name: "Table Lamp", price: 42, image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300", category: "Home" },
    { id: 40, name: "Wall Clock", price: 28, image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=300", category: "Home" },
    { id: 41, name: "Plant Pot", price: 16, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300", category: "Home" },
    { id: 42, name: "Candle Set", price: 25, image: "https://images.unsplash.com/photo-1602874801006-2b8e8b5c3f1d?w=300", category: "Home" },
    { id: 43, name: "Throw Pillow", price: 22, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300", category: "Home" },
    { id: 44, name: "Blanket", price: 49, image: "https://images.unsplash.com/photo-1587556930073-32c0ff9c7f4b?w=300", category: "Home" },
    { id: 45, name: "Picture Frame", price: 18, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=300", category: "Home" },
    { id: 46, name: "Notebook", price: 12, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300", category: "Stationery" },
    { id: 47, name: "Pen Set", price: 15, image: "https://images.unsplash.com/photo-1586943759492-0e0b95f7e6c5?w=300", category: "Stationery" },
    { id: 48, name: "Planner", price: 20, image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300", category: "Stationery" },
    { id: 49, name: "Storage Box", price: 19, image: "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=300", category: "Home" },
    { id: 50, name: "Mirror", price: 55, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=300", category: "Home" }
];

// Cart array
let cart = [];

// Create Header with cart count
function createHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <h1>My E-Commerce Store</h1>
        <nav>
            <a href="#home" onclick="showProducts()">Home</a>
            <a href="#products" onclick="showProducts()">Products</a>
            <a href="#cart" id="cart-link" onclick="showCart()">Cart (<span id="cart-count">0</span>)</a>
        </nav>
    `;
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Show products view
function showProducts() {
    document.getElementById('search-bar').style.display = 'block';
    document.getElementById('product-list').style.display = 'grid';
    const cartView = document.getElementById('cart-view');
    if (cartView) cartView.remove();
    displayProducts(products);
}

// Show cart view
function showCart() {
    document.getElementById('search-bar').style.display = 'none';
    document.getElementById('product-list').style.display = 'none';
    
    let cartView = document.getElementById('cart-view');
    if (!cartView) {
        cartView = document.createElement('div');
        cartView.id = 'cart-view';
        document.querySelector('main').appendChild(cartView);
    }
    
    displayCart();
}

// Display cart items
function displayCart() {
    const cartView = document.getElementById('cart-view');
    
    if (cart.length === 0) {
        cartView.innerHTML = `
            <div class="empty-cart">
                <h2>Your Cart is Empty</h2>
                <button onclick="showProducts()" class="continue-shopping">Continue Shopping</button>
            </div>
        `;
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartView.innerHTML = `
        <div class="cart-container">
            <h2>Shopping Cart</h2>
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p class="category">${item.category}</p>
                            <p class="price">$${item.price}</p>
                        </div>
                        <div class="cart-item-quantity">
                            <button onclick="decreaseQuantity(${item.id})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="increaseQuantity(${item.id})">+</button>
                        </div>
                        <div class="cart-item-total">
                            <p>$${(item.price * item.quantity).toFixed(2)}</p>
                            <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-summary">
                <h3>Order Summary</h3>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span>$10.00</span>
                </div>
                <div class="summary-row">
                    <span>Tax:</span>
                    <span>$${(total * 0.1).toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>$${(total + 10 + (total * 0.1)).toFixed(2)}</span>
                </div>
                <button onclick="checkout()" class="checkout-btn">Proceed to Checkout</button>
                <button onclick="showProducts()" class="continue-shopping">Continue Shopping</button>
            </div>
        </div>
    `;
}

// Increase quantity
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        updateCartCount();
        displayCart();
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateCartCount();
        displayCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    displayCart();
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = (total + 10 + (total * 0.1)).toFixed(2);
    
    alert(`Order placed successfully!\nTotal: $${finalTotal}\n\nThank you for your purchase!`);
    cart = [];
    updateCartCount();
    displayCart();
}

// Create Search Bar
function createSearchBar() {
    const searchBar = document.getElementById('search-bar');
    searchBar.innerHTML = `
        <input type="text" id="search-input" placeholder="Search products..." />
        <button id="search-btn">Search</button>
    `;
    
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('search-btn').addEventListener('click', handleSearch);
}

// Handle Search
function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

// Display Products
function displayProducts(productsToDisplay) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productList.innerHTML = '<p class="no-results">No products found.</p>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="category">${product.category}</p>
            <p class="price">$${product.price}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });
    
    // Add event listeners to all add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    createHeader();
    createSearchBar();
    displayProducts(products);
    updateCartCount();
});
