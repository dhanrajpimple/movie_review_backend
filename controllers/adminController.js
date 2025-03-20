const pool = require('../config/db');

exports.createMovie = async (req, res, next) => {
  try {
    const { title, description, release_date, url } = req.body;
    if (!title || !description || !release_date  || !url) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const query = 'INSERT INTO movies (title, description, release_date , url) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [title, description, release_date, url]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { title, description, release_date, url } = req.body;
    const query = 'UPDATE movies SET title = $1, description = $2, release_date = $3, url = $4 WHERE id = $4 RETURNING *';
    const result = await pool.query(query, [title, description, release_date, movieId, url]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const query = 'DELETE FROM movies WHERE id = $1';
    await pool.query(query, [movieId]);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    next(err);
  }
};

exports.deleteReviewAdmin = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const query = 'DELETE FROM reviews WHERE id = $1';
    await pool.query(query, [reviewId]);
    res.json({ message: 'Review deleted by admin' });
  } catch (err) {
    next(err);
  }
};
