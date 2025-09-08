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
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const isMultiLine = String(children).includes("\n");

      if ((match || isMultiLine) && match !== null) {
        return (
          <div className="mb-6">
            <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <div className="bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 border-b border-gray-600 flex items-center justify-between">
                <span className="uppercase tracking-wide">{match[1]}</span>
                <span className="text-xs text-gray-400">코드</span>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm font-mono leading-relaxed" {...props}>
                  {String(children).replace(/\n$/, "")}
                </code>
              </pre>
            </div>
          </div>
        );
      }

      return (
        <code
          className="bg-main text-black px-1.5 py-0.5 rounded text-sm font-mono border border-main font-semibold inline whitespace-nowrap"
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
};

export default MarkdownWrapper;
