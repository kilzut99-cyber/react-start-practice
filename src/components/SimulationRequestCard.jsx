/**
 * ПОЧЕМУ деструктуризация? ({ id, title... })
 * Это позволяет сразу видеть интерфейс данных компонента и избавляет от 
 * дублирования слова 'props.' во всем коде, что улучшает читаемость.
 */
export default function SimulationRequestCard({ id, title, status, priority, physics, role }) {
  
  // Формируем класс для стилизации приоритета (Critical, High и т.д.)
  const priorityClass = `badge priority-${priority?.toLowerCase()}`;

  return (
    <div className="course-card">
      {/* Условный рендеринг бейджа приоритета (Уровень JUNIOR) */}
      {priority && <span className={priorityClass}>{priority}</span>}
      
      <h3 className="course-card__title">ID: {id}</h3>
      <p>Изделие: <strong>{title}</strong></p>
      <p>Физика процесса: {physics}</p>

      {/* Логика кнопок согласно матрице прав доступа из курсовой */}
      <div className="card-actions">
        {role === 'Client_Engineer' && status === 'DRAFT' && (
          <button onClick={() => alert('Редактирование ТЗ')}>✏️ Изменить ТЗ</button>
        )}
        
        {role === 'Consultant' && (
          <button onClick={() => alert('Назначение ИЦ')}>⚖️ Выбрать ИЦ</button>
        )}
      </div>

      {/* Условный текст, если статус не указан */}
      <small className="status-tag">Статус: {status || 'Обработка ОРИ...'}</small>
    </div>
  );
}
