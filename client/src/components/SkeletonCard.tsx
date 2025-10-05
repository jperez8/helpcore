import { Card } from "@/components/ui/card";

export default function SkeletonCard() {
  return (
    <Card className="glass p-4">
      <div className="space-y-3">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-6 w-16" />
        </div>
      </div>
    </Card>
  );
}
