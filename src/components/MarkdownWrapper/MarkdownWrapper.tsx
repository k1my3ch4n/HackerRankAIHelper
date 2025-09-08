import ReactMarkdown, { Components } from "react-markdown";

const MarkdownWrapper = ({ children }: { children: string }) => {
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold border-b-3 py-3">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold py-3 my-3">{children}</h2>
    ),
    p: ({ children }) => <p className="mb-2 leading-7 text-base">{children}</p>,
    ul: ({ children, ...props }) => (
      <ul className="mb-2 ml-5 list-disc list-outside" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-2 ml-5 list-decimal list-outside" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className=" leading-6 pl-1 py-1" {...props}>
        {children}
      </li>
    ),
  };

  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
};

export default MarkdownWrapper;
