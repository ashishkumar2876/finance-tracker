import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function PUT(req, context) {
  const { params } = context;
  const { id } = await params;

  const { amount, description, date, category } = await req.json();
  if (!amount || !description || !date || !category) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('personal_finance');
  await db.collection('transactions').updateOne(
    { _id: new ObjectId(id) },
    { $set: { amount, description, date: new Date(date), category } }
  );

  const updated = await db
    .collection('transactions')
    .findOne({ _id: new ObjectId(id) });

  return NextResponse.json(updated);
}

export async function DELETE(req, context) {
  const { params } = context;
  const { id } = await params;

  const client = await clientPromise;
  const db = client.db('personal_finance');
  await db.collection('transactions').deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ success: true });
}
