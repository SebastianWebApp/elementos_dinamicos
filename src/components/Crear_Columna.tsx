import { useState } from "react";
import {
  TextoComponent,
  InputComponent,
  SelectComponent,
  CheckboxComponent,
  RadioComponent,
  ImageComponent,
} from "../utils/Elementos";

type ColumnaConfig = {
  tipo: string;
  size?: string;
  align?: string;
  valor?: string;
  tipo_input?: string;
  opciones?: string[];
  file?: File | null;
  width?: number;
  color_texto?: string;
  color_fondo?: string;
  borde_top?: boolean;
  borde_bottom?: boolean;
  borde_left?: boolean;
  borde_right?: boolean;
};

type Props = {
  preview: boolean;
  columnas_configuraciones: ColumnaConfig;
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

function Crear_Columna(props: Props) {
  const { preview, configuracion, columnas_configuraciones } = props;
  const [selectValue, setSelectValue] = useState(
    columnas_configuraciones?.tipo ?? ""
  );

  const handleConfiguracion = (
    tipo?: string,
    align?: string,
    size?: string,
    value?: string,
    tipo_input?: string,
    opciones?: string[],
    file?: File | null
  ) => {
    configuracion?.(tipo, align, size, value, tipo_input, opciones, file);
  };

  const handleConfiguracion_Inicial = (selectValue: string) => {
    setSelectValue(selectValue);

    switch (selectValue) {
      case "texto":
        configuracion?.("texto", "text-left", "text-2xl", "", "", [], null);
        break;

      case "input":
        configuracion?.(
          "input",
          "text-left",
          "text-2xl",
          "",
          "texto_general",
          [],
          null
        );
        break;

      case "select":
        configuracion?.(
          "select",
          "text-left",
          "text-2xl",
          "",
          "",
          ["Opción 1", "Opción 2"],
          null
        );
        break;

      case "checkbox":
        configuracion?.(
          "checkbox",
          "text-left",
          "text-2xl",
          "",
          "",
          [""],
          null
        );
        break;

      case "radio":
        configuracion?.("radio", "text-left", "text-2xl", "", "", [""], null);
        break;

      case "image":
        configuracion?.("image", "", "", "", "", [], null);
        break;

      default:
        break;
    }
  };

  const Elementos = () => {
    switch (selectValue) {
      case "texto": {
        return (
          <TextoComponent
            preview={preview}
            configuracion={handleConfiguracion}
            elementos_configuraciones={columnas_configuraciones}
          />
        );
      }
      case "input":
        return (
          <InputComponent
            preview={preview}
            configuracion={handleConfiguracion}
            elementos_configuraciones={columnas_configuraciones}
          />
        );
      case "select":
        return (
          <SelectComponent
            preview={preview}
            configuracion={handleConfiguracion}
            elementos_configuraciones={columnas_configuraciones}
          />
        );
      case "checkbox":
        return (
          <CheckboxComponent
            preview={preview}
            configuracion={handleConfiguracion}
            elementos_configuraciones={columnas_configuraciones}
          />
        );

      case "radio": {
        return (
          <RadioComponent
            preview={preview}
            configuracion={handleConfiguracion}
            elementos_configuraciones={columnas_configuraciones}
          />
        );
      }
      case "image": {
        return (
          <ImageComponent
            preview={preview}
            configuracion={handleConfiguracion}
            elementos_configuraciones={columnas_configuraciones}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div
      className="flex p-3 flex-col gap-2"
      style={{
        marginTop: !preview ? "40px" : "0px",
      }}
    >
      {!preview && (
        <select
          className="custom-select cursor-pointer"
          onChange={(e) => handleConfiguracion_Inicial(e.target.value)}
          value={selectValue}
        >
          <option value="">--Tipo de campo--</option>
          <option value="texto">Texto</option>
          <option value="input">Input</option>
          <option value="select">Select</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio</option>
          {/* <option value="image">Imagen</option> */}
        </select>
      )}

      {Elementos()}
    </div>
  );
}

export default Crear_Columna;
