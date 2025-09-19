import { useState, useRef, useEffect } from "react";

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
  children: React.ReactNode;
  preview?: boolean; // si true, todas las columnas inician con el mismo ancho
  columnas_configuraciones: ColumnaConfig;
  numCols: number;
  indexCols: number;
  onWidthChange?: (width: number) => void;
  onClickCol?: () => void;
};

export const ResizableCol = ({
  children,
  preview,
  columnas_configuraciones,
  onWidthChange,
  numCols,
  indexCols,
  onClickCol,
}: Props) => {
  const colRef = useRef<HTMLDivElement>(null);

  // ancho inicial basado en width guardado o calculado por numCols
  const initialWidth =
    columnas_configuraciones.width && columnas_configuraciones.width > 0
      ? columnas_configuraciones.width
      : null;

  const [width, setWidth] = useState<number | null>(initialWidth);

  // Aplicar ancho directamente al render
  const appliedWidth =
    width !== null
      ? `${columnas_configuraciones.width}px`
      : !preview
      ? `calc(100% / ${numCols})`
      : "auto";

  // Entra cada vez que se renderiza
  useEffect(() => {
    if (!colRef.current) return;

    let lastWidth = colRef.current.offsetWidth;

    if (width === null || columnas_configuraciones.width === 0) {
      setWidth(lastWidth);
      onWidthChange?.(lastWidth);
    }

    const handleResize = () => {
      const width = colRef.current?.offsetWidth ?? 0;
      if (width !== lastWidth) {
        lastWidth = width;
        onWidthChange?.(width);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(colRef.current);

    // llamada inicial
    handleResize();

    return () => resizeObserver.disconnect();
  }, [width, columnas_configuraciones.width, onWidthChange]);

  // Mover solo si no es la última columna
  const handleMouseDown = (e: React.MouseEvent) => {
    if (indexCols === numCols - 1) return; // última columna no se mueve
    e.preventDefault();

    const startX = e.clientX;
    const parent = colRef.current?.parentElement;
    if (!parent) return;

    const cols = Array.from(parent.children) as HTMLDivElement[];
    const idx = indexCols;
    const startWidths = cols.map((c) => c.getBoundingClientRect().width);
    const totalWidth = parent.getBoundingClientRect().width;
    const minWidth = 50;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      let newWidth = startWidths[idx] + delta;

      // Limitar ancho mínimo y máximo
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > totalWidth - (cols.length - 1) * minWidth) {
        newWidth = totalWidth - (cols.length - 1) * minWidth;
      }

      const remainingWidth = totalWidth - newWidth;
      const otherCols = cols.filter((_, i) => i !== idx);

      // Redistribuir proporcionalmente
      const otherTotal = otherCols.reduce((acc, _, i) => {
        const realIndex = i >= idx ? i + 1 : i;
        return acc + startWidths[realIndex];
      }, 0);

      otherCols.forEach((c, i) => {
        const realIndex = i >= idx ? i + 1 : i;
        const proportion = startWidths[realIndex] / otherTotal;
        c.style.width = `${proportion * remainingWidth}px`;
      });

      colRef.current!.style.width = `${newWidth}px`;
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      {!preview ? (
        children
      ) : (
        <div
          ref={colRef}
          onClick={onClickCol}
          style={{
            width: appliedWidth,
            position: "relative",
            padding: "5px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            flex: appliedWidth === "auto" ? 1 : "none",
            background: columnas_configuraciones.color_fondo,
            borderTop: columnas_configuraciones.borde_top
              ? "1px solid #ccc"
              : "none",
            borderBottom: columnas_configuraciones.borde_bottom
              ? "1px solid #ccc"
              : "none",
            borderLeft: columnas_configuraciones.borde_left
              ? "1px solid #ccc"
              : "none",
            borderRight: columnas_configuraciones.borde_right
              ? "1px solid #ccc"
              : "none",
          }}
        >
          {children}
          {indexCols !== numCols - 1 && (
            <div onMouseDown={handleMouseDown} className="resize-handle" />
          )}
        </div>
      )}
    </>
  );
};
