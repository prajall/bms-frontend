import { useState } from "react";
import Billing from "@/components/admin/Forms/Billing";
import { createBilling } from "@/hooks/useBilling";
import Invoice from "./Invoice";
import { useNavigate } from "react-router-dom";
import { Billing as BillingType } from "./Index";
import Breadcrumb from "@/components/admin/Breadcrumbs/Breadcrumb";

// type AddBillingProps = {
//   onSuccess: (bill: any) => void;
// };

const AddBilling = () => {
    const navigate = useNavigate();
    const [billToPrint, setBillToPrint] = useState<BillingType | null>(null);

    const handleAddBilling = async (formData: FormData) => {
        createBilling(formData, (data) => {
            const formattedBill = {
                id: data._id,
                invoice: "Demo123",
                orderId: data.orderId || "",
                customer: data.customer?.name || "Guest",
                totalAmount: data.totalAmount,
                paidAmount: data.paidAmount,
                totalPaid: data.totalPaid,
                date: data.date ? new Date(data.date) : new Date(),
                service: data.serviceOrder?.service?.title,
                customerPhone: data.customer?.phoneNo,
                customerAddress: data.customer
                    ? `${data.customer.address.houseNo}, ${data.customer.address.addressLine}, ${data.customer.address.city}, ${data.customer.address.province}, ${data.customer.address.country}`
                    : "Address not available",
                serviceCharge: data.serviceOrder?.serviceCharge,
    };
            setBillToPrint(formattedBill);
            navigate("/admin/billings");
        });
    };

    return (
        <div className="relative">
            <Breadcrumb pageName="Create Billing" />
            <Billing onSubmit={handleAddBilling} />
            {billToPrint && (
                <Invoice bill={billToPrint}  />
            )}
        </div>
    );
}

export default AddBilling