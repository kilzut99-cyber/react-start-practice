import { useState, useEffect } from 'react';
import SimulationRequestCard from './components/SimulationRequestCard';
import ResourceCounter from './components/ResourceCounter';
import './App.css';

// Начальные данные (Mock-объекты для демонстрации темы курсовой)
const INITIAL_DATA = [
  { id: 'REQ-01', title: 'Ротор двигателя', physics: 'Механика', priority: 'high', status: 'todo' },
  { id: 'REQ-02', title: 'Охлаждение ТВД', physics: 'Теплообмен', priority: 'medium', status: 'in-progress' },
  { id: 'REQ-03', title: 'Входной конус', physics: 'CFD', priority: 'low', status: 'done' },
];

export default function App() {
  // Инициализация задач: ленивая загрузка из LocalStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('hpc_manager_v2');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [role, setRole] = useState('Consultant'); // Состояние роли (RBAC)
  const [query, setQuery] = useState('');         // Состояние поиска (Управляемый инпут)

  /**
   * ПОЧЕМУ useEffect?
   * Он используется как "наблюдатель" за массивом [tasks]. Как только любая карточка 
   * меняет статус или удаляется, эффект автоматически сохраняет актуальный реестр 
   * в память браузера (localStorage), обеспечивая сохранность данных проекта.
   */
  useEffect(() => {
    localStorage.setItem('hpc_manager_v2', JSON.stringify(tasks));
  }, [tasks]);

  // Реактивная фильтрация: пересчитывается автоматически при каждом вводе в поиск
  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase()) || 
    t.id.toLowerCase().includes(query.toLowerCase())
  );

  // Обработчик движения карточки по этапам жизненного цикла
  const moveTask = (id, direction) => {
    const STAGES = ['todo', 'in-progress', 'done'];
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextIdx = STAGES.indexOf(t.status) + (direction === 'next' ? 1 : -1);
        if (nextIdx >= 0 && nextIdx < STAGES.length) {
          return { ...t, status: STAGES[nextIdx] }; // Возврат нового объекта (Immutability)
        }
      }
      return t;
    }));
  };

  // Удаление задачи с системным подтверждением
  const deleteTask = (id) => {
    if (window.confirm(`Вы уверены, что хотите удалить заявку ${id}?`)) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>ЦК: Управление симуляциями</h1>
        <div className="role-box">
          <label>Доступ: </label>
          {/* Управляемый компонент (select) связанный со стейтом role */}
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Consultant">Консультант (Админ)</option>
            <option value="Client_Engineer">Инженер (Просмотр)</option>
          </select>
        </div>
      </header>

      <main className="container">
        {/* Блок настройки ресурсов (инкапсулированный стейт) */}
        <ResourceCounter />

        <section className="search-area">
          <input 
            className="search-input"
            placeholder="Поиск по ID или объекту..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Синхронизация инпута со стейтом
          />
        </section>

        <div className="kanban-grid">
          {/* Динамический рендеринг колонок */}
          {['todo', 'in-progress', 'done'].map(stage => (
            <div key={stage} className="kanban-column">
              <h3>{stage === 'todo' ? '📋 Очередь' : stage === 'in-progress' ? '⚙️ В расчёте' : '✅ Результат'}</h3>
              <div className="task-list">
                {/* Отрисовка карточек с использованием УНИКАЛЬНОГО ID как ключа */}
                {filteredTasks.filter(t => t.status === stage).map(task => (
                  <SimulationRequestCard 
                    key={task.id} // ПОЧЕМУ? Чтобы React не пересоздавал весь список при фильтрации
                    {...task}    // Прокидываем все свойства объекта сразу (Spread)
                    role={role}
                    onMove={moveTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}