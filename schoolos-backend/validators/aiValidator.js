/**
 * AI Tutor Request Validators
 */

const validateAskQuestion = (req, res, next) => {
  const { classLevel, subject, question, chapter } = req.body || {};

  // Check required fields existence
  if (
    classLevel === undefined ||
    classLevel === null ||
    classLevel === "" ||
    !subject ||
    !question
  ) {
    return res.status(400).json({
      success: false,
      message: "Class, subject, and question are required",
    });
  }

  // Validate classLevel range (1 to 10)
  const parsedClass = Number(classLevel);
  if (
    isNaN(parsedClass) ||
    !Number.isInteger(parsedClass) ||
    parsedClass < 1 ||
    parsedClass > 10
  ) {
    return res.status(400).json({
      success: false,
      message: "classLevel must be an integer between 1 and 10",
    });
  }

  // Validate subject is non-empty string
  if (typeof subject !== "string" || subject.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "subject must be a valid non-empty string",
    });
  }

  // Validate question is non-empty string
  if (typeof question !== "string" || question.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "question must not be empty",
    });
  }

  // Sanitize and attach normalized values
  req.validatedData = {
    classLevel: parsedClass,
    subject: subject.trim(),
    chapter: typeof chapter === "string" ? chapter.trim() : "",
    question: question.trim(),
  };

  next();
};

module.exports = {
  validateAskQuestion,
};
