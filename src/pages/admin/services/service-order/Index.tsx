import React, { useEffect, useState } from "react";
import axios from "axios";
import TableLayout from "@/components/admin/TableLayout";
import AddButton from "@/components/ui/buttons/AddButton";
import Modal from "@/components/ui/Model";
import {
  DeleteIcon,
  EditIcon,
  ShowIcon,
  ReOrderIcon,
  BillingIcon,
  RecurringIcon
} from "@/components/ui/buttons/IconBtn";
import AddServiceOrder from "./Create";
import RecurringOrder from "./Recurring";
import ServiceBilling from "./Billing";
import ReOrder from "./Reorder";
import { toast } from "react-toastify";
import { SuccessToast, ErrorToast } from "@/components/ui/customToast";
import usePermission from "@/hooks/usePermission";

type ServiceOrder = {
  id: string;
  orderId: string;
  service: string;
  customer: string;
  serviceCharge: string;
  serviceDate: Date;
  isRecurring: boolean;
  nextDate: Date;
  status: string;
  paymentStatus: string;
};

const ServiceOrderIndex = () => {
  const [serviceOrders, setServiceOrder] = useState<ServiceOrder[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isReOrderModalOpen, setIsReOrderModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const canCreateServiceOrder = usePermission("service_order", "create");
  const canEditServiceOrder = usePermission("service_order", "edit");
  const canDeleteServiceOrder = usePermission("service_order", "delete");
  const canCreateBilling = usePermission("billing", "create");

  const fetchServiceOrder = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/service-order`,
          { params: { page, limit, sortField, sortOrder, search }, withCredentials: true }
      );
      if (response.status === 200 && response.data.success) {
        const formattedData = response.data.data.serviceOrders.map((item: any) => ({
          id: item._id,
          orderId: item.orderId,
          service: item.service?.title || "",
          customer: item.customer?.name || "",
          serviceCharge: item.serviceCharge ? item.serviceCharge.toString() : "0",
          serviceDate: item.date
            ? new Date(item.date).toISOString().split("T")[0]
            : "",
          isRecurring: item.isRecurring,
          nextDate: item.nextServiceDate
            ? new Date(item.nextServiceDate).toISOString().split("T")[0]
            : "",
          status: item.status,
          paymentStatus: item.paymentStatus,
        }));
        setServiceOrder(formattedData);
        setTotalRows(response.data.data.totalOrders);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Failed to fetch service.");
      }
    } catch (error) {
      console.error("Error fetching service data:", error);
    }
  };
  useEffect(() => {
    fetchServiceOrder();
  }, [page, limit, sortField, sortOrder, search]);

  const handleAction = async (action: string, id: string) => {
    if (action === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this service order?"
      );
      if (!confirmDelete) return;

      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/service-order/${id}`
        );
        if (response.status === 200 && response.data.success) {
          toast(<SuccessToast message={response.data.message} />, {
            autoClose: 5000,
          });
          fetchServiceOrder();
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

  // Open ReOrder Modal
  const handleReOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsReOrderModalOpen(true);
  };

  const handleRecurring = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsRecurringModalOpen(true);
  };

  // Close ReOrder Modal
  const handleCloseReOrderModal = () => {
    setIsReOrderModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleCloseRecurringModal = () => {
    setIsRecurringModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleBilling = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsBillingModalOpen(true);
  };

  const handleCloseBillingModal = () => {
    setIsBillingModalOpen(false);
    setSelectedOrderId(null);
  };

  const columns = [
        {
        name: "SN",
        // selector: (_: ServiceOrder, index: number) => index + 1,
        cell: (_: ServiceOrder, index: number) => index + 1,
        sortable: false,
        width: "60px",
        },
        {
        name: "Order ID",
          selector: (row: ServiceOrder) => row.orderId,
          sortable: true,
          wrap: true,
          width: "130px",
        },
        {
        name: "Service",
        selector: (row: ServiceOrder) => row.service,
            sortable: true,
            wrap: true
        },
        { name: "Customer", selector: (row: ServiceOrder) => row.customer, wrap: true, sortable: true },
        { name: "Charge", selector: (row: ServiceOrder) => row.serviceCharge, width: "130px" },
        { name: "Date", selector: (row: ServiceOrder) => row.serviceDate, sortable: true, width: "130px" },
        {
          name: "Is Recurring",
          selector: (row: ServiceOrder) => (
            <span style={{ color: row.isRecurring ? "green" : "red" }}>
              {row.isRecurring ? "✓" : "✗"}
            </span>
          ),
          sortable: true, width: "110px"
        },
        { name: "Next Date", selector: (row: ServiceOrder) => row.nextDate, sortable: true, width: "130px" },
        {
        name: "Status",
          sortable: true,
          width: "110px",
          selector: (row: ServiceOrder) => {
              const getStatusColor = (status: string) => {
                  switch (status.toLowerCase()) {
                      case 'pending':
                          return 'blue'; 
                      case 'completed':
                          return 'green';  
                      case 'cancelled':
                          return 'red';   
                      case 'delayed':
                          return 'orange'; 
                      default:
                          return 'gray'; 
                  }
              };

              return (
                  <div style={{ color: getStatusColor(row.status) }}>
                      {row.status}
                  </div>
              );
          }
        },
        {
          name: "Payment Status",
          sortable: true,
          width: "150px",
          selector: (row: ServiceOrder) => {
            const getStatusColor = (paymentStatus: string) => {
              switch (paymentStatus.toLowerCase()) {
                case 'pending':
                  return 'blue';
                case 'paid':
                  return 'green';
                case 'partial':
                  return 'orange';
                default:
                  return 'gray';
              }
            };

            return (
              <div style={{ color: getStatusColor(row.paymentStatus) }}>
                {row.paymentStatus}
              </div>
            );
          }
        },
        {
        name: "Action",
        cell: (row: ServiceOrder) => (
          <div className="inline-flex space-x-2">      
            <ShowIcon link={`/admin/service_order/show/${row.id}`} />
            {canEditServiceOrder && (
              <EditIcon link={`/admin/service_order/edit/${row.id}`} />
            )}
            {canCreateServiceOrder && (
              <ReOrderIcon onClick={() => handleReOrder(row.id)} />
            )}
            {canDeleteServiceOrder && (
              <DeleteIcon onClick={() => handleAction("delete", row.id)} />
            )}
            {canCreateBilling && row.paymentStatus !== 'paid' ? (
              <BillingIcon onClick={() => handleBilling(row.id)} />
            ) : null}
            {canCreateServiceOrder && row.isRecurring && row.status.toLowerCase() !== "completed" ? (
              <RecurringIcon onClick={() => handleRecurring(row.id)} />
            ) : null}
          </div>
        ),
        sortable: false,
        },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex justify-end mt-1 h-8">
        {canCreateServiceOrder && (
          <AddButton title="Add ServiceOrder" onClick={handleOpenModal} />
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
        data={serviceOrders}
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

      {/* Modal for Adding ServiceOrder */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Service Order"
        size="6xl"
      >
        <AddServiceOrder
          onSuccess={() => {
            handleCloseModal();
            fetchServiceOrder();
          }}
        />
      </Modal>

      {/* ReOrder Modal */}
      <Modal
        isOpen={isReOrderModalOpen}
        onClose={handleCloseReOrderModal}
        title="ReOrder Service Order"
        size="6xl"
      >
        {selectedOrderId && ( 
          <ReOrder
            orderId={selectedOrderId} 
            onSuccess={() => {
              handleCloseReOrderModal();
              fetchServiceOrder(); 
            }}
          />
        )}
      </Modal>

      {/* Recurring Modal */}
      <Modal
        isOpen={isRecurringModalOpen}
        onClose={handleCloseRecurringModal}
        title="Recurring Service Order"
        size="6xl"
      >
        {selectedOrderId && ( 
          <RecurringOrder
            orderId={selectedOrderId} 
            onSuccess={() => {
              handleCloseRecurringModal();
              fetchServiceOrder(); 
            }}
          />
        )}
      </Modal>

       {/* Billing Modal */}
      <Modal
        isOpen={isBillingModalOpen}
        onClose={handleCloseBillingModal}
        title="Billing"
        size="4xl"
      >
        {selectedOrderId && ( 
          <ServiceBilling
            orderId={selectedOrderId} 
            onSuccess={() => {
              handleCloseBillingModal();
              fetchServiceOrder(); 
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ServiceOrderIndex;
