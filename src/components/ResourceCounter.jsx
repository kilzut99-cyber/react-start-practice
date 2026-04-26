import { useState } from 'react';

export default function ResourceCounter() {
  // ПОЧЕМУ useState(1)? Состояние инкапсулировано внутри компонента,
  // так как выбор количества ядер — это локальное действие пользователя.
  const [cores, setCores] = useState(1);

  // ПОЧЕМУ prev => prev + 1? Это функциональное обновление. 
  // Оно гарантирует точность, если пользователь нажмет кнопку 10 раз очень быстро.
  const add = () => setCores(prev => prev + 1);
  const remove = () => {
    // JUNIOR: Защита от логической ошибки (нельзя использовать меньше 1 ядра)
    if (cores > 1) setCores(prev => prev - 1);
  };

  return (
    <div className="counter">
      <p className="counter__value">{cores} Ядер CPU</p>
      <div className="counter__buttons">
        <button onClick={add}>+</button>
        <button onClick={remove}>-</button>
      </div>
      {/* PRO: Условный рендеринг предупреждения по достижению лимита */}
      {cores >= 16 && <p style={{color: 'red'}}>⚠️ Лимит HPC требует согласования!</p>}
    </div>
  );
}
