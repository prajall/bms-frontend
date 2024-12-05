import React from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

interface EditIconProps {
  link: string; // Dynamic link for edit
}

const EditIcon: React.FC<EditIconProps> = ({ link }) => (
  <Link
    to={link}
    className="flex items-center justify-center w-7 h-7 bg-orange-500 text-white border rounded-[5px] border-orange-500 hover:bg-orange-600 text-xs"
  >
    <Pencil className="w-4 mx-auto text-white" />
  </Link>
);

interface DeleteIconProps {
  onClick: () => void; // Callback for delete action
}

const DeleteIcon: React.FC<DeleteIconProps> = ({ onClick }) => (
  <Button
    variant="default"
    size="xs"
    onClick={onClick}
    className="flex items-center text-white bg-red-500 w-7 h-7 rounded-[5px] border border-red-600 hover:text-red-600 text-xs"
  >
    <Trash2 className="w-4 mx-auto text-white" />
  </Button>
);

interface ShowIconProps {
  link: string; // Dynamic link for edit
}

const ShowIcon: React.FC<ShowIconProps> = ({ link }) => (
  <Link
    to={link}
    className="flex items-center justify-center w-7 h-7 bg-primary text-white border rounded-[5px] border-primary hover:bg-primary text-xs"
  >
    <Eye className="w-4 mx-auto text-white" />
  </Link>
);


export { EditIcon, DeleteIcon, ShowIcon}
