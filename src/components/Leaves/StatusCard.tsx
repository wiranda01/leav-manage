import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  CircleEllipsis,
  XCircle,
} from "lucide-react";
import { colorCheck } from "./LeaveDialog";

type StatusCardsProps = {
  trigger: { name: string | null; className: string | null };
  apprStatus:
    | {
        level: string;
        name: string | null;
        status: string | null;
        reviewAt: Date | null;
      }[]
    | null;
};

const StatusCard = ({ trigger, apprStatus }: StatusCardsProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          className={`${trigger.className} hover:cursor-pointer flex gap-1 capitalize`}
        >
          {trigger.name} <AlertCircle size={18} />
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 space-y-4">
        {apprStatus && apprStatus.length > 0 ? (
          apprStatus?.map((appr, index) => (
            <div key={index} className="flex justify-between space-x-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">
                  <span className="capitalize">{appr.level}</span> Approver :{" "}
                  {appr.name || "No Approver"}
                </h4>
                <p className="text-sm flex gap-1">
                  Approval Status :{" "}
                  <span
                    className={`${colorCheck(
                      appr.status || ""
                    )} flex items-center gap-1 capitalize`}
                  >
                    <span className="flex">
                      {appr.status || <CircleEllipsis size={15} />}
                    </span>{" "}
                    {appr.status === "pending" ? (
                      <CircleEllipsis size={15} />
                    ) : appr.status === "approved" ? (
                      <CheckCircle2 size={15} />
                    ) : appr.status === "rejected" ? (
                      <XCircle size={15} />
                    ) : (
                      ""
                    )}
                  </span>
                </p>
                <div className="flex items-center pt-2">
                  <CalendarClock className="mr-2 h-4 w-4 opacity-70" />{" "}
                  <span className="flex gap-1 text-xs text-muted-foreground">
                    Reviewed at :{" "}
                    {appr.reviewAt ? (
                      appr.reviewAt.toLocaleString("en-GB")
                    ) : (
                      <CircleEllipsis size={13} />
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h4 className="text-sm font-semibold text-center">No Approver</h4>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default StatusCard;
