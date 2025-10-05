import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-2 flex-wrap">
      <StatusBadge status="open" />
      <StatusBadge status="pending_customer" />
      <StatusBadge status="pending_agent" />
      <StatusBadge status="closed" />
    </div>
  );
}
