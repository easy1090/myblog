var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

var mongolass = new Mongolass();
mongolass.connect(config.mongodb);


// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
      results.forEach(function (item) {
        item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
      });
      return results;
    },
    afterFindOne: function (result) {
      if (result) {
        result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');/**result:{ _id: 59e0737a6205c67dc80c9f52,
          name: 'easy',
          password: '3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d',
          gender: 'm',
          bio: '111111',
          avatar: 'upload_ef7415cc523cd2a980c01690833b357f.jpg',
          created_at: '2017-10-13 16:04' } */
      }
      return result;
    }
  });

exports.User = mongolass.model('User', {
    name: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
    gender: { type: 'string', enum: ['m', 'f', 'x'] },
    bio: { type: 'string' }
  });
exports.User.index({ name: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一；我们定义了用户表的 schema，生成并导出了 User 这个 model，同时设置了 name 的唯一索引，保证用户名是不重复的。

exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId },
  title: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' }
});
exports.Post.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表

exports.Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId },
  content: { type: 'string' },
  postId: { type: Mongolass.Types.ObjectId }
});
exports.Comment.index({ postId: 1, _id: 1 }).exec();// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Comment.index({ author: 1, _id: 1 }).exec();// 通过用户 id 和留言 id 删除一个留言
