import TicketCard from '../TicketCard';

export default function TicketCardExample() {
  return (
    <div className="space-y-4 p-4 max-w-2xl">
      <TicketCard
        id="TK-001"
        subject="¿Cuánto tarda cambiar la pantalla del iPhone 12?"
        customer="Juan Pérez"
        status="open"
        priority="high"
        channel="whatsapp"
        assignee="María García"
        createdAt={new Date(Date.now() - 1000 * 60 * 15)}
        onClick={() => console.log('Ticket clicked')}
      />
      <TicketCard
        id="TK-002"
        subject="Consulta sobre garantía de reparación"
        customer="Ana Martínez"
        status="pending_customer"
        priority="medium"
        channel="email"
        assignee="Carlos López"
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 2)}
        onClick={() => console.log('Ticket clicked')}
      />
      <TicketCard
        id="TK-003"
        subject="Presupuesto para cambio de batería"
        customer="Luis Rodríguez"
        status="closed"
        priority="low"
        channel="web"
        createdAt={new Date(Date.now() - 1000 * 60 * 60 * 24)}
        onClick={() => console.log('Ticket clicked')}
      />
    </div>
  );
}
