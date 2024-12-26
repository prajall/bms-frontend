import ServiceOrder from "@/components/admin/Forms/ServiceOrder";
import { createServiceOrder } from "@/hooks/useService";

type AddServiceOrderProps = {
  onSuccess: () => void;
};

const AddServiceOrder = ({ onSuccess }: AddServiceOrderProps) => {
    const handleAddServiceOrder = async (formData: FormData) => {
        createServiceOrder(formData, () => {
            onSuccess(); 
        });
    };

    return (
        <div className="relative">
            <ServiceOrder type={"create"} onSubmit={handleAddServiceOrder} />
        </div>
    );
}

export default AddServiceOrder