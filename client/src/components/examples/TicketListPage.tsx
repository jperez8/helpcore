import TicketListPage from '../../pages/TicketListPage';

export default function TicketListPageExample() {
  return (
    <div className="p-6">
      <TicketListPage
        onTicketClick={(id) => console.log('Ticket clicked:', id)}
        onCreateTicket={() => console.log('Create ticket')}
      />
    </div>
  );
}
