import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'
import CounterModel from '../models/Counter.js'

const getNextUserId = async () => {
    const counter = await CounterModel.findOneAndUpdate({
        name: 'users'
    }, {
        $inc: {
            count: 1
        }
    }, {
        new: true,
        upsert: true
    });

    return counter.count;
};

export const register = async (req, res) => {
    try {
        const userId = await getNextUserId();
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)


        const doc = new UserModel({
            userId: userId,
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            passwordHash: hash,
        })

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        }, 'secret123', {
            expiresIn: '30d'
        })

        const {
            passwordHash,
            ...userData
        } = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Ошибка регистрации"
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            username: req.body.username
        })

        if (!user) {
            return res.status(404).json({
                message: 'Нет такого полльзователя в базе данных'
            })
        }

        if (!user.is_active) {
            return res.status(403).json({
                message: 'Ваш аккаунт не активен. Обратитесь к администратору.'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин и/или пароль'
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secret123', {
            expiresIn: '30d'
        })

        const {
            passwordHash,
            ...userData
        } = user._doc

        if (user.username === 'admin' && req.body.password === 'admin') {
            userData.isAdmin = true;
        }

        res.json({
            ...userData,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Login error"
        })
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const {
            criteria,
            value,
            sortKey,
            sortOrder
        } = req.query;
        let queryObject = {};

        if (criteria && value) {
            if (criteria === 'id') {
                queryObject = {
                    'userId': value
                };
            } else {
                queryObject = {
                    [criteria]: {
                        $regex: new RegExp(value, 'i')
                    }
                };
            }
        }

        let users;

        if (criteria && value && sortKey && sortOrder) {
            users = await UserModel.find(queryObject, 'username userId firstName lastName is_active updatedAt is_superuser')
                .sort({
                    [sortKey]: sortOrder === 'asc' ? 1 : -1
                });
        } else {
            users = await UserModel.find({}, 'username userId firstName lastName is_active updatedAt is_superuser');
        }

        const formattedUsers = users.map((user) => ({
            id: user.userId,
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
            is_active: user.is_active,
            last_login: user.updatedAt,
            is_superuser: user.is_superuser,
        }));
        res.json(formattedUsers);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Ошибка при получении списка пользователей",
        });
    }
};



export const usersPost = async (req, res) => {
    try {
        const userId = await getNextUserId();
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

         const doc = new UserModel({
             userId: userId,
             username: req.body.username,
             firstName: req.body.firstName,
             lastName: req.body.lastName,
             password: req.body.password,
             passwordHash: hash,
         })

        const user = await doc.save();

           const token = jwt.sign({
               _id: user._id
           }, 'secret123', {
               expiresIn: '30d'
           })

           const {
               passwordHash,
               ...userData
           } = user._doc

           res.json({
               ...userData,
               token
           })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Ошибка POST запроса USERS",
        });
    }
}


export const getOneUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findOne({
            userId
        });
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            });
        }

        const formattedUser = {
            id: user.userId,
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
            is_active: user.is_active,
            last_login: user.updatedAt,
            is_superuser: user.is_superuser,
        };
        res.json(formattedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Ошибка при получении пользователя"
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        const user = await UserModel.findOneAndUpdate({
            userId
        }, updates, {
            new: true
        });

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            });
        }

        const formattedUser = {
            id: user.userId,
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
            is_active: user.is_active,
            last_login: user.updatedAt,
            is_superuser: user.is_superuser,
        };

        res.json(formattedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Ошибка при обновлении пользователя"
        });
    }
}

export const patchUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        if ('password' in updates) {
            const password = updates.password;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            updates.passwordHash = hash;
        }

        const user = await UserModel.findOneAndUpdate({
            userId
        }, updates, {
            new: true
        });

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            });
        }

        const formattedUser = {
            id: user.userId,
            username: user.username,
            passwordHash: user.passwordHash,
            first_name: user.firstName,
            last_name: user.lastName,
            last_login: user.updatedAt,
        };

        res.json(formattedUser);
        console.log(formattedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Ошибка при частичном обновлении пользователя"
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findOneAndRemove({
            userId
        });

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            });
        }

        res.json({
            message: "Пользователь успешно удален"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Ошибка при удалении пользователя"
        });
    }
}