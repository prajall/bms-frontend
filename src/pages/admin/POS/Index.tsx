import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import AddButton from "@/components/ui/buttons/AddButton";
import {
  DeleteIcon,
  EditIcon,
  ShowIcon,
  PrintIcon
} from "@/components/ui/buttons/IconBtn";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
// import Invoice from "./Invoice";
import { useReactToPrint, UseReactToPrintOptions } from "react-to-print";
import usePermission from "@/hooks/usePermission";

type POSType = {
    id: string;
    orderId: string;
    customer: string;
    customerType: string;
    date: Date;
    products: any[];
    parts: any[];
    subTotal: number;
    discount: number;
    tax: number;
    totalPrice: number;
    //   serviceOrders: any[];
};

const POSIndex = () => {
  const navigate = useNavigate();
  const [posData, setPosData] = useState<POSType[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [billToPrint, setBillToPrint] = useState<POSType | null>(null);

  const canCreatePos = usePermission("pos", "create");
  const canEditPos = usePermission("pos", "edit");
  const canDeletePos = usePermission("pos", "delete");

  const contentRef = useRef<HTMLDivElement>(null);

  const fetchPOSData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/pos`,
          { params: { page, limit, sortField, sortOrder, search }, withCredentials: true }
      );
      if (response.status === 200 && response.data.success) {
        const formattedData = response.data.data.posRecords.map((item: any) => ({
            id: item._id,
            orderId: item.orderId,
            products: item.products?.map((product: any) => product.product?.name).join(', ') || '',
            parts: item.parts?.map((part: any) => part.part?.name).join(', ') || '',
            customer: item.customer?.name || "",
            customerType: item.customerType,
            subTotal: item.subTotal,
            date: item.createdAt
            ? new Date(item.createdAt).toISOString().split("T")[0]
                : "",
            discount: item.discount,
            tax: item.tax,
            totalPrice: item.totalPrice,
            }));
            setPosData(formattedData);
            setTotalRows(response.data.data.pagination.totalPOS);
            setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Failed to fetch service order.");
      }
    } catch (error) {
      console.error("Error fetching service order data:", error);
    }
  };

  const handleAction = async (action: string, id: string) => {
    if (action === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this service order?"
      );
      if (!confirmDelete) return;

      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/service-billing/${id}`
        );
        if (response.status === 200 && response.data.success) {
          toast(<SuccessToast message={response.data.message} />, {
            autoClose: 5000,
          });
          fetchPOSData(); // Refresh data
        } else {
          toast(
            <ErrorToast
              message={response.data.message || "Unexpected response format."}
            />,
            {
              autoClose: 4000,
            }
          );
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          const errorMessage =
            error.response.data.message || "Failed to delete service order.";
          toast(<ErrorToast message={errorMessage} />, {
            autoClose: 4000,
          });
        } else {
          toast(
            <ErrorToast message={"Network error. Please try again later."} />,
            {
              autoClose: 4000,
            }
          );
        }
      }
    }
  };

  const columns = [
        {
            name: "SN",
            cell: (_: POSType, index: number) => index + 1,
            sortable: false,
            width: "60px",
        },
        {
            name: "Order ID",
            selector: (row: POSType) => row.orderId,
            sortable: true,
            wrap: true
        },
        {
            name: "Date",
            selector: (row: POSType) => row.date,
            sortable: true,
            wrap: true
        },
        {
            name: "Customer",
            selector: (row: POSType) => row.customer,
            sortable: true,
            wrap: true
        },
        {
            name: "Customer Type",
            selector: (row: POSType) => row.customerType,
            wrap: true,
            sortable: true
        },
        {
            name: "Sub Total",
            selector: (row: POSType) => row.subTotal.toFixed(2),
            sortable: true
        },
        {
            name: "Discount(%)",
            selector: (row: POSType) => row.discount,
            sortable: true
        },
        {
            name: "Tax(%)",
            selector: (row: POSType) => row.tax,
        },
        {
            name: "Total",
            selector: (row: POSType) => row.totalPrice.toFixed(2),
        },
        {
        name: "Action",
        cell: (row: POSType) => (
            <div className="inline-flex space-x-2">
            <ShowIcon link={`/admin/billing/show/${row.id}`} />
            {canEditPos && (
              <EditIcon link={`/admin/billing/edit/${row.id}`} />
            )}
            {/* {canDeletePos && (
              <DeleteIcon onClick={() => handleAction("delete", row.id)} />
            )} */}
             {/* <PrintIcon onClick={() => printBill(row)} /> */}
            </div>
        ),
        sortable: false,
        },
  ];

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Service Invoice",
    onAfterPrint: async () => {
      console.log("Print completed");
    },
    onBeforePrint: async () => {
      console.log("Preparing to print...", contentRef);
    }
  } as UseReactToPrintOptions);

  const printBill = (bill: POSType) => {
    setBillToPrint(bill);
    setTimeout(() => {
    if (contentRef.current) {
      handlePrint(); 
    } else {
      console.error("Content reference is not ready for printing.");
    }
  }, 100);
  };
  const createPOS = () => {
    navigate("/admin/pos/create");
  }

  useEffect(() => {
    fetchPOSData();
  }, [page, limit, sortField, sortOrder, search]);

  return (
    <div className="relative">
      <div className="flex justify-end mt-1 h-8">
        {canCreatePos && (
          <AddButton title="Create Order" onClick={createPOS} />
        )}
      </div>
      {errorMessage && (
        <div className="alert alert-error">
          <p>{errorMessage}</p>
        </div>
      )}
      {/* Pass dynamic title */}
      <TableLayout
        columns={columns}
        data={posData}
        totalRows={totalRows}
        page={page}
        limit={limit}
        sortField={sortField}
        sortOrder={sortOrder}
        search={search}
        onSearch={(search) => setSearch(search)}
        onSort={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
        onPageChange={(newPage) => setPage(newPage)}
        onLimitChange={(newLimit) => setLimit(newLimit)}
        onAction={handleAction}
      />

      {billToPrint && (
        <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
          {/* <Invoice ref={contentRef} bill={billToPrint} /> */}
        </div>
      )}
    </div>
  );
};

export default POSIndex;
