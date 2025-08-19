export const problemInputFilter = ({ problem }: { problem: string }) => {
  const inputRegex =
    /^((https:\/\/www\.hackerrank\.com\/challenges\/.+)|([a-zA-Z0-9 ]+))$/;

  return inputRegex.test(problem);
};
