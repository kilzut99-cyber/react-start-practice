import { useState } from 'react';

export default function ResourceCounter() {
  /**
   * ПОЧЕМУ useState? 
   * Состояние 'cores' хранится внутри компонента, так как это локальный 
   * выбор параметров расчета (инкапсуляция). Это не нужно передавать 
   * пропсами, пока форма не отправлена.
   */
  const [cores, setCores] = useState(1);

  // ПОЧЕМУ функциональное обновление? (prev => prev + 1)
  // Это гарантирует, что мы работаем с актуальным значением из очереди обновлений,
  // исключая баги при множественных быстрых кликах.
  const add = () => setCores(prev => prev + 1);
  const remove = () => cores > 1 && setCores(prev => prev - 1);

  return (
    <div className="counter">
      <p className="counter__value">{cores} Ядер</p>
      <div className="counter__buttons">
        <button onClick={add}>+</button>
        <button onClick={remove}>-</button>
      </div>
      {/* Сообщение по условию (PRO) */}
      {cores >= 16 && <p style={{color: 'red', fontSize: '12px'}}>⚠️ Лимит HPC превышен</p>}
    </div>
  );
}
