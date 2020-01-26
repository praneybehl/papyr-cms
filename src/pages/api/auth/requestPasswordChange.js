import jwt from 'jsonwebtoken'
import connect from "next-connect"
import common from "../../../middleware/common/"
import keys from '../../../config/keys'
import User from "../../../models/user"


const handler = connect()
handler.use(common)


handler.post(async (req, res) => {
  const { token, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    return res.status(401).send({ message: 'The new password fields do not match.' })
  }

  const data = jwt.verify(token, keys.jwtSecret)
  const foundUser = await User.findOne({ email: data.email })

  // Set the new password
  foundUser.setPassword(password, async () => {
    await foundUser.save()
    return res.send({ message: 'Your password has been saved!' })
  })
})


export default handler
