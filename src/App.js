import { useState } from 'react';
import SimulationRequestCard from './components/SimulationRequestCard';
import ResourceCounter from './components/ResourceCounter';
import './App.css';

// Имитация базы данных из вашей курсовой
const INITIAL_DATA = [
  { id: 'REQ-001', title: 'Турбина ВД', physics: 'CFD', priority: 'Critical', status: 'PROCESSING' },
  { id: 'REQ-002', title: 'Опора вала', physics: 'Механика', priority: 'Medium', status: 'DRAFT' },
  { id: 'REQ-003', title: 'Корпус КЦ', physics: 'Теплообмен', priority: 'High', status: 'VALIDATION' },
];

function App() {
  // Состояние для ролевой модели (RBAC)
  const [role, setRole] = useState('Consultant');
  // Состояние для поиска (Управляемый компонент)
  const [query, setQuery] = useState('');

  // ПОЧЕМУ? Фильтрация вычисляется при каждом рендере (UI = f(state)).
  // Нам не нужен useEffect, React сам пересчитает список при изменении query.
  const filteredData = INITIAL_DATA.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>ЦК: Управление данными</h1>
        <div className="role-selector">
          <label>Войти как: </label>
          {/* Управляемый select: значение привязано к state role */}
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Client_Engineer">Конструктор (Заказчик)</option>
            <option value="Consultant">Консультант КЦ</option>
            <option value="Simulation_Engineer">Инженер ИЦ</option>
          </select>
        </div>
      </header>

      <main className="app-main">
        <section className="section">
          <h2>💻 Вычислительные ресурсы</h2>
          <ResourceCounter />
        </section>

        <section className="section">
          <h2>🔍 Реестр заявок</h2>
          {/* Управляемый инпут для поиска */}
          <input 
            className="search-bar__input"
            type="text" 
            placeholder="ID или объект..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)} 
          />
        </section>

        <div className="course-grid">
          {/* JUNIOR: Рендеринг списка через map. ПОЧЕМУ key? 
              Virtual DOM использует ID для точечного обновления элементов. */}
                        {filteredData.length > 0 ? (
            filteredData.map(item => (
              <SimulationRequestCard key={item.id} {...item} role={role} />
            ))
          ) : (
            <p>Заявок не найдено.</p>
          )}
        </div>
      </main>
    </div>
  );
}
export default App;