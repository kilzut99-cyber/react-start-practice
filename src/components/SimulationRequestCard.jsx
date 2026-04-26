// ПОЧЕМУ деструктуризация? Мы сразу объявляем переменные из объекта props.
// Это избавляет от повторений слова "props.title", делая код чище.
export default function SimulationRequestCard({ id, title, status, priority, physics, role }) {
  
  // Создаем динамический класс. В Лекции (стр. 12) сказано: UI зависит от данных.
  const priorityClass = `badge priority-${priority?.toLowerCase()}`;

  return (
    <div className="course-card">
      {/* JUNIOR: Условный рендеринг: бейдж рисуется только если есть приоритет */}
      {priority && <span className={priorityClass}>{priority}</span>}
      
      <h3 className="course-card__title">Заявка: {id}</h3>
      <p>Объект испытаний: <strong>{title}</strong></p>
      <p>Тип физики: {physics}</p>
      
      {/* PRO: RBAC Модель (Матрица прав доступа из вашего ТЗ) */}
      <div className="card-actions">
        {/* Конструктор видит правку только на черновиках */}
        {role === 'Client_Engineer' && status === 'DRAFT' && <button>Изменить ТЗ</button>}
        
        {/* Консультант видит кнопку управления всегда */}
        {role === 'Consultant' && <button>Назначить ИЦ</button>}
      </div>
      
      {/* Условный текст: если статуса нет, пишем "НОВАЯ" */}
      <small className="status-tag">Статус: {status || 'НОВАЯ'}</small>
    </div>
  );
}