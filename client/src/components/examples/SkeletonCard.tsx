import SkeletonCard from '../SkeletonCard';

export default function SkeletonCardExample() {
  return (
    <div className="space-y-4 p-4 max-w-2xl">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
