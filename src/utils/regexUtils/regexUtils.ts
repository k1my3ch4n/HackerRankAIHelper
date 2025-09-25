const INPUT_REGEX = /^((https:\/\/www\.hackerrank\.com\/challenges\/.+))$/;

export const questionInputFilter = ({
  questionInput,
}: {
  questionInput: string;
}) => {
  return {
    isValid: INPUT_REGEX.test(questionInput),
    url: questionInput,
  };
};
