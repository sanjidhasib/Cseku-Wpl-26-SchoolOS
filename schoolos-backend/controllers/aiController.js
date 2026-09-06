/**
 * AI Tutor Controller
 * Handles health checks and question answering via the RAG pipeline.
 * Week 3: Full AI + NCTB textbook retrieval integration.
 */

const answerService = require("../services/answerService");
const aiService = require("../services/aiService");

/**
 * GET /api/health — Health check with AI provider status
 */
const getHealthStatus = (req, res) => {
  const providerStatus = aiService.getProviderStatus();

  return res.status(200).json({
    status: "ok",
    message: "AI Tutor backend is running",
    ai: providerStatus,
  });
};

/**
 * POST /api/ask — RAG-powered AI Tutor answer generation
 *
 * Request body (validated by aiValidator middleware):
 *   { classLevel, subject, chapter, question }
 *
 * Response:
 *   {
 *     success: true,
 *     data: {
 *       answer: string,
 *       classLevel: number,
 *       subject: string,
 *       chapter: string,
 *       sources: [{ book, chapter, section, page }],
 *       noContextFound: boolean
 *     }
 *   }
 */
const askQuestion = async (req, res) => {
  const { classLevel, subject, chapter, question } = req.validatedData;

  try {
    const result = await answerService.getAnswer({
      classLevel,
      subject,
      chapter,
      question,
    });

    return res.status(200).json({
      success: true,
      data: {
        answer: result.answer,
        classLevel: result.classLevel,
        subject: result.subject,
        chapter: result.chapter,
        sources: result.sources,
        noContextFound: result.noContextFound,
      },
    });
  } catch (err) {
    // Log internally but never expose stack traces or API details to client
    console.error("[aiController] askQuestion error:", err.message);

    return res.status(503).json({
      success: false,
      message:
        err.message ||
        "The AI Tutor is temporarily unavailable. Please try again shortly.",
    });
  }
};

module.exports = {
  getHealthStatus,
  askQuestion,
};
