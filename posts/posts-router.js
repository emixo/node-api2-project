const express = require('express')

const Posts = require('../data/db')

const router = express.Router()


//GET REQUESTS
router.get('/', (req, res) => {
    Posts.find()
    .then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({message: 'This post does not exist'})
        }
    })
    .catch(err => {
        res.status(500).json({error: "This post could not be recieved"})
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id

    Posts.findById(id)
    .then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({error: 'This post does not exist'})
        }
    })
    .catch(err => {
        res.status(500).json({error: 'This post could not be recieved'})
    })
})

router.get('/:id/comments', (req, res) => {
    const id = req.params.id
    Posts.findCommentById(id)
        .then(comment => {
            if (comment) {
                res.status(200).json(comment)
            } else {
                res.status(404).json({error: 'This comment doest not exist'})
            }
        })
        .catch(err => {
            res.status(500).json({error: 'This comment could not be recieved'})
        })
})

// DELETE REQUESTS

router.delete('/:id', (req, res) => {
    const id = req.params.id
    Posts.findById(id)
    .then(post => {
        if (post.length === 0) {
            res.status(404).json({message: "This post does not exist"})
        } else {
            Posts.remove(id)
            .then( () => {
                res.status(200).json(post)
            })
            .catch(err => {
                res.status(500).json({error: 'There was an error removing this post'})
            })
        }
    })
})


//POST REQUESTS

router.post('/', (req , res) => {
    const {title, contents} = req.body

    if (!title || !contents) {
        res.status(400).json({errorMessage: 'Please add a title and content for this post'})
    } else {
        Posts.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.stauts(500).json({error: 'There was an error posting this to the database'})
        })
    }
})

router.post('/:id/comments', (req, res) => {
    const {id} = req.params
    const comment = {...req.body, post_id: id}
    Posts.findById(id)
    .then(post => {
        if (post.length) {
            if(comment.text) {
                Posts.insertComment(comment)
                .then(newComment => {
                    res.status(201).json(newComment)
                })
                .catch(err => {
                    res.status(500).json({error: 'There was an error posting to the database'})
                })
            } else {
                res.status(404).json({message: 'No comment'})
            }
        } else {
            res.status(404).json({message: 'No id'})
        }
    })
    .catch(err => {
        res.status(500).json({error: 'There was was an error posting to the database'})
    })
})


// PUT REQUESTS

router.put('/:id,', (req, res) => {
    const change = req.body
    Posts.update(req.params.id, changes)
    .then (post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({message: 'This post does not exist'})
        }
    })
    .catch(err => {
        res.status(500).json({error: 'This post could not be changed'})
    })
})

module.exports = router