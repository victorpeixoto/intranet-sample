import { Chat } from '@/components/Chat';

export function ChatPage() {
  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
        <p className="text-gray-600">Converse com outros funcionários</p>
      </div>
      
      <div className="h-[calc(100vh-200px)]">
        <Chat maxHeight="h-full" showHeader={false} />
      </div>
    </div>
  );
}
