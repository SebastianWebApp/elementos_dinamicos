import { useState, useRef } from "react";
import { TextArea, SoloLetras, SoloNumeros, ConDecimal, Fecha } from "./Inputs";

type ColumnaConfig = {
  tipo: string;
  size?: string;
  align?: string;
  valor?: string;
  tipo_input?: string;
  opciones?: string[];
  file?: File | null;
  width?: number;
};

type Props = {
  preview?: boolean;
  elementos_configuraciones: ColumnaConfig;
  configuracion?: (
    tipo?: string,
    align?: string,
    size?: string,
    value?: string,
    tipo_input?: string,
    opciones?: string[],
    file?: File | null
  ) => void;
};

export function TextoComponent(props: Props) {
  const { preview = false, configuracion, elementos_configuraciones } = props;

  const [alignment, setAlignment] = useState<string>(
    elementos_configuraciones?.align ?? "text-left"
  );
  const [size, setSize] = useState<string>(
    elementos_configuraciones?.size ?? "text-2xl"
  );
  const [textValue, setTextValue] = useState<string>(
    elementos_configuraciones?.valor ?? ""
  );

  const handleAlignment = (valor: string) => {
    setAlignment(valor);
    configuracion?.("texto", valor, size, textValue, "", [], null);
  };

  const handleSize = (valor: string) => {
    setSize(valor);
    configuracion?.("texto", alignment, valor, textValue, "", [], null);
  };

  const handleText = (valor: string) => {
    setTextValue(valor);
    configuracion?.("texto", alignment, size, valor, "", [], null);
  };
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Dividir texto en trozos (texto normal y links)
  const parts = textValue.split(urlRegex);
  return (
    <div className="flex flex-col gap-2">
      {!preview && (
        <>
          <h2>Alineación de texto</h2>
          <select
            className="custom-select mt-2 cursor-pointer"
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleAlignment(e.target.value)}
            value={alignment}
          >
            <option value="text-left">Izquierda</option>
            <option value="text-center">Centro</option>
            <option value="text-right">Derecha</option>
          </select>

          <h2>Tamaño del texto</h2>
          <select
            className="custom-select mt-2 cursor-pointer"
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleSize(e.target.value)}
            value={size}
          >
            <option value="text-2xl">Título</option>
            <option value="text-lg">Subtítulo</option>
            <option value="text-sm">Párrafo</option>
          </select>

          <textarea
            className="custom-input mt-2"
            style={{ height: "150px" }}
            placeholder="Escribe aquí..."
            value={textValue}
            onChange={(e) => handleText(e.target.value)}
          ></textarea>
        </>
      )}

      <p className={`${alignment} ${size}`} style={{ whiteSpace: "pre-wrap" }}>
        {parts.map((part, index) =>
          urlRegex.test(part) ? (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {part}
            </a>
          ) : (
            part
          )
        )}
      </p>
    </div>
  );
}

export function InputComponent(props: Props) {
  const { preview = false, configuracion, elementos_configuraciones } = props;

  const [alignment, setAlignment] = useState<string>(
    elementos_configuraciones?.align ?? "text-left"
  );
  const [size, setSize] = useState<string>(
    elementos_configuraciones?.size ?? "text-2xl"
  );
  const [dataType, setDataType] = useState<string>(
    elementos_configuraciones?.tipo_input ?? "texto_general"
  );

  const handleAlignment = (valor: string) => {
    setAlignment(valor);
    configuracion?.("input", valor, size, "", dataType, [], null);
  };

  const handleSize = (valor: string) => {
    setSize(valor);
    configuracion?.("input", alignment, valor, "", dataType, [], null);
  };

  const handleDataType = (valor: string) => {
    setDataType(valor);
    configuracion?.("input", alignment, size, "", valor, [], null);
  };

  const renderInputByType = () => {
    switch (dataType) {
      case "texto_general":
        return <TextArea size={size} alignment={alignment} />;
      case "only_letters":
        return <SoloLetras size={size} alignment={alignment} />;
      case "numeric_no_decimal":
        return <SoloNumeros size={size} alignment={alignment} />;
      case "numeric_with_decimal":
        return <ConDecimal size={size} alignment={alignment} />;
      case "date":
        return <Fecha size={size} alignment={alignment} />;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {!preview && (
        <>
          <h2>Alineación de texto</h2>
          <select
            className="custom-select mt-2 cursor-pointer"
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleAlignment(e.target.value)}
            value={alignment}
          >
            <option value="text-left">Izquierda</option>
            <option value="text-center">Centro</option>
            <option value="text-right">Derecha</option>
          </select>

          <h2>Tamaño del texto</h2>
          <select
            className="custom-select mt-2 cursor-pointer"
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleSize(e.target.value)}
            value={size}
          >
            <option value="text-2xl">Título</option>
            <option value="text-lg">Subtítulo</option>
            <option value="text-sm">Párrafo</option>
          </select>

          <h2>Tipo de dato</h2>
          <select
            className="custom-select mt-2 cursor-pointer"
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleDataType(e.target.value)}
            value={dataType}
          >
            <option value="texto_general">Texto en General</option>
            <option value="numeric_no_decimal">Numérico sin decimal</option>
            <option value="numeric_with_decimal">Numérico con decimal</option>
            <option value="only_letters">Solo Letras</option>
            <option value="date">Fecha</option>
          </select>
        </>
      )}
      {renderInputByType()}
    </div>
  );
}

