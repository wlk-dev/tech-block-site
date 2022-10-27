const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

User.hasMany(Post, {
    foreignKey : 'author_id',
    onDelete : 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey : 'author_id'
});

User.hasMany(Comment, {
    foreignKey : 'commenter_id',
    onDelete : "CASCADE"
});

Comment.belongsTo(User, {
    foreignKey : "commenter_id"
});

Post.hasMany(Comment, {
    foreignKey : 'post_id',
    onDelete : "CASCADE"
});

Comment.belongsTo(Post, {
    foreignKey : 'post_id'
});