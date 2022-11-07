/**
 * Функция считает скейл исходя из размера вьюпорта, и устанавливает их в цсс переменные
 */
export const calculateScaleDimension = (width: number, height: number, startD: number):void => {
  const d = Math.round(Math.sqrt(width ** 2 + height ** 2));
  // прибавляем дополнительную погрешность чтобы скейл гарантированно улетал за экран
  const targetScale = Math.round(d / startD) + 3;
  document.documentElement.style.setProperty('--start-scale', targetScale.toString());
};
