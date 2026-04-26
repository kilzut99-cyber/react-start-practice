// 1. ИМПОРТЫ
// ПОЧЕМУ useState? Нужен для создания реактивных переменных (состояния).
// ПОЧЕМУ useEffect? Нужен для синхронизации данных с LocalStorage (побочный эффект).
import { useState, useEffect } from 'react'; 
// ПОЧЕМУ logo? Импортируем SVG как объект, чтобы React мог вставить его в DOM.
import logo from './logo.svg';    
// Импорт дочерних компонентов (принцип декомпозиции: разделяй и властвуй).
import SimulationRequestCard from './components/SimulationRequestCard'; 
import ResourceCounter from './components/ResourceCounter';         
// Подключение CSS-стилей (включая темную тему и анимацию логотипа).
import './App.css';               

// Исходные данные для первого запуска (имитация строк из твоей БД).
const INITIAL_DATA = [
  { id: 'REQ-001', title: 'Турбина ВД', physics: 'CFD', priority: 'high', status: 'todo' },
  { id: 'REQ-002', title: 'Опора вала', physics: 'Механика', priority: 'medium', status: 'in-progress' },
  { id: 'REQ-003', title: 'Корпус КЦ', physics: 'Теплообмен', priority: 'low', status: 'done' },
];

export default function App() {
  // 2. СОСТОЯНИЯ (STATE)
  /**
   * ПОЧЕМУ такая инициализация? Это "ленивая" загрузка. 
   * При запуске React проверяет localStorage. Если там есть сохраненные задачи — 
   * берет их (через JSON.parse), иначе берет INITIAL_DATA.
   */
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('kc_tasks_v1');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  // Состояние для роли (RBAC) и поискового запроса (Controlled Input).
  const [role, setRole] = useState('Consultant');
  const [query, setQuery] = useState('');

  // 3. ЭФФЕКТЫ (SIDE EFFECTS)
  /**
   * ПОЧЕМУ useEffect? Он следит за массивом [tasks]. 
   * Как только любая карточка перемещена или удалена, эффект срабатывает 
   * и перезаписывает базу в localStorage (превращая массив в строку JSON).
   */
  useEffect(() => {
    localStorage.setItem('kc_tasks_v1', JSON.stringify(tasks));
  }, [tasks]);

  // 4. ВЫЧИСЛЯЕМАЯ ЛОГИКА (UI = f(state))
  /**
   * ПОЧЕМУ фильтрация здесь? Это "реактивный" поиск. 
   * Переменная пересчитывается автоматически при каждом рендере, если изменился query.
   */
  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) || 
    t.id.toLowerCase().includes(query.toLowerCase())
  );

  // 5. ОБРАБОТЧИКИ СОБЫТИЙ (HANDLERS)
  // Логика перемещения карточки между колонками Kanban.
  const moveTask = (id, direction) => {
    const ORDER = ['todo', 'in-progress', 'done']; // Массив этапов ЖЦ задачи.
    // Используем .map() для создания НОВОГО массива (соблюдаем ТАБУ на мутации).
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextIdx = ORDER.indexOf(t.status) + (direction === 'next' ? 1 : -1);
        // Проверка: не выходим ли мы за пределы первой/последней колонки.
        if (nextIdx >= 0 && nextIdx < ORDER.length) {
          return { ...t, status: ORDER[nextIdx] }; // Возвращаем копию с новым статусом.
        }
      }
      return t; // Остальные задачи возвращаем "как есть".
    }));
  };

  // Удаление задачи с подтверждением.
  const deleteTask = (id) => {
    if (window.confirm('Удалить заявку из реестра КЦ?')) {
      // .filter() создает новый массив, в котором нет элемента с этим ID.
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  // 6. ОТРИСОВКА (JSX)
  return (
    <div className="App">
      {/* ШАПКА: Логотип + Заголовок + Выбор Роли */}
      <header className="app-header">
        <div className="header-brand">
          <img src={logo} className="App-logo" alt="logo" /> {/* Анимированный логотип React */}
          <h1>ЦК: Управление испытаниями</h1>
        </div>
        <div className="role-selector">
          <label>Режим доступа: </label>
          {/* Управляемый select: его значение привязано к стейту role */}
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Consultant">Консультант (Админ)</option>
            <option value="Client_Engineer">Конструктор (Просмотр)</option>
          </select>
        </div>
      </header>

      <main className="app-main">
        {/* БЛОК HPC: Демонстрация локального useState в дочернем компоненте */}
        <section className="section">
          <h2>💻 Вычислительные ресурсы кластера</h2>
          <ResourceCounter />
        </section>

        {/* ПОИСК: Демонстрация управляемого инпута (Controlled Component) */}
        <section className="section">
          <input 
            className="search-bar__input" 
            placeholder="Поиск по ID (REQ-...) или объекту..."
            value={query} 
            onChange={(e) => setQuery(e.target.value)} // Синхронизируем ввод со стейтом.
          />
          <small>Найдено результатов: {filteredTasks.length}</small>
        </section>

        {/* КАНБАН-ДОСКА: Рендеринг списков через .map() */}
        <div id="board">
          {['todo', 'in-progress', 'done'].map(columnStatus => (
            <div key={columnStatus} className="column">
              <h3 className="column-title">
                {/* Условное отображение заголовка колонки */}
                {columnStatus === 'todo' ? '📋 План' : columnStatus === 'in-progress' ? '⚙️ В работе' : '✅ Готово'}
              </h3>
              <div className="task-list">
                {/* Отрисовываем только те задачи, чья стадия совпадает с колонкой */}
                {filteredTasks.filter(t => t.status === columnStatus).map(task => (
                  <SimulationRequestCard 
                    key={task.id}   // ОБЯЗАТЕЛЬНО: уникальный ключ для оптимизации React.
                    {...task}       // Spread-оператор: прокидываем все свойства объекта сразу.
                    role={role}     // Передаем роль для настройки прав внутри карточки.
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