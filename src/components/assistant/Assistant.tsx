import { useState } from 'react';
import AssistantButton from './AssistantButton';
import AssistantPanel from './AssistantPanel';

export default function Assistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AssistantButton onClick={() => setIsOpen(true)} />
      {isOpen && <AssistantPanel onClose={() => setIsOpen(false)} />}
    </>
  );
}

