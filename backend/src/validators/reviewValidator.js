const VALID_RATINGS = [1, 2, 3, 4, 5];

const validateCreateReview = (body) => {
  const { rating, title, comment } = body;

  if (rating === undefined || rating === null || rating === "") {
    return { valid: false, message: "Rating is required" };
  }
  const parsedRating = parseInt(rating, 10);
  if (isNaN(parsedRating) || !VALID_RATINGS.includes(parsedRating)) {
    return { valid: false, message: "Rating must be an integer between 1 and 5" };
  }

  if (title !== undefined && title !== null && title !== "") {
    if (typeof title !== "string" || title.trim().length > 150) {
      return { valid: false, message: "Title must not exceed 150 characters" };
    }
  }

  if (comment !== undefined && comment !== null && comment !== "") {
    if (typeof comment !== "string") {
      return { valid: false, message: "Comment must be a string" };
    }
    if (comment.trim().length > 2000) {
      return { valid: false, message: "Comment must not exceed 2000 characters" };
    }
  }

  return { valid: true };
};

const validateUpdateReview = (body) => {
  const { rating, title, comment } = body;

  if (rating !== undefined && rating !== null && rating !== "") {
    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || !VALID_RATINGS.includes(parsedRating)) {
      return { valid: false, message: "Rating must be an integer between 1 and 5" };
    }
  }

  if (title !== undefined && title !== null && title !== "") {
    if (typeof title !== "string" || title.trim().length > 150) {
      return { valid: false, message: "Title must not exceed 150 characters" };
    }
  }

  if (comment !== undefined && comment !== null && comment !== "") {
    if (typeof comment !== "string" || comment.trim().length > 2000) {
      return { valid: false, message: "Comment must not exceed 2000 characters" };
    }
  }

  if (rating === undefined && title === undefined && comment === undefined) {
    return { valid: false, message: "At least one field (rating, title, or comment) must be provided for update" };
  }

  return { valid: true };
};

module.exports = { validateCreateReview, validateUpdateReview };
