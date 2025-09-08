import ReactMarkdown, { Components } from "react-markdown";

const MarkdownWrapper = ({ children }: { children: string }) => {
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold border-b-3 py-3">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold py-3 my-3">{children}</h2>
    ),
  };

  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
};

export default MarkdownWrapper;
