export const Letras = (valor: string) => {
  return /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(valor);
};

export const Numeros = (valor: string) => {
  return /^[0-9]*$/.test(valor);
};

export const Decimal = (valor: string): boolean => {
  return /^\d*(\.\d*)?$/.test(valor);
};
