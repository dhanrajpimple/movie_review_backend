'use strict';

exports.up = function(db) {
  return db.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    email: { type: 'string', length: 255, notNull: true, unique: true },
    password: { type: 'string', length: 255, notNull: true },
    role: { type: 'string', length: 20, defaultValue: 'user' },
    created_at: { 
      type: 'timestamp', 
      notNull: true, 
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  });
};

exports.down = function(db) {
  return db.dropTable('users');
};