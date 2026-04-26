/**
 * ПОЧЕМУ деструктуризация? ({ id, title... })
 * Позволяет сразу видеть структуру данных объекта Simulation_Request из БД.
 * Это чище, чем писать props.id, props.title и т.д.
 */
export default function SimulationRequestCard({ id, title, physics, status, priority, role, onMove, onDelete }) {
  
  const priorityLabels = { low: '🟢 Низкий', medium: '🟡 Средний', high: '🔴 Высокий' };

  return (
    <div className={`task-card ${priority === 'high' ? 'priority-high' : ''}`}>
      <h3 className="course-card__title">Заявка: {id}</h3>
      <p>Объект: <strong>{title}</strong></p>
      <span className={`priority-badge ${priority}`}>{priorityLabels[priority]}</span>
      
      {/* JUNIOR: Условный рендеринг кнопок на основе РОЛИ (RBAC) */}
      <div className="card-actions">
        {status !== 'todo' && (
          <button onClick={() => onMove(id, 'prev')}>←</button>
        )}
        
        {/* Консультант может двигать вперед и удалять */}
        {role === 'Consultant' && (
          <>
            {status !== 'done' && <button onClick={() => onMove(id, 'next')}>→</button>}
            <button className="btn-danger" onClick={() => onDelete(id)}>✕</button>
          </>
        )}
      </div>
      <small className="status-tag">Физика: {physics}</small>
    </div>
  );
}