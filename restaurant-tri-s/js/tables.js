// РАБОТА СО СТОЛИКАМИ

function renderTables() {
    const tableGrid = document.getElementById('tableGrid');
    if (!tableGrid) return;
    
    tableGrid.innerHTML = '';
    
    if (appData.tables.length === 0) {
        tableGrid.innerHTML = '<div class="empty-message">Нет столиков</div>';
        return;
    }
    
    appData.tables.forEach(table => {
        const tableElement = document.createElement('div');
        tableElement.className = `table ${table.status}`;
        tableElement.innerHTML = `
            <div class="table-number">${table.number}</div>
            <div class="table-status">
                ${table.status === 'free' ? '🟢 Свободен' : '🔴 Занят'}
            </div>
            <div class="table-capacity">👥 ${table.capacity} чел.</div>
        `;
        
        tableElement.addEventListener('click', () => {
            toggleTableStatus(table);
        });
        
        tableGrid.appendChild(tableElement);
    });
}

function toggleTableStatus(table) {
    if (table.status === 'free') {
        table.status = 'occupied';
        showNotification(`Столик ${table.number} занят`);
    } else {
        table.status = 'free';
        showNotification(`Столик ${table.number} свободен`);
    }
    renderTables();
    saveData();
}

function getOccupiedTablesCount() {
    return appData.tables.filter(table => table.status === 'occupied').length;
}