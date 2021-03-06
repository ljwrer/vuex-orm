import { createApplication, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Repo from 'app/repo/Repo'

describe('Repo – Create – Morph Many', () => {
  it('can create a morph many relation data', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          body: this.attr(''),
          commentable_id: this.attr(null),
          commentable_type: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: Post }, { model: Video }, { model: Comment }])

    const state = createState('entities', {
      posts: {},
      videos: {},
      comments: {}
    })

    const data = {
      id: 1,
      comments: [
        { id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        { id: 3, body: 'comment2', commentable_id: 1, commentable_type: 'posts' }
      ]
    }

    const expected = createState('entities', {
      posts: {
        '1': { $id: 1, id: 1, comments: [2, 3] }
      },
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '3': { $id: 3, id: 3, body: 'comment2', commentable_id: 1, commentable_type: 'posts' }
      }
    })

    Repo.create(state, 'posts', data)

    expect(state).toEqual(expected)
  })

  it('can create many morph many relation data', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          body: this.attr(''),
          commentable_id: this.attr(null),
          commentable_type: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: Post }, { model: Video }, { model: Comment }])

    const state = createState('entities', {
      posts: {},
      videos: {},
      comments: {}
    })

    const data = [
      {
        id: 1,
        comments: [
          { id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
          { id: 3, body: 'comment2', commentable_id: 1, commentable_type: 'posts' }
        ]
      },
      {
        id: 2,
        comments: [
          { id: 4, body: 'comment3', commentable_id: 2, commentable_type: 'posts' }
        ]
      }
    ]

    const expected = createState('entities', {
      posts: {
        '1': { $id: 1, id: 1, comments: [2, 3] },
        '2': { $id: 2, id: 2, comments: [4] }
      },
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '3': { $id: 3, id: 3, body: 'comment2', commentable_id: 1, commentable_type: 'posts' },
        '4': { $id: 4, id: 4, body: 'comment3', commentable_id: 2, commentable_type: 'posts' }
      }
    })

    Repo.create(state, 'posts', data)

    expect(state).toEqual(expected)
  })

  it('generates id and types for the morph many relations', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          body: this.attr(''),
          commentable_id: this.attr(null),
          commentable_type: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: Post }, { model: Video }, { model: Comment }])

    const state = createState('entities', {
      posts: {},
      videos: {},
      comments: {}
    })

    const data = {
      id: 1,
      comments: [
        { id: 2, body: 'comment1' },
        { id: 3, body: 'comment2' }
      ]
    }

    const expected = createState('entities', {
      posts: {
        '1': { $id: 1, id: 1, comments: [2, 3] }
      },
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '3': { $id: 3, id: 3, body: 'comment2', commentable_id: 1, commentable_type: 'posts' }
      }
    })

    Repo.create(state, 'posts', data)

    expect(state).toEqual(expected)
  })

  it('generates only missing id or types for the morph many relations', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          body: this.attr(''),
          commentable_id: this.attr(null),
          commentable_type: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: Post }, { model: Video }, { model: Comment }])

    const state = createState('entities', {
      posts: {},
      videos: {},
      comments: {}
    })

    const data = {
      id: 1,
      comments: [
        { id: 2, body: 'comment1', commentable_id: 1 },
        { id: 3, body: 'comment2', commentable_id: 2 }
      ]
    }

    const expected = createState('entities', {
      posts: {
        '1': { $id: 1, id: 1, comments: [2, 3] }
      },
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '3': { $id: 3, id: 3, body: 'comment2', commentable_id: 2, commentable_type: 'posts' }
      }
    })

    Repo.create(state, 'posts', data)

    expect(state).toEqual(expected)
  })

  it('would not generate id or types for non nested relations', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          body: this.attr(''),
          commentable_id: this.attr(null),
          commentable_type: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: Post }, { model: Video }, { model: Comment }])

    const state = createState('entities', {
      posts: {},
      videos: {},
      comments: {}
    })

    const data = [
      { id: 2, body: 'comment1' },
      { id: 3, body: 'comment2' }
    ]

    const expected = createState('entities', {
      posts: {},
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: null, commentable_type: null },
        '3': { $id: 3, id: 3, body: 'comment2', commentable_id: null, commentable_type: null }
      }
    })

    Repo.create(state, 'comments', data)

    expect(state).toEqual(expected)
  })

  it('generates id or types for the deeply nested morph many relations', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr('null'),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          body: this.attr(''),
          commentable_id: this.attr(null),
          commentable_type: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: User }, { model: Post }, { model: Video }, { model: Comment }])

    const state = createState('entities', {
      users: {},
      posts: {},
      videos: {},
      comments: {}
    })

    const data = {
      id: 1,
      posts: [{
        id: 5,
        user_id: 1,
        comments: [
          { id: 2, body: 'comment1', commentable_id: 1 },
          { id: 3, body: 'comment2', commentable_id: 2 }
        ]
      }]
    }

    const expected = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, posts: [5] }
      },
      posts: {
        '5': { $id: 5, id: 5, user_id: 1, comments: [2, 3] }
      },
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '3': { $id: 3, id: 3, body: 'comment2', commentable_id: 2, commentable_type: 'posts' }
      }
    })

    Repo.create(state, 'users', data)

    expect(state).toEqual(expected)
  })
})
