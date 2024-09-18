import React from 'react';

// Define an interface for the component props
interface HTMLContentProps {
  content: string; // Specify that content is a string
}

// Use the interface in the component
const HTMLContent: React.FC<HTMLContentProps> = ({ content }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default HTMLContent;
