import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "..";

const signupDetails = Router();

signupDetails.post("/", async (req, res) => {
  try {
    const { password, email} = req.body;
    // Check if email already exists
    const existEmail = await prisma.user.findUnique({ where: { email } });

    if (existEmail) {
      return res.status(400).json({ error: "Please use a unique email" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        const response = await prisma.user.create({
          data: {
            password: hashedPassword,
            email
          },
        });

        return res
          .status(200)
          .json({ msg: `Welcome ${email} to Tablesprint!` });
      } catch (error) {
        return res.status(500).json({ status: false, error });
      }
    } else {
      return res.status(400).json({ error: "Password is required" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default signupDetails;
