const INPUT_REGEX =
  /^((https:\/\/www\.hackerrank\.com\/challenges\/.+)|([a-zA-Z0-9 ]+))$/;

const START_URL = "https://www.hackerrank.com/challenges/";

export const problemInputFilter = ({ problem }: { problem: string }) => {
  let problemName = problem;

  if (problem.startsWith(START_URL)) {
    const splitUrl = problem.split("/");

    problemName = splitUrl[4].replace(/-/g, " ");
  }

  return {
    isProblem: INPUT_REGEX.test(problem),
    problemName,
  };
};
