import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface Field {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
}

interface Action {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "ghost" | "destructive";
}

interface MobileTableCardProps {
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  fields?: Field[];
  actions?: Action[];
}

export function MobileTableCard({
  icon: Icon,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-600",
  title,
  subtitle,
  fields = [],
  actions = [],
}: MobileTableCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
          )}
          <div>
            <p className="font-medium">{title}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {actions.length > 0 && (
          <div className="flex items-center gap-1">
            {actions.map((action, i) => (
              <Button
                key={i}
                variant={action.variant === "destructive" ? "ghost" : "ghost"}
                size="icon"
                onClick={action.onClick}
                className="min-h-[44px] min-w-[44px]"
                title={action.label}
              >
                <action.icon className={`h-4 w-4 ${action.variant === "destructive" ? "text-red-500" : ""}`} />
              </Button>
            ))}
          </div>
        )}
      </div>
      {fields.length > 0 && (
        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={i} className="flex items-center text-sm text-gray-600">
              {field.icon && <field.icon className="mr-2 h-4 w-4 text-gray-400 shrink-0" />}
              <span className="truncate">{field.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
