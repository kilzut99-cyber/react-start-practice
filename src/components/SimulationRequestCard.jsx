import React from 'react';

/**
 * ПОЧЕМУ деструктуризация? ({ id, title... })
 * Мы извлекаем поля сразу в параметрах, чтобы не писать везде "props.id".
 * Это делает код самодокументированным: сразу видно, какие данные нужны карточке.
 */
export default function SimulationRequestCard({ 
  id, title, physics, status, priority, role, onMove, onDelete 
}) {
  
  // Словарь для преобразования технического ключа в понятный текст с индикатором
  const priorityLabels = { 
    low: '🟢 Низкий', 
    medium: '🟡 Средний', 
    high: '🔴 Высокий' 
  };

  return (
    // Динамический класс: если приоритет высокий, добавляем спец. стили оформления
    <div className={`task-card ${priority === 'high' ? 'priority-high' : ''}`}>
      <div className="card-header">
        <span className="request-id">Заявка: {id}</span>
        {/* Вывод метки приоритета на основе переданного пропса */}
        <span className={`priority-badge ${priority}`}>
          {priorityLabels[priority]}
        </span>
      </div>
      
      {/* Название объекта испытаний */}
      <h3 className="task-card__title">{title}</h3>
      {/* Дисциплина расчёта (физика процесса) */}
      <p className="task-card__physics">Физика: <strong>{physics}</strong></p>

      {/* Блок действий: реализует RBAC (Role-Based Access Control) */}
      <div className="card-actions">
        {/* Кнопка "назад" доступна всем, если статус не начальный */}
        {status !== 'todo' && (
          <button onClick={() => onMove(id, 'prev')}>←</button>
        )}
        
        {/* ТЗ PRO: Только роль Консультант может двигать задачу вперед и удалять */}
        {role === 'Consultant' && (
          <>
            {status !== 'done' && (
              <button onClick={() => onMove(id, 'next')}>→</button>
            )}
            <button className="btn-danger" onClick={() => onDelete(id)}>✕</button>
          </>
        )}
      </div>
    </div>
  );
}