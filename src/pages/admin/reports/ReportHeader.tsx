import React from "react"
import { useBusinessConfig } from "@/hooks/useBusinessConfig";

interface ReportHeaderProps {
    title: string;
}
const ReportHeader: React.FC<ReportHeaderProps> = ({title}) => {
    const { businessConfig, loading, error } = useBusinessConfig();

    return (
        <div className="text-center mb-2">
            <h1 className="text-3xl font-bold mb-2">{ businessConfig?.businessName }</h1>
            <p className="text-sm mb-1">Contact: { businessConfig?.phone } | Email: { businessConfig?.email }</p>
            <p className="text-sm">Address: {businessConfig?.address}</p>
            <h6 className="mt-1 font-bold">{title}</h6>
        </div>
    );
}

export default ReportHeader;