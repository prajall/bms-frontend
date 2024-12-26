import Billing from "@/components/admin/Forms/Billing";
import { createBilling } from "@/hooks/useBilling";

type AddBillingProps = {
  onSuccess: (bill: any) => void;
};

const AddBilling = ({ onSuccess }: AddBillingProps) => {
    const handleAddBilling = async (formData: FormData) => {
        createBilling(formData, (data) => {
            onSuccess(data); 
        });
    };

    return (
        <div className="relative">
            <Billing onSubmit={handleAddBilling} />
        </div>
    );
}

export default AddBilling