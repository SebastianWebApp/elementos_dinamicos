import { useState } from "react";
import { Letras, Numeros, Decimal } from "./Validaciones";

type Props = {
  size?: string;
  alignment?: string;
  color_texto?: string;
};

export function TextArea(props: Props) {
  const { size, alignment, color_texto } = props;

  return (
    <textarea
      className={`custom-textarea mt-2 ${alignment} ${size}`}
      style={{ height: "100px", color: color_texto }}
      placeholder="Escribe aquí..."
    />
  );
}

export function SoloLetras(props: Props) {
  const { size, alignment, color_texto } = props;

  const [value, setValue] = useState("");

  const handleChange = (valor: string) => {
    if (Letras(valor)) {
      setValue(valor);
    }
  };

  return (
    <textarea
      className={`custom-textarea mt-2 ${alignment} ${size}`}
      style={{ height: "100px", color: color_texto }}
      placeholder="Escribe aquí..."
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}

export function SoloNumeros(props: Props) {
  const { size, alignment, color_texto } = props;
  const [value, setValue] = useState("");
  const handleChange = (valor: string) => {
    if (Numeros(valor)) {
      setValue(valor);
    }
  };

  return (
    <input
      className={`custom-textarea mt-2 ${alignment} ${size}`}
      style={{ color: color_texto }}
      placeholder="Escribe aquí..."
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}

export function ConDecimal(props: Props) {
  const { size, alignment, color_texto } = props;
  const [value, setValue] = useState("");
  const handleChange = (valor: string) => {
    if (Decimal(valor)) {
      setValue(valor);
    }
  };

  return (
    <input
      className={`custom-textarea mt-2 ${alignment} ${size}`}
      style={{ color: color_texto }}
      placeholder="Escribe aquí..."
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}

export function Fecha(props: Props) {
  const { size, alignment, color_texto } = props;

  return (
    <input
      type="date"
      className={`custom-textarea mt-2 ${alignment} ${size}`}
      style={{ color: color_texto }}
    />
  );
}
