const pool = require('../config/db');

exports.getMovies = async (req, res, next) => {
  try {
    const moviesQuery = `
      SELECT m.*, 
             (SELECT COUNT(*) FROM reviews r WHERE r.movie_id = m.id) AS review_count
      FROM movies m
    `;
    const movies = await pool.query(moviesQuery);
    res.json(movies.rows);
  } catch (err) {
    next(err);
  }
};


exports.getMovieDetails = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    // Get movie details
    const movieResult = await pool.query('SELECT * FROM movies WHERE id = $1', [movieId]);
    if (movieResult.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    const movie = movieResult.rows[0];

    // Fetch reviews with sorting and pagination
    let { sort, page, limit } = req.query;
    sort = sort || 'recent';
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    let orderBy;
    if (sort === 'popularity') {
      orderBy = 'likes_count DESC, created_at DESC';
    } else {
      orderBy = 'created_at DESC';
    }

    const reviewsQuery = `
      SELECT r.*, u.username,
        (SELECT COUNT(*) FROM review_likes rl WHERE rl.review_id = r.id) as likes_count
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.movie_id = $1
      ORDER BY ${orderBy}
      LIMIT $2 OFFSET $3
    `;
    const reviewsResult = await pool.query(reviewsQuery, [movieId, limit, offset]);

    res.json({ movie, reviews: reviewsResult.rows });
  } catch (err) {
    next(err);
  }
};
