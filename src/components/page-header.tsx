import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-900 md:text-2xl">{title}</h2>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
