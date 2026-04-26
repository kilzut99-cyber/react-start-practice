import { useState } from 'react';

export default function ResourceCounter() {
  /**
   * ПОЧЕМУ useState? 
   * Состояние выбора ядер инкапсулировано здесь. Оно не нужно глобальному App, 
   * пока пользователь не нажмет "Отправить заявку".
   */
  const [cores, setCores] = useState(1);

  // PRO: Функциональное обновление — гарантия точности при быстрых кликах
  const add = () => setCores(prev => prev + 1);
  const remove = () => cores > 1 && setCores(prev => prev - 1);

  return (
    <div className="counter">
      <p className="counter__value">{cores} Ядер CPU</p>
      <div className="counter__buttons">
        <button onClick={add}>+1</button>
        <button onClick={remove}>-1</button>
      </div>
      {cores >= 16 && <p className="warning">⚠️ Требуется согласование лимитов</p>}
    </div>
  );
}