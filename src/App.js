import { useState } from 'react';
import SimulationRequestCard from './components/SimulationRequestCard';
import ResourceCounter from './components/ResourceCounter';
import './App.css';

// Данные имитируют записи из твоей таблицы Simulation_Request (стр. 36 PDF)
const INITIAL_REQUESTS = [
  { id: 'REQ-001', title: 'Турбина ВД', physics: 'CFD', priority: 'Critical', status: 'PROCESSING' },
  { id: 'REQ-002', title: 'Опора вала', physics: 'Механика', priority: 'Medium', status: 'DRAFT' },
  { id: 'REQ-003', title: 'Корпус КЦ', physics: 'Теплообмен', priority: 'High', status: 'VALIDATION' },
];

function App() {
  const [role, setRole] = useState('Consultant');
  const [query, setQuery] = useState('');

  // Фильтрация данных по названию или ID
  const filteredItems = INITIAL_REQUESTS.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>ЦК: Управление данными</h1>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Client_Engineer">Конструктор</option>
          <option value="Consultant">Консультант</option>
          <option value="Simulation_Engineer">Инженер ИЦ</option>
        </select>
      </header>

      <main className="app-main">
        <section className="section">
          <h2>📊 Ресурсы (useState)</h2>
          <ResourceCounter />
        </section>

        <section className="section">
          <h2>🔍 Поиск в базе (Controlled Input)</h2>
          <input 
            className="search-bar__input"
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Введите ID или объект..."
          />
        </section>

        <section className="section">
          <div className="course-grid">
            {/* JUNIOR: Рендеринг списка через map() */}
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                /**
                 * ПОЧЕМУ key? 
                 * React использует уникальные ключи (ID заявки) для идентификации элементов в DOM.
                 * Это позволяет обновлять только изменившийся элемент, а не весь список целиком.
                 */
                <SimulationRequestCard key={item.id} {...item} role={role} />
              ))
            ) : (
              <p>Заявки не найдены.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

