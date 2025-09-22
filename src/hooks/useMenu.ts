import { useState, useRef, useEffect } from "react";
import type { DropResult } from "@hello-pangea/dnd";

type ColumnaConfig = {
  tipo: string; // "texto", "input", "select", etc.
  size?: string; // ancho o tamaño
  align?: string; // alineación
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

type RowType = {
  id: number;
  cols: number;
  configuracion: ColumnaConfig[]; // un arreglo de objetos JSON
};

function useMenu() {
  const [visualizar, setVisualizar] = useState(false);
  const [numCols, setNumCols] = useState<number>(1);
  const [filas, setFilas] = useState<RowType[]>([]);
  const [open, setOpen] = useState(false);
  const [ajuste_columna, setAjuste_columna] = useState(false);
  const [personalizar, setPersonalizar] = useState(false);
  const [configuracion_personalizar, setConfiguracion_personalizar] =
    useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1200); // 👈 estado para tamaño de pantalla
  const [copy_width, setCopy_width] = useState<number | null>(null);
  const [colorTexto, setColorTexto] = useState<string>("#000000");
  const [colorFondo, setColorFondo] = useState<string>("#ffffff");
  const [borderTop, setBorderTop] = useState<boolean>(true);
  const [borderRight, setBorderRight] = useState<boolean>(true);
  const [borderBottom, setBorderBottom] = useState<boolean>(true);
  const [borderLeft, setBorderLeft] = useState<boolean>(true);

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

    if (!visualizar) {
      setAjuste_columna(false);
      setCopy_width(null);
    }
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
          width: 1144 / numCols,
          color_texto: "#000000",
          color_fondo: "#ffffff",
          borde_top: true,
          borde_bottom: true,
          borde_left: true,
          borde_right: true,
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

        const newConfiguracion = [...fila.configuracion];

        // Actualizamos la columna seleccionada
        newConfiguracion[colIndex] = {
          ...newConfiguracion[colIndex],
          width,
        };

        const MAX_TOTAL = 1144;

        // Sumar los anchos actuales
        const totalCurrent = newConfiguracion.reduce(
          (acc, col) => acc + (col.width ?? 0),
          0
        );

        // Ajustar proporcionalmente si total != MAX_TOTAL
        if (totalCurrent !== MAX_TOTAL) {
          const otherTotal = totalCurrent - width;
          newConfiguracion.forEach((col, i) => {
            if (i !== colIndex) {
              const currentWidth = col.width ?? 0;
              // Ajuste proporcional
              col.width = Math.round(
                (currentWidth / otherTotal) * (MAX_TOTAL - width)
              );
            }
          });
        }

        // Asegurarse de que la suma final sea exactamente MAX_TOTAL
        const sumWidths = newConfiguracion.reduce(
          (acc, col) => acc + (col.width ?? 0),
          0
        );
        const diff = MAX_TOTAL - sumWidths;
        newConfiguracion[colIndex].width! += diff; // corregir la columna que se modificó para compensar

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

  const handleColSelect = (id: number, index: number) => {
    if (copy_width === null) {
      // 📌 PRIMERA SELECCIÓN: guardar ancho de referencia
      const fila = filas.find((f) => f.id === id);
      if (!fila) return;

      const ancho = fila.configuracion[index]?.width;
      if (ancho === undefined) return;

      if (ancho === 1144) {
        alert("No puede seleccionar los que tiene una columna");
        return;
      }
      setCopy_width(ancho);
    } else {
      // 📌 SEGUNDA SELECCIÓN: aplicar ancho copiado
      setFilas((prevFilas) =>
        prevFilas.map((fila) => {
          if (fila.id !== id) return fila; // si no es la fila seleccionada → no cambia

          // 🚫 Si la fila solo tiene 1 columna, no aplicamos cambios
          if (fila.configuracion.length === 1) {
            alert("Fila con una sola columna, no se aplican cambios.");
            return fila;
          }

          // Calcular el ancho total actual
          const total = fila.configuracion.reduce(
            (acc, col) => acc + (col.width ?? 0),
            0
          );

          // Nueva configuración con el ancho copiado en la columna seleccionada
          const newConfiguracion = fila.configuracion.map((col, i) => {
            if (i === index) {
              return { ...col, width: copy_width };
            }
            return col;
          });

          // Calcular la diferencia de anchos después del cambio
          const sumaActual = newConfiguracion.reduce(
            (acc, col) => acc + (col.width ?? 0),
            0
          );
          const diferencia = sumaActual - total;

          if (diferencia !== 0) {
            // Ajustar las demás columnas proporcionalmente
            const colsRestantes = newConfiguracion.filter(
              (_, i) => i !== index
            );
            const sumaRestante = colsRestantes.reduce(
              (acc, col) => acc + (col.width ?? 0),
              0
            );

            return {
              ...fila,
              configuracion: newConfiguracion.map((col, i) => {
                if (i === index) return col; // no modificar la seleccionada
                if (sumaRestante === 0) return col; // evitar división por 0

                const ajuste = ((col.width ?? 0) / sumaRestante) * diferencia;
                return {
                  ...col,
                  width: Math.max(0, (col.width ?? 0) - ajuste),
                };
              }),
            };
          }

          // Si no hubo diferencia, devolvemos la fila como está
          return { ...fila, configuracion: newConfiguracion };
        })
      );
    }
  };

  const handleAjuste_Columna = () => {
    setCopy_width(null);
    setAjuste_columna(!ajuste_columna);

    if (!ajuste_columna) {
      alert("Seleccione el ancho a copiar");
    }
  };

  const handlePersonalizar = () => {
    setPersonalizar(!personalizar);
    if (!personalizar) {
      setConfiguracion_personalizar(true);
    } else {
      setConfiguracion_personalizar(false);
      setBorderBottom(true);
      setBorderLeft(true);
      setBorderTop(true);
      setBorderRight(true);
      setColorFondo("#ffffff");
      setColorTexto("#000000");
    }
  };

  const handleAplicar_Personalizarcion = (id?: number, colIndex?: number) => {
    if (id === undefined || colIndex === undefined) return;

    setFilas((prevFilas) =>
      prevFilas.map((fila) => {
        if (fila.id !== id) return fila; // no es la fila que queremos

        const newConfiguracion = [...fila.configuracion];
        newConfiguracion[colIndex] = {
          ...newConfiguracion[colIndex],
          color_texto: colorTexto ?? newConfiguracion[colIndex].color_texto,
          color_fondo: colorFondo ?? newConfiguracion[colIndex].color_fondo,
          borde_top: borderTop ?? newConfiguracion[colIndex].borde_top,
          borde_bottom: borderBottom ?? newConfiguracion[colIndex].borde_bottom,
          borde_left: borderLeft ?? newConfiguracion[colIndex].borde_left,
          borde_right: borderRight ?? newConfiguracion[colIndex].borde_right,
        };

        return { ...fila, configuracion: newConfiguracion };
      })
    );
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

  return {
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
  };
}

export default useMenu;
