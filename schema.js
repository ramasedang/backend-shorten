import Joi from 'joi';
import randomstring, { generate } from 'randomstring';

export const userSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required()
})

export const shortenSchema = Joi.object({
    originalurl : Joi.string().required(),
    customurl : Joi.string().optional().default(generate(6))
})

