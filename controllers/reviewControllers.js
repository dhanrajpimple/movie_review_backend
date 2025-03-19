const pool = require('../config/db');

exports.addReview = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const userId = req.user.id;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const query = 'INSERT INTO reviews (movie_id, user_id, content) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [movieId, userId, content]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.editReview = async (req, res, next) => {
  try {
    const { movieId, reviewId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    // Ensure the review belongs to the user
    const checkQuery = 'SELECT * FROM reviews WHERE id = $1 AND user_id = $2';
    const checkResult = await pool.query(checkQuery, [reviewId, userId]);
    if (checkResult.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }
    const updateQuery = 'UPDATE reviews SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
    const updateResult = await pool.query(updateQuery, [content, reviewId]);
    res.json(updateResult.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { movieId, reviewId } = req.params;
    const userId = req.user.id;
    // Ensure the review belongs to the user
    const checkQuery = 'SELECT * FROM reviews WHERE id = $1 AND user_id = $2';
    const checkResult = await pool.query(checkQuery, [reviewId, userId]);
    if (checkResult.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    const deleteQuery = 'DELETE FROM reviews WHERE id = $1';
    await pool.query(deleteQuery, [reviewId]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

exports.likeReview = async (req, res, next) => {

  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Check if like already exists
    const checkQuery = `
      SELECT * FROM review_likes
      WHERE review_id = $1 AND user_id = $2
    `;
    const checkResult = await pool.query(checkQuery, [reviewId, userId]);

    if (checkResult.rows.length > 0) {
      // If exists → Delete it (Unlike)
      const deleteQuery = `
        DELETE FROM review_likes
        WHERE review_id = $1 AND user_id = $2
      `;
      await pool.query(deleteQuery, [reviewId, userId]);
      return res.json({ message: 'Review unliked' });
    } else {
      // If not exists → Insert it (Like)
      const insertQuery = `
        INSERT INTO review_likes (review_id, user_id)
        VALUES ($1, $2)
      `;
      await pool.query(insertQuery, [reviewId, userId]);
      return res.json({ message: 'Review liked' });
    }
  } catch (err) {
    next(err);
  }
  };
  

