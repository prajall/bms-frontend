import React from 'react';
import { Label } from './label';

type CheckboxProps = {
  label: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  id?: string; 
};

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, id }) => {
  return (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-2"
      />
      {label && (
        <Label htmlFor={id} className="text-sm">
          {label}
        </Label>
      )}
    </div>
  );
};

export default Checkbox;
