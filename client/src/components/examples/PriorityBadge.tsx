import PriorityBadge from '../PriorityBadge';

export default function PriorityBadgeExample() {
  return (
    <div className="flex gap-2">
      <PriorityBadge priority="low" />
      <PriorityBadge priority="medium" />
      <PriorityBadge priority="high" />
    </div>
  );
}
