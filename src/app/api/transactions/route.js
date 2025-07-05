import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('personal_finance');
  const txns = await db
    .collection('transactions')
    .find()
    .sort({ date: -1 })
    .toArray();
  return NextResponse.json(txns);
}

export async function POST(req) {
  const { amount, description, date, category } = await req.json();
  if (!amount || !description || !date || !category) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db('personal_finance');
  const res = await db.collection('transactions').insertOne({
    amount,
    description,
    date: new Date(date),
    category,
  });
  const newTxn = await db
    .collection('transactions')
    .findOne({ _id: res.insertedId });
  return NextResponse.json(newTxn);
}