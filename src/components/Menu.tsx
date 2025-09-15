import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import Crear_Fila from "./Crear_Fila";

type ColumnaConfig = {
  tipo: string; // "texto", "input", "select", etc.
  size?: string; // ancho o tamaño
  align?: string; // alineación
  valor?: string;
  tipo_input?: string;
  opciones?: string[];
  file?: File | null;
  width?: number;
};

type RowType = {
  id: number;
  cols: number;
  configuracion: ColumnaConfig[]; // un arreglo de objetos JSON
};

function Menu() {
  const [visualizar, setVisualizar] = useState(false);
  const [numCols, setNumCols] = useState<number>(1);
  const [filas, setFilas] = useState<RowType[]>([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1200); // 👈 estado para tamaño de pantalla

  // Detectar resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1200);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleVisualizar = () => {
    setVisualizar(!visualizar);
  };

  const addRow = () => {
    setFilas([
      ...filas,
      {
        id: Date.now(),
        cols: numCols,
        configuracion: Array.from({ length: numCols }, () => ({
          tipo: "",
          size: "",
          align: "",
          valor: "",
          tipo_input: "",
          cantidad: 0,
          opciones: [],
          width: 0,
        })),
      },
    ]);

    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const handleConfiguracion = (
    id?: number,
    colIndex?: number,
    tipo?: string,
    align?: string,
    size?: string,
    value?: string,
    tipo_input?: string,
    opciones?: string[],
    file?: File | null
  ) => {
    if (id === undefined || colIndex === undefined) return;

    setFilas((prevFilas) =>
      prevFilas.map((fila) => {
        if (fila.id !== id) return fila; // no es la fila que queremos

        const newConfiguracion = [...fila.configuracion];
        newConfiguracion[colIndex] = {
          ...newConfiguracion[colIndex],
          tipo: tipo ?? newConfiguracion[colIndex].tipo,
          align: align ?? newConfiguracion[colIndex].align,
          size: size ?? newConfiguracion[colIndex].size,
          valor: value ?? newConfiguracion[colIndex].valor,
          tipo_input: tipo_input ?? newConfiguracion[colIndex].tipo_input,
          opciones: opciones ?? newConfiguracion[colIndex].opciones,
          file: file ?? newConfiguracion[colIndex].file,
        };

        return { ...fila, configuracion: newConfiguracion };
      })
    );
  };

  const handleConfiguracion_Columnas = (
    id?: number,
    colIndex?: number,
    width?: number
  ) => {
    if (id === undefined || colIndex === undefined || width === undefined)
      return;

    setFilas((prevFilas) =>
      prevFilas.map((fila) => {
        if (fila.id !== id) return fila; // no es la fila que queremos

        const oldConfig = fila.configuracion[colIndex];
        if (oldConfig?.width === width) {
          // 👇 si no cambió el ancho, no actualizamos nada
          return fila;
        }

        const newConfiguracion = [...fila.configuracion];
        newConfiguracion[colIndex] = {
          ...newConfiguracion[colIndex],
          width,
        };

        return { ...fila, configuracion: newConfiguracion };
      })
    );
  };

  const eliminar_fila = (id: number) => {
    // Estamos leyendo la lista y le decimos que suba todas que sean diferentes al id que le pasamos
    setFilas(filas.filter((fila) => fila.id !== id));
  };

  const duplicar_fila = (id: number) => {
    setFilas((prevFilas) => {
      const index = prevFilas.findIndex((fila) => fila.id === id);
      if (index === -1) return prevFilas;

      const filaOriginal = prevFilas[index];
      const filaDuplicada = {
        ...filaOriginal,
        id: Date.now(), // nuevo id único
      };

      // Insertar la duplicada justo después de la original
      const nuevasFilas = [
        ...prevFilas.slice(0, index + 1),
        filaDuplicada,
        ...prevFilas.slice(index + 1),
      ];
      return nuevasFilas;
    });
  };

  const handleDescargar = () => {
    // Clonar las filas y limpiar el valor de file si es image
    const filasLimpias = filas.map((fila) => ({
      ...fila,
      configuracion: fila.configuracion.map((elem) => ({
        ...elem,
        file: elem.tipo === "image" ? null : elem.file,
      })),
    }));

    const blob = new Blob([JSON.stringify(filasLimpias, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lista.json";
    link.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const contenido = JSON.parse(e.target?.result as string);
        setFilas(contenido); // guardamos en el estado
      } catch (error) {
        alert(`El archivo no es un JSON válido: ${error}`);
      }
    };

    reader.readAsText(file);
  };

  // Cerrar panel al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔹 Reordenar filas al hacer drag
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    setFilas((prevFilas) => {
      const items = Array.from(prevFilas);
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);
      return items;
    });
  };

  return (
    <>
      {!isLargeScreen ? (
        <div
          id="smallScreenMessage"
          className="flex flex-col items-center justify-center text-center p-6 bg-white shadow-lg rounded-xl"
        >
          <i className="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pantalla demasiado pequeña
          </h1>
          <p className="text-gray-600 text-lg">
            Para usar la aplicación correctamente, por favor accede desde una
            pantalla mayor a 1200px de ancho.
          </p>
        </div>
      ) : (
        <div id="mainContent">
          {/* Botón flotante pequeño y elegante */}
          <button
            ref={buttonRef}
            onClick={() => setOpen(!open)}
            className="fixed bottom-4 right-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-md hover:bg-indigo-700 transition flex items-center justify-center"
          >
            <i className={`fas ${open ? "fa-times" : "fa-cog"} text-lg`}></i>
          </button>

          {/* Panel superior compacto */}
          <div
            ref={panelRef}
            className={`
          fixed top-16 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-xl shadow-lg transition-all duration-300
          ${
            open
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
            style={{ width: "350px", maxWidth: "90%" }}
          >
            <div className="p-4 flex flex-col gap-4">
              {/* Cargar Elemento */}
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-gray-700 text-center">
                  Cargar Elemento
                </h2>
                <input
                  type="file"
                  accept=".json"
                  className="w-full p-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition"
                  onChange={handleFileChange}
                />
              </div>

              {/* Constructor */}
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-gray-700 text-center">
                  Constructor
                </h2>
                <label
                  htmlFor="numCols"
                  className="text-gray-600 font-medium text-center"
                >
                  Columnas:
                </label>
                <select
                  className="w-full p-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition text-center"
                  onChange={(e) => setNumCols(Number(e.target.value))}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-2 mt-2">
                <button
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md shadow-sm transition flex items-center justify-center gap-2"
                  onClick={addRow}
                >
                  <i className="fas fa-plus"></i> Agregar Fila
                </button>
                <button
                  className={`bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md shadow-sm transition flex items-center justify-center gap-2 ${
                    visualizar ? "hidden" : ""
                  }`}
                  onClick={handleVisualizar}
                >
                  <i className="fas fa-eye"></i> Visualizar
                </button>
                <button
                  className={`bg-yellow-500 text-white hover:bg-yellow-600 px-4 py-2 rounded-md shadow-sm transition flex items-center justify-center gap-2 ${
                    visualizar ? "" : "hidden"
                  }`}
                  onClick={handleVisualizar}
                >
                  <i className="fas fa-edit"></i> Editar
                </button>
                <button
                  className={`bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md shadow-sm transition flex items-center justify-center gap-2 ${
                    visualizar ? "" : "hidden"
                  }`}
                  onClick={handleDescargar}
                >
                  <i className="fas fa-save"></i> Guardar JSON
                </button>
              </div>
            </div>
          </div>

          {!visualizar ? (
            <div className="dashboard-container mt-6">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="filas">
                  {(provided) => (
                    <div
                      className="preview-card"
                      ref={(el) => {
                        provided.innerRef(el);
                        endRef.current = el;
                      }}
                      {...provided.droppableProps}
                    >
                      {filas.map((fila, index) => (
                        <Draggable
                          key={fila.id}
                          draggableId={fila.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Crear_Fila
                                key={fila.id}
                                id={fila.id}
                                numCols={fila.cols}
                                configuraciones={fila.configuracion}
                                eliminar_fila={eliminar_fila}
                                preview={visualizar}
                                configuracion={handleConfiguracion}
                                duplicar_fila={duplicar_fila}
                                configuracion_columna={
                                  handleConfiguracion_Columnas
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          ) : (
            <div className="dashboard-container mt-6">
              <div className="preview-card" ref={endRef}>
                {filas.map((fila) => (
                  <Crear_Fila
                    key={fila.id}
                    id={fila.id}
                    numCols={fila.cols}
                    configuraciones={fila.configuracion}
                    preview={visualizar}
                    configuracion={handleConfiguracion}
                    configuracion_columna={handleConfiguracion_Columnas}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Menu;
