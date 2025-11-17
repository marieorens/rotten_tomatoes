import { NextResponse } from 'next/server';
import dbConnect from '../../models/dbConnect';
import User from '../../models/user.model';
import { setCookie } from '../../utils/setCookies';

export async function POST(req) {
  const { email, name, avatar, provider } = await req.json();
  await dbConnect();
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      username: name,
      email,
      avatar,
      provider,
      role: 'user',
    });
  } else {
    user.username = name;
    user.avatar = avatar;
    user.provider = provider;
    await user.save();
  }
  await setCookie(user._id, user.role);
  return NextResponse.json({ message: 'Utilisateur de google envoyé dans notre db', user });
}
