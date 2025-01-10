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
import Invoice from "./Invoice";
import { useReactToPrint, UseReactToPrintOptions } from "react-to-print";
import usePermission from "@/hooks/usePermission";

export type Billing = {
  id: string;
  invoice: string;
  orderId: string;
  customer: string;
  customerPhone: string;
  customerAddress: string;
  date: Date;
  service: string;
  totalAmount: number;
  paidAmount: number;
  totalPaid: number;
  serviceCharge: number;
  serviceOrders: any[];
  discount: number;
  discountAmount: number;
  taxableAmount: number;
  tax: number;
  taxAmount: number;
  finalTotal: number;
};

const BillingIndex = () => {
  const navigate = useNavigate();
  const [billingData, setBillingData] = useState<Billing[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [billToPrint, setBillToPrint] = useState<Billing | null>(null);

  const canCreateBilling = usePermission("billing", "create");
  const canEditBilling = usePermission("billing", "edit");
  const canDeleteBilling = usePermission("billing", "delete");

  const contentRef = useRef<HTMLDivElement>(null);

  const fetchBillingData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/service-billing`,
          { params: { page, limit, sortField, sortOrder, search }, withCredentials: true }
      );
      if (response.status === 200 && response.data.success) {
        const formattedData = response.data.data.billings.map((item: any) => ({
          id: item._id,
          invoice: item.invoice || '',
          orderId: item.serviceOrders.map((serviceOrder: any) => serviceOrder.orderId).join(', '),
          customer: item.customer?.name || "",
          totalAmount: item.totalAmount,
          paidAmount: item.paidAmount,
          totalPaid: item.totalPaid,
          date: item.date
          ? new Date(item.date).toISOString().split("T")[0]
            : "",
          service: item.serviceOrder?.service?.title,
          customerPhone: item.customer?.phoneNo,
          customerAddress: item.customer ? 
          `${item.customer.address.houseNo}, ${item.customer.address.addressLine}, ${item.customer.address.city}, ${item.customer.address.province}, ${item.customer.address.country}` 
          : 'Address not available',
          serviceCharge: item.serviceOrder?.serviceCharge,
          serviceOrders: item.serviceOrders,
          discount: item.discount,
          discountAmount: item.discountAmount,
          taxableAmount: item.taxableAmount,
          tax: item.tax,
          taxAmount: item.taxAmount,
          finalTotal: item.finalTotal,
        }));
        setBillingData(formattedData);
        setTotalRows(response.data.data.totalBillings);
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
          fetchBillingData(); // Refresh data
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
        cell: (_: Billing, index: number) => index + 1,
        sortable: false,
        width: "60px",
    },
        {
        name: "Invoice",
        selector: (row: Billing) => row.invoice,
            sortable: true,
            wrap: true
        },
        {
        name: "Order ID",
        selector: (row: Billing) => row.orderId,
            sortable: true,
            wrap: true
        },
        {
        name: "Date",
        selector: (row: Billing) => row.date,
            sortable: true,
            wrap: true
        },
        {
        name: "Customer",
        selector: (row: Billing) => row.customer,
            sortable: true,
            wrap: true
        },
        { name: "Paid Amount", selector: (row: Billing) => row.paidAmount, wrap: true, sortable: true },
        { name: "Total Paid Amt", selector: (row: Billing) => row.totalPaid, sortable: true },
        { name: "Total Amount", selector: (row: Billing) => row.totalAmount, sortable: true },
        {
        name: "Action",
        cell: (row: Billing) => (
            <div className="inline-flex space-x-2">
            <ShowIcon link={`/admin/billing/show/${row.id}`} />
            {canEditBilling && (
              <EditIcon link={`/admin/billing/edit/${row.id}`} />
            )}
            {canDeleteBilling && (
              <DeleteIcon onClick={() => handleAction("delete", row.id)} />
            )}
             <PrintIcon onClick={() => printBill(row)} />
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

  const printBill = (bill: Billing) => {
    setBillToPrint(bill);
    setTimeout(() => {
    if (contentRef.current) {
      handlePrint(); 
    } else {
      console.error("Content reference is not ready for printing.");
    }
  }, 100);
  };
  const createBilling = () => {
    navigate("/admin/billings/create");
  }

  useEffect(() => {
    fetchBillingData();
  }, [page, limit, sortField, sortOrder, search]);

  return (
    <div className="relative">
      <div className="flex justify-end mt-1 h-8">
        {canCreateBilling && (
          <AddButton title="Create Billing" onClick={createBilling} />
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
        data={billingData}
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
          <Invoice ref={contentRef} bill={billToPrint} />
        </div>
      )}
    </div>
  );
};

export default BillingIndex;
