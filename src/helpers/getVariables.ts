export type AppVariableType = {
  '--primary-25': string;
  '--primary-50': string;
  '--primary-100': string;
  '--primary-200': string;
  '--primary-300': string;
  '--primary-400': string;
  '--primary-500': string;
  '--primary-600': string;
  '--primary-700': string;
  '--primary-800': string;
  '--primary-900': string;
  '--gray-25': string;
  '--gray-50': string;
  '--gray-100': string;
  '--gray-200': string;
  '--gray-300': string;
  '--gray-400': string;
  '--gray-500': string;
  '--gray-600': string;
  '--gray-700': string;
  '--gray-800': string;
  '--gray-900': string;
  '--transparent-gb-gray-150': string;
  '--transparent-gb-gray-300': string;
  '--transparent-gb-gray-500': string;
  '--transparent-gb-gray-700': string;
  '--transparent-gb-gray-900': string;
  '--transparent-gb-white-100': string;
  '--transparent-gb-white-150': string;
  '--transparent-gb-white-300': string;
  '--transparent-gb-white-500': string;
  '--transparent-gb-white-700': string;
  '--transparent-gb-white-900': string;
  '--error-25': string;
  '--error-50': string;
  '--error-100': string;
  '--error-200': string;
  '--error-300': string;
  '--error-400': string;
  '--error-500': string;
  '--error-600': string;
  '--error-700': string;
  '--error-800': string;
  '--error-900': string;
};

/**
 * Get css variables
 * @see styles/variables.css
 * @warn не использовать там где есть SSR
 */
export const getVariables = <T extends keyof AppVariableType>(variable: T): string | undefined => {
  if (typeof window === 'undefined') return;
  return getComputedStyle(document.body).getPropertyValue(variable);
};
