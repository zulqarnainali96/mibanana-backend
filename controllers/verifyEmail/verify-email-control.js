// const User = require('../../models/UsersLogin')
// const Token = require('../../models/email-verification/emailVerify')

// const verifyToken = async (req, res) => {
//     try {
//         const user = await User.findOne({ _id: req.params.id }).exec()
//         if (!user) return res.status(400).send({ message: "Invalid Link" })

//         const token = await Token.findOne({ userId: user._id, token: req.params.token }).exec()
//         if (!token) return res.status(400).send({ message: "Invalid Link" })

//         const save = await User.findOne({ _id: user._id })
//         await save.save({ verified: true })
//         await token.remove()
//         res.status(200).send({ message: "Email Verified Successfully" })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({ message: "Internal Server Error" })
//     }
// }

// module.exports = verifyToken
const User = require('../../models/UsersLogin');
const Token = require('../../models/email-verification/emailVerify');

const verifyToken = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).exec();
        if (!user) return res.status(400).send({ message: "Invalid Link" });

        const token = await Token.findOne({ userId: user._id, token: req.params.token });
        if (!token) return res.status(400).send({ message: "Invalid Link" });

        // Update the user's 'verified' field to true
        await User.findByIdAndUpdate(user._id, { verified: true });

        // Remove the token document
        await Token.findByIdAndRemove(token._id);

        res.status(200).send({ message: "Email Verified Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = verifyToken;
