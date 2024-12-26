import React from 'react';
import { Label } from './label';

type CheckboxProps = {
  label: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  id?: string; 
  disabled?: boolean;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, id, disabled }) => {
  return (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-2"
        disabled={disabled}
      />
      {label && (
        <Label htmlFor={id} className={`text-sm ${disabled ? 'disabled' : ''}`}>
          {label}
        </Label>
      )}
    </div>
  );
};

export default Checkbox;
