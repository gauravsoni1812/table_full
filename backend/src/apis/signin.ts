import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { prisma } from "..";
import { User } from "../types/user";


const signinDetails = Router();

signinDetails.post("/", async (req, res) => {
    const { email, password }: { email: string; password: string } = req.body;

  try {
    const user = await prisma.user.findUnique({ where :{email} }) as User | null; // Handle the case where the user may be null
    
    if (!user) {
      return res.status(404).send({ error: "Email not found" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(401).send({ error: "Password does not match" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        Id: user.Id,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: "24h" }
    );

    return res.status(200).send({
      msg: "Login Successful",
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

export default signinDetails;
