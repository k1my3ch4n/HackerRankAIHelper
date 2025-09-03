const INPUT_REGEX =
  /^((https:\/\/www\.hackerrank\.com\/challenges\/.+)|([a-zA-Z0-9 ]+))$/;

const START_URL = "https://www.hackerrank.com/challenges/";

export const questionInputFilter = ({
  questionInput,
}: {
  questionInput: string;
}) => {
  let questionName = questionInput;

  if (questionInput.startsWith(START_URL)) {
    const splitUrl = questionInput.split("/");

    questionName = splitUrl[4].replace(/-/g, " ");
  }

  return {
    isValid: INPUT_REGEX.test(questionInput),
    questionName,
  };
};
