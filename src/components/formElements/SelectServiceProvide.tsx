import AddButton from '../ui/buttons/AddButton';
import useServiceProvided from '@/hooks/useServiceProvide';
import Select from 'react-select';

interface ServiceProvidedSelectProps {
  selectedServiceProvided: string;
  onChange: (value: string) => void;
  loadingText?: string;
  showAddServiceProvidedButton?: boolean;
}

const ServiceProvidedSelect: React.FC<ServiceProvidedSelectProps> = ({
  selectedServiceProvided,
  onChange,
  loadingText = "Loading serviceProvideds...",
  showAddServiceProvidedButton = false,
}) => {
  const { serviceprovided, loading } = useServiceProvided();

  const options = serviceprovided.map((service) => ({
    value: service._id,
    label: service.title,
  }));

  const handleAddServiceProvided = () => {
    console.log("Navigate to the add service Provided page or show a modal.");
    // Handle the logic to navigate to the "Add ServiceProvided" page or show a modal
  };

  

  return (
    <div>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
          <Select 
            id="serviceProvided"
            options={options}
            value={options.find((option) => option.value === selectedServiceProvided) || null} 
            onChange={(option) => onChange(option ? option.value : "")}
            placeholder="Select or type a service provided"
            noOptionsMessage={() => "No service provided available"}
          />
      )}

      {/* Only show "Add ServiceProvided" button if service provided are not found and showAddServiceProvidedButton is true */}
      <div className="mt-2">
        {serviceprovided.length === 0 && showAddServiceProvidedButton && (
          <AddButton title="Add ServiceProvided" onClick={handleAddServiceProvided} size="small" />
        )}
      </div>
      
    </div>
  );
};

interface MultiServiceProvidedProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  loadingText?: string;
  showAddServiceProvidedButton?: boolean;
}

const MultiServiceProvided: React.FC<MultiServiceProvidedProps> = ({
  selectedValues,
  onChange,
  loadingText = "Loading service provided...",
  showAddServiceProvidedButton = false,
}) => {
  const { serviceprovided, loading } = useServiceProvided();
  const options = serviceprovided.map((service) => ({
    value: service._id,
    label: `${service.title} - $service.modelNo}` ,
  }));

  const handleAddServiceProvided = () => {
    console.log("Navigate to the add service Provided page or show a modal.");
    // Handle the logic to navigate to the "Add ServiceProvided" page or show a modal
  };

  return (
    <div>
      {loading ? (
        <div>{loadingText}</div>
      ) : (
        <Select
          id="multi-serviceProvided-select"
          options={options}
          value={options.filter((option) => selectedValues.includes(option.value))}
          onChange={(selected) => {
            const selectedIds = (selected as { value: string; label: string }[]).map(
              (option) => option.value
            );
            onChange(selectedIds);
          }}
          isMulti
          placeholder="Select or type service provided"
          noOptionsMessage={() => "No service provided available"}
        />
      )}

      <div className="mt-2">
        {serviceprovided.length === 0 && showAddServiceProvidedButton && (
          <AddButton title="Add ServiceProvided" onClick={handleAddServiceProvided} size="small" />
        )}
      </div>
      
    </div>
  );
};


export { ServiceProvidedSelect, MultiServiceProvided };
