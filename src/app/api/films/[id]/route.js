// app/api/films/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../config/db';
import Film from '../../models/Film';

// GET - Récupérer un film par ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const film = await Film.findById(id);

    if (!film) {
      return NextResponse.json({ success: false, error: 'Film non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      film,
    });
  } catch (error) {
    console.error('Erreur GET /api/films/[id]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT - Modifier un film
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const nouvellesDonnees = await request.json();

    const film = await Film.findByIdAndUpdate(
      id,
      { $set: nouvellesDonnees },
      { new: true, runValidators: true },
    );

    if (!film) {
      return NextResponse.json({ success: false, error: 'Film non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      film,
    });
  } catch (error) {
    console.error('Erreur PUT /api/films/[id]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Supprimer un film
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const film = await Film.findByIdAndDelete(id);

    if (!film) {
      return NextResponse.json({ success: false, error: 'Film non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Erreur DELETE /api/films/[id]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
