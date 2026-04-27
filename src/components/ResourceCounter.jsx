import { useState } from 'react';

export default function ResourceCounter() {
  /**
   * ПОЧЕМУ useState именно здесь?
   * Это состояние инкапсулировано внутри компонента. Глобальному App не нужно 
   * перерисовываться при каждом клике по счетчику ядер, пока мы не решим 
   * отправить эти данные в общую базу. Это оптимизирует производительность.
   */
  const [cores, setCores] = useState(1); // Инициализация: минимум 1 ядро

  /**
   * ПОЧЕМУ функциональное обновление (prev => prev + 1)?
   * Это гарантия точности. Если пользователь кликнет 10 раз очень быстро, 
   * "prev" обеспечит корректную очередь обновлений, не пропуская ни одного шага.
   */
  const add = () => setCores(prev => (prev < 64 ? prev + 1 : prev)); // Лимит кластера 64
  const remove = () => setCores(prev => (prev > 1 ? prev - 1 : prev)); // Защита от 0

  return (
    <div className="resource-counter">
      <h4>Конфигурация ресурсов HPC</h4>
      <div className="counter-ui">
        {/* Вызов функций изменения состояния по клику */}
        <button onClick={remove} className="btn-counter">-</button>
        <span className="cores-display">{cores} Ядер CPU</span>
        <button onClick={add} className="btn-counter">+</button>
      </div>
      
      {/* Условный рендеринг: показываем предупреждение только при превышении лимита */}
      {cores >= 16 && (
        <p className="hpc-warning">⚠️ Требуется согласование администратора кластера</p>
      )}
    </div>
  );
}