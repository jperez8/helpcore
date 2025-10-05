import TicketDetailPage from '../../pages/TicketDetailPage';

export default function TicketDetailPageExample() {
  return (
    <div className="h-screen">
      <TicketDetailPage onBack={() => console.log('Back clicked')} />
    </div>
  );
}
