// ДАННЫЕ ПРИЛОЖЕНИЯ
const appData = {
    currentRole: 'waiter',
    currentCategory: 'all',
    currentOrder: [],
    orders: [],
    
    tables: [
        { id: 1, number: 1, status: 'free', capacity: 4 },
        { id: 2, number: 2, status: 'occupied', capacity: 2 },
        { id: 3, number: 3, status: 'free', capacity: 6 },
        { id: 4, number: 4, status: 'free', capacity: 4 },
        { id: 5, number: 5, status: 'occupied', capacity: 8 },
        { id: 6, number: 6, status: 'free', capacity: 2 }
    ],
    
    dishes: [
        { id: 1, name: 'Борщ', description: 'Свекольный суп со сметаной', price: 250, category: 'starters' },
        { id: 2, name: 'Цезарь', description: 'Салат с курицей и соусом', price: 350, category: 'starters' },
        { id: 3, name: 'Стейк', description: 'Говяжий стейк с овощами', price: 800, category: 'main' },
        { id: 4, name: 'Паста', description: 'Карбонара с беконом', price: 450, category: 'main' },
        { id: 5, name: 'Тирамису', description: 'Итальянский десерт', price: 300, category: 'desserts' },
        { id: 6, name: 'Чизкейк', description: 'Нью-йоркский чизкейк', price: 280, category: 'desserts' },
        { id: 7, name: 'Кофе', description: 'Эспрессо 30мл', price: 150, category: 'drinks' },
        { id: 8, name: 'Сок', description: 'Апельсиновый фреш', price: 200, category: 'drinks' }
    ],
    
    categories: [
        { id: 'all', name: 'Все', icon: '🍽️' },
        { id: 'starters', name: 'Закуски', icon: '🥗' },
        { id: 'main', name: 'Основные', icon: '🍖' },
        { id: 'desserts', name: 'Десерты', icon: '🍰' },
        { id: 'drinks', name: 'Напитки', icon: '🥤' }
    ]
};

// ФУНКЦИИ ДЛЯ РАБОТЫ С LOCALSTORAGE
function saveData() {
    try {
        localStorage.setItem('restaurantData', JSON.stringify(appData));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        showNotification('Ошибка сохранения данных', 'error');
        return false;
    }
}

function loadData() {
    try {
        const saved = localStorage.getItem('restaurantData');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(appData, parsed);
            console.log('Данные загружены из localStorage');
        }
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

// УВЕДОМЛЕНИЯ
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type === 'success' ? 'show' : 'error');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// УТИЛИТЫ
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

function getCurrentDate() {
    return new Date().toLocaleDateString('ru-RU');
}