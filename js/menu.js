// РАБОТА С МЕНЮ

function renderMenuCategories() {
    const menuCategories = document.getElementById('menuCategories');
    if (!menuCategories) return;
    
    menuCategories.innerHTML = '';
    
    appData.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `category-btn ${appData.currentCategory === category.id ? 'active' : ''}`;
        button.innerHTML = `${category.icon} ${category.name}`;
        button.onclick = () => setCategory(category.id);
        menuCategories.appendChild(button);
    });
}

function setCategory(categoryId) {
    appData.currentCategory = categoryId;
    renderMenuCategories();
    renderDishes();
    saveData();
}

function renderDishes() {
    const dishesGrid = document.getElementById('dishesGrid');
    if (!dishesGrid) return;
    
    dishesGrid.innerHTML = '';
    
    const filteredDishes = appData.currentCategory === 'all' 
        ? appData.dishes 
        : appData.dishes.filter(dish => dish.category === appData.currentCategory);
    
    if (filteredDishes.length === 0) {
        dishesGrid.innerHTML = '<div class="empty-message">Нет блюд в этой категории</div>';
        return;
    }
    
    filteredDishes.forEach(dish => {
        const dishElement = document.createElement('div');
        dishElement.className = 'dish-card';
        dishElement.innerHTML = `
            <div class="dish-name">${dish.name}</div>
            <div class="dish-description">${dish.description}</div>
            <div class="dish-footer">
                <div class="dish-price">${formatPrice(dish.price)}</div>
                <button class="action-btn" onclick="addToCart(${dish.id})">+ Добавить</button>
            </div>
        `;
        dishesGrid.appendChild(dishElement);
    });
}