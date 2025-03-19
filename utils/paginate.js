const paginate = (query, { page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;
    return {
      ...query,
      limit,
      offset
    };
  };
  
  module.exports = paginate;