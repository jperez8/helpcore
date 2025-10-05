import MessageBubble from '../MessageBubble';

export default function MessageBubbleExample() {
  return (
    <div className="p-4 max-w-3xl space-y-4">
      <MessageBubble
        text="¿Cuánto tarda cambiar la pantalla del iPhone 12?"
        authorType="customer"
        authorName="Juan Pérez"
        timestamp={new Date(Date.now() - 1000 * 60 * 30)}
      />
      <MessageBubble
        text="Hola Juan, el cambio de pantalla para iPhone 12 tarda aproximadamente 45 minutos. Tenemos disponibilidad hoy mismo."
        authorType="agent"
        authorName="María García"
        timestamp={new Date(Date.now() - 1000 * 60 * 15)}
        attachments={[{ name: 'presupuesto.pdf', url: '#' }]}
      />
      <MessageBubble
        text="Ticket asignado a María García"
        authorType="system"
        timestamp={new Date(Date.now() - 1000 * 60 * 5)}
      />
      <MessageBubble
        text="Perfecto, ¿cuál es el precio?"
        authorType="customer"
        authorName="Juan Pérez"
        timestamp={new Date()}
      />
    </div>
  );
}
