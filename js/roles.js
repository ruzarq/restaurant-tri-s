// УПРАВЛЕНИЕ РОЛЯМИ ПОЛЬЗОВАТЕЛЕЙ

function initRoles() {
    // Добавляем обработчики для кнопок ролей
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            setRole(role);
        });
    });
    
    // Устанавливаем начальную роль
    setRole(appData.currentRole);
}

function setRole(role) {
    appData.currentRole = role;
    
    // Обновляем кнопки
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[data-role="${role}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Показываем нужный интерфейс
    document.getElementById('waiter-interface').classList.add('hidden');
    document.getElementById('cook-interface').classList.add('hidden');
    document.getElementById('manager-interface').classList.add('hidden');
    
    const targetInterface = document.getElementById(`${role}-interface`);
    if (targetInterface) {
        targetInterface.classList.remove('hidden');
    }
    
    // Обновляем данные для роли
    updateRoleInterface(role);
    saveData();
}

function updateRoleInterface(role) {
    switch(role) {
        case 'waiter':
            renderTables();
            renderMenuCategories();
            renderDishes();
            renderCart();
            break;
        case 'cook':
            renderKitchenOrders();
            break;
        case 'manager':
            renderStats();
            break;
    }
}