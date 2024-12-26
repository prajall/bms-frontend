import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";

interface PrintWrapperProps {
  component: React.ElementType; // The component to render and print
  data: any; // The data to pass to the component
  documentTitle?: string; // Optional title for the printed document
  onAfterPrint?: () => void; // Callback after printing
}

const PrintWrapper: React.FC<PrintWrapperProps> = ({
  component: Component,
  data,
  documentTitle = "Document",
  onAfterPrint,
}) => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => {
      if (!componentRef.current) {
        console.error("There is nothing to print");
        return null;
      }
      return componentRef.current;
    },
    documentTitle,
    onAfterPrint,
  });

  useEffect(() => {
    if (data) {
      console.log("Preparing to print:", data);
      handlePrint();
    } else {
      console.warn("No data provided to PrintWrapper");
    }
  }, [data]);

  return (
    <div style={{ display: "none" }}>
      <div ref={componentRef}>
        <Component {...data} />
      </div>
    </div>
  );
};

export default PrintWrapper;
