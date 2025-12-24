import { useState } from 'react';
import AssistantButton from './AssistantButton';
import AssistantPanel from './AssistantPanel';
import FloatingCharacter from './FloatingCharacter';

export default function Assistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AssistantButton onClick={() => setIsOpen(true)} />
      {isOpen && <AssistantPanel onClose={() => setIsOpen(false)} />}
    </>
  );
}

