import React, { memo } from 'react';
import { RichTextEditor } from '@mantine/rte';

// Props interface
interface TextEditorProps {
  value: string; // Current editor content
  onChange: (content: string) => void; // Callback for when content changes
  id?: string; // Optional ID for the component
}

const TextEditor: React.FC<TextEditorProps> = memo(({ value, onChange, id }) => {
  return (
    <div id={id} className="text-editor-container">
      <RichTextEditor
        value={value}
        onChange={onChange}
        controls={[
          ['bold', 'italic', 'underline', 'strike'], // Text formatting
          ['h1', 'h2', 'h3'], // Headers
          ['unorderedList', 'orderedList'], // Lists
          ['link', 'blockquote', 'codeBlock'], // Links and blocks
          ['alignLeft', 'alignCenter', 'alignRight'], // Alignments
        ]}
      />
    </div>
  );
});

export default TextEditor;
