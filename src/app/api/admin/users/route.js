import { NextResponse } from 'next/server';
import { connectDB } from '../../config/db';
import User from '../../models/user.model';
import bcryptjs from 'bcryptjs';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments({});

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur GET /api/admin/users:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const userData = await request.json();
    const { username, email, password, role = 'user' } = userData;

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont requis' },
        { status: 400 },
      );
    }

    const userEmailExists = await User.findOne({ email });
    if (userEmailExists) {
      return NextResponse.json(
        { success: false, error: 'Cet email est déjà utilisé' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        success: true,
        user: userResponse,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Erreur POST /api/admin/users:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
