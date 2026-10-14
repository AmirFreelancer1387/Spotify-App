import TryCatch from "./TryCatch.js";
import type { AuthenticatedRequest } from "./middleware.js";
// import type { AuthenticatedRequest } from "./middleware.js";
import { User } from "./model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body

    let createUser = await User.findOne({ email })

    if (createUser) {
        res.status(400).json({ message: 'کاربری با این مشخصات قبلا ثبت نام کرده' })
        return
    }

    const hashPassword = await bcrypt.hash(password, 10)

    createUser = await User.create({
        name, email, password: hashPassword
    })

    const JWT_SEC = process.env.JWT_SEC as string
    const token = jwt.sign({ _id: createUser._id }, JWT_SEC, {
        expiresIn: '7d'
    })

    res.status(201).json({
        message: 'کاربر با موفقیت ثبت نام شد',
        user: {
            id: createUser._id,
            name: createUser.name,
            email: createUser.email,
            role: createUser.role
        },
        token
    })
})

export const loginUsers = TryCatch(async (req, res) => {
    const { name, email, password } = req.body

    let loginUser = await User.findOne({ email })
    if (!loginUser) {
        res.status(400).json({ message: 'کاربری یافت نشد' })
        return
    }

    const isMatch = bcrypt.compare(password, loginUser.password)

    if (!isMatch) {
        res.status(404).json({ message: 'اطلاعات ورود صحیح نمی باشد' })
        return
    }

    const JWT_SEC = process.env.JWT_SEC as string

    const token = jwt.sign({ _id: loginUser._id }, JWT_SEC, {
        expiresIn: '7d'
    })

    res.status(200).json({
        message: 'ورود شما با موفقیت انجام شد',
        user: {
            id: loginUser._id,
            name: loginUser.name,
            email: loginUser.email,
            role: loginUser.role
        },
        token
    })
})

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user

    res.json(user)
})