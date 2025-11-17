import { NextResponse } from 'next/server';
import { connectDB } from '../../../config/db';
import User from '../../../models/user.model';
import bcryptjs from 'bcryptjs';

// GET - Récupérer un utilisateur par ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const user = await User.findById(id).select('-password').lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Erreur GET /api/admin/users/[id]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH - Modifier un utilisateur
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const nouvellesDonnees = await request.json();

    if (nouvellesDonnees.password) {
      nouvellesDonnees.password = await bcryptjs.hash(nouvellesDonnees.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: nouvellesDonnees },
      { new: true, runValidators: true },
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Erreur PATCH /api/admin/users/[id]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Erreur DELETE /api/admin/users/[id]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
