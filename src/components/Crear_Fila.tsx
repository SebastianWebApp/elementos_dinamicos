import { ResizableCol } from "../utils/ResizableCol";

import Crear_Columna from "./Crear_Columna";

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
  numCols: number;
  id: number;
  preview: boolean;
  configuraciones: ColumnaConfig[];
  eliminar_fila?: (id: number) => void;
  configuracion?: (
    id?: number,
    colIndex?: number,
    tipo?: string,
    align?: string,
    size?: string,
    value?: string,
    tipo_input?: string,
    opciones?: string[],
    file?: File | null
  ) => void;

  configuracion_columna?: (
    id?: number,
    colIndex?: number,
    width?: number
  ) => void;
};

function Crear_Fila(props: Props) {
  const {
    numCols,
    id,
    preview,
    configuracion,
    configuracion_columna,
    configuraciones,
  } = props;

  const handleWidth = (width: number, id: number, index: number) => {
    configuracion_columna?.(id, index, width);
  };

  return (
    <div
      className="row-container flex gap-4 "
      style={
        preview
          ? {
              borderRadius: "0px",
              padding: "0px",
              marginBottom: "0px",
              gap: "0px",
            }
          : {}
      }
    >
      {!preview && (
        <button
          className="delete-row-btn"
          onClick={() => props.eliminar_fila?.(id)}
        >
          <i className="fas fa-trash"></i> Eliminar
        </button>
      )}

      {Array.from({ length: numCols }).map((_, index) => (
        <ResizableCol
          key={`${id}_${index}`}
          preview={preview}
          columnas_configuraciones={configuraciones[index]}
          numCols={numCols}
          indexCols={index}
          onWidthChange={(width) => handleWidth(width, id, index)}
        >
          <Crear_Columna
            key={`${id}_${index}`}
            preview={preview}
            columnas_configuraciones={configuraciones[index]}
            configuracion={(
              tipo,
              align,
              size,
              value,
              tipo_input,
              opciones,
              file
            ) =>
              configuracion?.(
                id,
                index,
                tipo,
                align,
                size,
                value,
                tipo_input,
                opciones,
                file
              )
            }
          />
        </ResizableCol>
      ))}
    </div>
  );
}

export default Crear_Fila;
