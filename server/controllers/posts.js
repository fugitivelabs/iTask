/***********************************************************

Sever-side controllers for Post.  

By default, Yote's server controllers are dynamic relative 
to their models -- i.e. if you add fields to the Post
model, the create and update controllers below will respect
the new schema.

NOTE: make sure to account for any model changes 
on the client

***********************************************************/

var Post = require('mongoose').model('Post')
  ;

exports.list = function(req, res) {
  if(req.query.page) {
    console.log('list posts with pagination');
    var page = req.query.page || 1;
    var per = req.query.per || 20;
    Post.find({}).skip((page-1)*per).limit(per).exec(function(err, posts) {
      if(err || !posts) {
        res.send({success: false, message: err});
      } else {
        res.send({
          success: true
          , posts: posts
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });

  } else {
    console.log('list posts');
    Post.find({}).populate('author').exec(function(err, posts) {
      if(err || !posts) {
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, posts: posts });
      }
    });
  }
}

exports.search = function(req, res) {
  //search by query parameters
  // up to front end to make sure the params exist on the model
  console.log("searching for posts with params.");
  var mongoQuery = {};
  var page, per;
  for(key in req.query) {
    if(req.query.hasOwnProperty(key)) {
      if(key == "page") {
        page = req.query.page;
      } else if(key == "per") {
        per = req.query.per;
      } else {
        console.log("found search query param: " + key);
        mongoQuery[key] = req.query[key];
      }
    }
  }
  if(page || per) {
    console.log("searching for posts with pagination");
    console.log(mongoQuery);
    page = page || 1;
    per = per || 20;
    Post.find(mongoQuery).skip((page-1)*per).limit(per).exec(function(err, posts) {
      if(err || !posts) {
        res.send({ success: false, message: err });
      } else {
        res.send({ 
          success: true
          , posts: posts
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });
  } else {
    console.log(mongoQuery);
    Post.find(mongoQuery).exec(function(err, posts) {
      if(err || !posts) {
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, posts: posts });
      }
    });
  }
}

exports.getById = function(req, res) {
  console.log('get post by id');
  Post.findOne({_id:req.params.id}).exec(function(err, post) {
    if(err) {
      res.send({ success: false, message: err });
    } else if(!post) {
      res.send({ success: false, message: "no post found :(" });
    } else {
      res.send({ success: true, post: post });
    }
  });
}


// the post example uses slugs.  This is how you would find a resource by it's slug
exports.getBySlug = function(req, res) {
  console.log('get post by slug');
  Post.findOne({ slug: req.param('slug') }).exec(function(err, post) {
    if(err) {
      res.send({ success: false, message: err });
    } else if(!post) {
      res.send({ success: false, message: "no post found :(" });
    } else {
      res.send({ success: true, post: post });
    }
  });
}

exports.create = function(req, res) {
  var post = new Post({});
  for(var k in req.body) {
    if(req.body.hasOwnProperty(k)) {
      post[k] = req.body[k];
    }
  }
  post.save(function(err, post) {
    if(err) {
      res.send({ success: false, message: err });
    } else if(!post) {
      res.send({ success: false, message: "Could not create post :(" });
    } else {
      console.log("created new post");
      res.send({ success: true, post: post });
    }
  });
}

exports.update = function(req, res) {
  console.log("update post called");
  Post.findOne({ slug: req.param('slug') }).exec(function(err, post) {
    if(err) {
      res.send({ success: false, message: err });
    } else if(!post) {
      res.send({ success: false, message: "Post Not Found. Edit Failed." });
    } else {
      post.updated = new Date();
      for(var k in req.body) {
        if(req.body.hasOwnProperty(k)) {
          post[k] = req.body[k];
        }
      }
      post.save(function(err, post) {
        if(err) {
          res.send({ success: false, message: err });
        } else if(!post) {
          res.send({ success: false, message: "Could not save post :(" });
        } else {
          res.send({ success: true, post: post });
        }
      });
    }
  });
}

exports.delete = function(req, res) {
  console.log("deleting post");
  Post.findOne({ _id: req.param('id') }).remove(function(err) {
    if(err) {
      res.send({ success: false, message: err });
    } else {
      res.send({ success: true, message: "Deleted post."});
    }
  });
}
