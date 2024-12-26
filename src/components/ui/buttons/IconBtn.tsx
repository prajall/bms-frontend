import React from "react";
import { Pencil, Trash2, Eye, CopyPlus, ReceiptText, Repeat, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip } from 'react-tooltip'
import { Button } from "@/components/ui/button"; 

interface IconProps {
  link: string; 
}

interface ClickIconProps {
  onClick: () => void;
}

const EditIcon: React.FC<IconProps> = ({ link }) => (
  <Link
    to={link}
    className="flex items-center justify-center w-7 h-7 bg-orange-400 text-white border rounded-[5px] border-orange-400 hover:bg-orange-400 text-xs"
  >
    <Pencil className="w-4 mx-auto text-white" data-tooltip-id="edit" data-tooltip-content="Edit" />
    <Tooltip id="edit" />
  </Link>
);

const DeleteIcon: React.FC<ClickIconProps> = ({ onClick }) => (
  <Button
    variant="default"
    size="xs"
    onClick={onClick}
    className="flex items-center text-white bg-red-500 w-7 h-7 rounded-[5px] border border-red-600 hover:text-red-600 text-xs"
    data-tooltip-id="delete" data-tooltip-content="Delete"
  >
    <Trash2 className="w-4 mx-auto text-white" />
    <Tooltip id="delete" />
  </Button>
);

const ShowIcon: React.FC<IconProps> = ({ link }) => (
  <Link
    to={link}
    className="flex items-center justify-center w-7 h-7 bg-primary text-white border rounded-[5px] border-primary hover:bg-primary text-xs"
  >
    <Eye className="w-4 mx-auto text-white" data-tooltip-id="show" data-tooltip-content="View Details" />
    <Tooltip id="show" />
  </Link>
);

const RecurringIcon: React.FC<ClickIconProps> = ({ onClick }) => (
  <Button
    variant="default"
    size="xs"
    onClick={onClick}
    className="flex items-center text-white bg-yellow-500 w-7 h-7 rounded-[5px] border border-yellow-600 hover:text-yellow-600 text-xs"
    data-tooltip-id="re-order" data-tooltip-content="Recurring Order"
  >
    <Repeat className="w-4 mx-auto text-white" />
    <Tooltip id="re-order" />
  </Button>
);

const BillingIcon: React.FC<ClickIconProps> = ({ onClick }) => (
  <Button
    variant="default"
    size="xs"
    onClick={onClick}
    className="flex items-center w-7 h-7 bg-orange-700 text-white border rounded-[5px] border-orange-700 hover:bg-orange-700 text-xs"
    data-tooltip-id="billing" data-tooltip-content="Billing"
  >
    <ReceiptText className="w-4 mx-auto text-white" />
    <Tooltip id="billing" />
  </Button>
);

const ReOrderIcon: React.FC<ClickIconProps> = ({ onClick }) => (
  <Button
    variant="default"
    size="xs"
    onClick={onClick}
    className="flex items-center text-white bg-green-500 w-7 h-7 rounded-[5px] border border-green-600 hover:text-green-600 text-xs"
    data-tooltip-id="recurring" data-tooltip-content="Add Order"
  >
    <CopyPlus className="w-4 mx-auto text-white" />
    <Tooltip id="recurring" />
  </Button>
);

const PrintIcon: React.FC<ClickIconProps> = ({ onClick }) => (
  <Button
    variant="default"
    size="xs"
    onClick={onClick}
    className="flex items-center text-white bg-gray-500 w-7 h-7 rounded-[5px] border border-gray-500 hover:text-gray-500 text-xs"
    data-tooltip-id="print" data-tooltip-content="Print"
  >
    <Printer className="w-4 mx-auto text-white" />
    <Tooltip id="print" />
  </Button>
);


export { EditIcon, DeleteIcon, ShowIcon, ReOrderIcon, BillingIcon, RecurringIcon, PrintIcon}
