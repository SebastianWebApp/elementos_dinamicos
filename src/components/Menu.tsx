import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useMenu from "../hooks/useMenu";
import Crear_Fila from "./Crear_Fila";

function Menu() {
  const {
    isLargeScreen,
    buttonRef,
    setOpen,
    open,
    visualizar,
    handleAjuste_Columna,
    ajuste_columna,
    handlePersonalizar,
    personalizar,
    panelRef,
    handleFileChange,
    setNumCols,
    addRow,
    handleVisualizar,
    handleDescargar,
    configuracion_personalizar,
    setColorTexto,
    colorTexto,
    setColorFondo,
    colorFondo,
    setBorderTop,
    borderTop,
    setBorderRight,
    borderRight,
    setBorderBottom,
    borderBottom,
    setBorderLeft,
    borderLeft,
    setConfiguracion_personalizar,
    onDragEnd,
    endRef,
    filas,
    eliminar_fila,
    handleConfiguracion,
    duplicar_fila,
    handleConfiguracion_Columnas,
    handleColSelect,
    handleAplicar_Personalizarcion,
  } = useMenu();

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
            title="Configuraciones"
            className="fixed bottom-4 right-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-md hover:bg-indigo-700 transition flex items-center justify-center"
          >
            <i className={`fas ${open ? "fa-ban" : "fa-cog"} text-lg`}></i>
          </button>

          {/* Panel superior compacto */}

          {visualizar ? (
            <>
              <button
                onClick={handleAjuste_Columna}
                title="Ajustar Anchos"
                className="fixed bottom-20 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition flex items-center justify-center"
              >
                <i
                  className={`fas ${
                    ajuste_columna ? "fa-ban" : "fa-arrows-alt-h"
                  } text-lg`}
                ></i>
              </button>

              <button
                onClick={handlePersonalizar}
                title="Personalizar diseño"
                style={{ bottom: "140px" }}
                className="fixed  right-4 z-50 bg-pink-500 text-white p-3 rounded-full shadow-md hover:bg-pink-600 transition flex items-center justify-center"
              >
                <i
                  className={`fas ${
                    personalizar ? "fa-ban" : "fa-paint-brush"
                  } text-lg`}
                ></i>
              </button>
            </>
          ) : null}

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
                  {[...Array(8)].map((_, i) => (
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

          <div
            className={`
    fixed top-16 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-xl shadow-lg transition-all duration-300
    ${
      configuracion_personalizar
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95 pointer-events-none"
    }
  `}
            style={{ width: "350px", maxWidth: "90%" }}
          >
            <div className="p-4 flex flex-col gap-4">
              {/* Personalizar Estilo */}
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-gray-700 text-center">
                  Personalizar Estilo
                </h2>

                {/* Color de Texto */}
                <label className="text-gray-600 font-medium">
                  Color de letra:
                </label>
                <input
                  type="color"
                  className="w-full h-10 cursor-pointer border rounded-md"
                  onChange={(e) => setColorTexto(e.target.value)}
                  value={colorTexto}
                />

                {/* Color de Fondo */}
                <label className="text-gray-600 font-medium mt-2">
                  Color de fondo:
                </label>
                <input
                  type="color"
                  className="w-full h-10 cursor-pointer border rounded-md"
                  onChange={(e) => setColorFondo(e.target.value)}
                  value={colorFondo}
                />

                {/* Bordes */}
                <label className="text-gray-600 font-medium mt-2">
                  Bordes:
                </label>
                <div className="flex flex-col gap-2 text-sm text-gray-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) => setBorderTop(e.target.checked)}
                      checked={borderTop}
                    />
                    Superior
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) => setBorderRight(e.target.checked)}
                      checked={borderRight}
                    />
                    Derecho
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) => setBorderBottom(e.target.checked)}
                      checked={borderBottom}
                    />
                    Inferior
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) => setBorderLeft(e.target.checked)}
                      checked={borderLeft}
                    />
                    Izquierdo
                  </label>
                </div>
              </div>

              {/* Botón aplicar */}
              <div className="flex justify-center mt-3">
                <button
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md shadow-sm transition flex items-center justify-center gap-2"
                  onClick={() =>
                    setConfiguracion_personalizar(!configuracion_personalizar)
                  }
                >
                  <i className="fas fa-paint-brush"></i> Aplicar Estilos
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
                    onSelect={
                      ajuste_columna
                        ? handleColSelect
                        : personalizar
                        ? handleAplicar_Personalizarcion
                        : undefined
                    }
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
