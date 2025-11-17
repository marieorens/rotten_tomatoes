import axios from "axios";
import { getAuth } from "firebase/auth";
import "@/firebase/firebase"; 

export async function fetchUser() {
  try {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;
    let config = {};
    if (firebaseUser) {
      const token = await firebaseUser.getIdToken();
      config.headers = { Authorization: `Bearer ${token}` };
    }
    const response = await axios.get("/api/fetch-user", config);
    return response.data.user;
  } catch (err) {
    return null;
  }
}
