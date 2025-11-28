// РАБОТА С ЗАКАЗАМИ И КОРЗИНОЙ

function addToCart(dishId) {
    const dish = appData.dishes.find(d => d.id === dishId);
    if (!dish) return;
    
    const existingItem = appData.currentOrder.find(item => item.dish.id === dishId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        appData.currentOrder.push({
            dish: dish,
            quantity: 1
        });
    }
    
    renderCart();
    showNotification(`Добавлено: ${dish.name}`);
}

function removeFromCart(dishId) {
    appData.currentOrder = appData.currentOrder.filter(item => item.dish.id !== dishId);
    renderCart();
    showNotification('Блюдо удалено из заказа');
}

function updateQuantity(dishId, change) {
    const item = appData.currentOrder.find(item => item.dish.id === dishId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(dishId);
        } else {
            renderCart();
        }
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (appData.currentOrder.length === 0) {
        cartItems.innerHTML = '<div class="empty-message">Корзина пуста</div>';
        cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    appData.currentOrder.forEach(item => {
        const itemTotal = item.dish.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.dish.name}</div>
                <div class="cart-item-price">${formatPrice(item.dish.price)} × ${item.quantity} = ${formatPrice(itemTotal)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.dish.id}, -1)">-</button>
                <span style="min-width: 20px; text-align: center;">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.dish.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.dish.id})">🗑️</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = formatPrice(total);
}

function sendOrder() {
    if (appData.currentOrder.length === 0) {
        showNotification('Добавьте блюда в заказ', 'error');
        return;
    }
    
    const total = appData.currentOrder.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
    
    const newOrder = {
        id: Date.now(),
        items: JSON.parse(JSON.stringify(appData.currentOrder)), // глубокое копирование
        status: 'cooking',
        createdAt: new Date().toLocaleString('ru-RU'),
        total: total
    };
    
    appData.orders.push(newOrder);
    appData.currentOrder = [];
    
    renderCart();
    showNotification('Заказ отправлен на кухню!');
    saveData();
}

function renderKitchenOrders() {
    const kitchenOrders = document.getElementById('kitchenOrders');
    if (!kitchenOrders) return;
    
    const activeOrders = appData.orders.filter(order => order.status === 'cooking');
    
    if (activeOrders.length === 0) {
        kitchenOrders.innerHTML = '<div class="empty-message">Нет активных заказов</div>';
        return;
    }
    
    kitchenOrders.innerHTML = '';
    
    activeOrders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'kitchen-order';
        
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <div class="kitchen-order-item">
                    <span>${item.dish.name} × ${item.quantity}</span>
                    <span>${formatPrice(item.dish.price * item.quantity)}</span>
                </div>
            `;
        });
        
        orderElement.innerHTML = `
            <div class="kitchen-order-header">
                <strong>🆔 Заказ #${order.id}</strong>
                <span>${order.createdAt}</span>
            </div>
            <div class="kitchen-order-items">
                ${itemsHtml}
            </div>
            <div style="text-align: right; font-weight: bold; margin-bottom: 1rem;">
                Итого: ${formatPrice(order.total)}
            </div>
            <button class="action-btn" style="width: 100%;" onclick="completeOrder(${order.id})">
                ✅ Заказ готов
            </button>
        `;
        
        kitchenOrders.appendChild(orderElement);
    });
}

function completeOrder(orderId) {
    const order = appData.orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'completed';
        showNotification('Заказ отмечен как готовый!');
        renderKitchenOrders();
        saveData();
    }
}

function renderStats() {
    const today = new Date().toDateString();
    const todayOrders = appData.orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
    );
    
    const totalRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const occupiedTables = getOccupiedTablesCount();
    
    const totalRevenueElem = document.getElementById('totalRevenue');
    const totalOrdersElem = document.getElementById('totalOrders');
    const occupiedTablesElem = document.getElementById('occupiedTables');
    
    if (totalRevenueElem) totalRevenueElem.textContent = formatPrice(totalRevenue);
    if (totalOrdersElem) totalOrdersElem.textContent = todayOrders.length;
    if (occupiedTablesElem) occupiedTablesElem.textContent = occupiedTables;
}