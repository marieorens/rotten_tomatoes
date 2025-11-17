import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";
import User from "../models/user.model.js";
import axios from "axios";

export async function GET(request) {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const firebaseToken = request.headers.get("authorization")?.replace("Bearer ", "");

  if (firebaseToken) {
    try {
      const verifyRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/firebase-verify`,
        { token: firebaseToken }
      );
      if (verifyRes.data.user) {
        // Cherche l'utilisateur dans MongoDB par email
        const user = await User.findOne({ email: verifyRes.data.user.email }).select("-password");
        if (!user) {
          return Response.json(
            { message: "Utilisateur inscrit aec google non trouvé." },
            { status: 400 },
          );
        }
        return Response.json({ user }, { status: 200 });
      } else {
        return Response.json({ message: "Non authorizé." }, { status: 401 });
      }
    } catch (error) {
      return Response.json({ message: "token Firebase invalide." }, { status: 401 });
    }
  }

  if (!token) {
    return Response.json({ message: "Non authorizé." }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (!decoded) {
      return Response.json(
        { message: "Non autorisé, token invalide" },
        { status: 401 },
      );
    }
    const userId = decoded.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return Response.json(
        { message: "Utilisateur non trouvé." },
        { status: 400 },
      );
    }
    return Response.json({ user }, { status: 200 });
  } catch (error) {
    console.log("Erreur lors de la recup de l'utilisateur", error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