export function SelectComponent(props: Props) {
  const { preview = false, configuracion, elementos_configuraciones } = props;
  const [alignment, setAlignment] = useState<string>(
    elementos_configuraciones?.align ?? "text-left"
  );
  const [size, setSize] = useState<string>(
    elementos_configuraciones?.size ?? "text-2xl"
  );
  const [options, setOptions] = useState<string[]>(
    elementos_configuraciones?.opciones ?? ["Opción 1", "Opción 2"]
  );

  const handleAlignment = (valor: string) => {
    setAlignment(valor);
    configuracion?.("select", valor, size, "", "", options, null);
  };

  const handleSize = (valor: string) => {
    setSize(valor);
    configuracion?.("select", alignment, valor, "", "", options, null);
  };

  const handleOptions = (valor: string[]) => {
    setOptions(valor);
    configuracion?.("select", alignment, size, "", "", valor, null);
  };

  return (
    <div className="flex flex-col gap-2">
      {!preview && (
        <>
          <h2>Alineación de texto</h2>
          <select
            className="custom-select mt-2 cursor-pointer"
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleAlignment(e.target.value)}
            value={alignment}
          >
            <option value="text-left">Izquierda</option>
            <option value="text-center">Centro</option>
            <option value="text-right">Derecha</option>
          </select>

          <h2>Tamaño del texto</h2>
          <select
            className="custom-select mt-2 cursor-pointer"
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleSize(e.target.value)}
            value={size}
          >
            <option value="text-2xl">Título</option>
            <option value="text-lg">Subtítulo</option>
            <option value="text-sm">Párrafo</option>
          </select>

          <h2>Ingrese opciones</h2>
          <input
            type="text"
            placeholder="Ingresa opciones separadas por punto y coma..."
            className="border rounded-md p-2 mt-2"
            onChange={(e) => {
              const inputOptions = e.currentTarget.value
                .split(";")
                .map((opt) => opt.trim());
              handleOptions(inputOptions);
            }}
            value={options.join(";")} // aquí unimos el arreglo con ;
          />

          <h2>Resultado</h2>
        </>
      )}
      <select className={`border rounded-md p-2 mt-2 ${alignment} ${size}`}>
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckboxComponent(props: Props) {
  const { preview = false, configuracion, elementos_configuraciones } = props;
  const [alignment, setAlignment] = useState<string>(
    elementos_configuraciones?.align ?? "text-left"
  );
  const [size, setSize] = useState<string>(
    elementos_configuraciones?.size ?? "text-2xl"
  );
  const [lista, setLista] = useState<string[]>(
    elementos_configuraciones?.opciones ?? [""]
  );

  const handleAlignment = (valor: string) => {
    setAlignment(valor);
    configuracion?.("checkbox", valor, size, "", "", lista, null);
  };

  const handleSize = (valor: string) => {
    setSize(valor);
    configuracion?.("checkbox", alignment, valor, "", "", lista, null);
  };

  const handleLista = (valor: string[]) => {
    setLista(valor);
    configuracion?.("checkbox", alignment, size, "", "", valor, null);
  };

  return (
    <div className="flex flex-col gap-2">
      {!preview && (
        <>
          <h2>Alineación de texto</h2>
          <select
            className="custom-select mt-2 cursor-pointer"
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleAlignment(e.target.value)}
            value={alignment}
          >
            <option value="text-left">Izquierda</option>
            <option value="text-center">Centro</option>
            <option value="text-right">Derecha</option>
          </select>

          <h2>Tamaño del texto</h2>
          <select
            className="custom-select mt-2 cursor-pointer"
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleSize(e.target.value)}
            value={size}
          >
            <option value="text-2xl">Título</option>
            <option value="text-lg">Subtítulo</option>
            <option value="text-sm">Párrafo</option>
          </select>

          <button
            className="custom-select mt-2 cursor-pointer"
            onClick={() => handleLista([...lista, ""])}
          >
            Agregar nuevo checkbox
          </button>
        </>
      )}

      {lista.map((_, index) => (
        <div className="checkbox-radio-container" key={index}>
          <input type="checkbox" className="mt-2" />

          <textarea
            className={`custom-textarea mt-2 ${alignment} ${size}`}
            style={{ height: "100px" }}
            placeholder="Escribe aquí..."
            onChange={(e) => {
              const newList = [...lista];
              newList[index] = e.currentTarget.value;
              handleLista(newList);
            }}
            value={lista[index]}
          />

          {!preview && (
            <>
              <button
                onClick={() => {
                  const newList = lista.filter((_, i) => i !== index);
                  handleLista(newList);
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function RadioComponent(props: Props) {
  const { preview = false, configuracion, elementos_configuraciones } = props;
  const [alignment, setAlignment] = useState<string>(
    elementos_configuraciones?.align ?? "text-left"
  );
  const [size, setSize] = useState<string>(
    elementos_configuraciones?.size ?? "text-2xl"
  );
  const [lista, setLista] = useState<string[]>(
    elementos_configuraciones?.opciones ?? [""]
  );
  const name: string = `radio-group-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const handleAlignment = (valor: string) => {
    setAlignment(valor);
    configuracion?.("radio", valor, size, "", "", lista, null);
  };

  const handleSize = (valor: string) => {
    setSize(valor);
    configuracion?.("radio", alignment, valor, "", "", lista, null);
  };

  const handleLista = (valor: string[]) => {
    setLista(valor);
    configuracion?.("radio", alignment, size, "", "", valor, null);
  };

  return (
    <div className="flex flex-col gap-2">
      {!preview && (
        <>
          <h2>Alineación de texto</h2>
          <select
            className="custom-select mt-2 cursor-pointer"
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleAlignment(e.target.value)}
            value={alignment}
          >
            <option value="text-left">Izquierda</option>
            <option value="text-center">Centro</option>
            <option value="text-right">Derecha</option>
          </select>

          <h2>Tamaño del texto</h2>
          <select
            className="custom-select mt-2 cursor-pointer"
            style={{ marginBottom: "10px" }}
            onChange={(e) => handleSize(e.target.value)}
            value={size}
          >
            <option value="text-2xl">Título</option>
            <option value="text-lg">Subtítulo</option>
            <option value="text-sm">Párrafo</option>
          </select>

          <button
            className="custom-select mt-2 cursor-pointer"
            onClick={() => handleLista([...lista, ""])}
          >
            Agregar nuevo radio
          </button>
        </>
      )}
      {lista.map((_, index) => (
        <div className="checkbox-radio-container" key={index}>
          <input type="radio" className="mt-2" name={`radio-group-${name}`} />

          <textarea
            className={`custom-textarea mt-2 ${alignment} ${size}`}
            style={{ height: "100px" }}
            placeholder="Escribe aquí..."
            onChange={(e) => {
              const newList = [...lista];
              newList[index] = e.currentTarget.value;
              handleLista(newList);
            }}
            value={lista[index]}
          />

          {!preview && (
            <>
              <button
                onClick={() => {
                  const newList = lista.filter((_, i) => i !== index);
                  handleLista(newList);
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function ImageComponent(props: Props) {
  const { configuracion, elementos_configuraciones } = props;
  const [image, setImage] = useState<File | null>(
    elementos_configuraciones?.file ?? null
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleImage = (valor: File | null) => {
    setImage(valor);
    configuracion?.("image", "", "", "", "", [], valor);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Input oculto */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          handleImage(file);
        }}
      />

      {/* Imagen o placeholder clickable */}
      <div onClick={handleClick} className="cursor-pointer">
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Vista previa"
            className="mt-2 rounded shadow"
            style={{ width: "100%" }}
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-200 text-gray-600 rounded shadow">
            📷 Subir imagen
          </div>
        )}
      </div>
    </div>
  );
}
