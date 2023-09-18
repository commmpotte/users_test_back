import {
    body
} from 'express-validator'

export const loginValidation = [
    body('email', 'Invalid mail form').isEmail(),
    body('password', 'Password must be more than 5 symbols').isLength({
        min: 5
    })
]

export const registerValidation = [
    body('email', 'Invalid mail form').isEmail(),
    body('password', 'Password must be more than 5 symbols').isLength({
        min: 5
    }),
    body('fullName', 'Name must be more than 3 symbols').isLength({
        min: 3
    }),
    body('avatarUrl', 'Wrong avatar link').optional().isURL()
]

export const postCreateValidation = [
    body('title', 'Put your title here').isLength({
        min: 5
    }).isString(),
    body('text', 'Put some text here').isLength({
        min: 5
    }).isString(),
    body('tags', 'Wrong tags format, leave a massive').optional().isString(),
    body('imageUrl', 'Wrong image link').optional().isString()
]