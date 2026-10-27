import { NextResponse } from "next/server";
import { createOrder } from "@/lib/server/orders";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createOrder(body);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: "status" in result ? result.status : 400 }
      );
    }

    return NextResponse.json({
      orderNumber: result.orderNumber,
      totalAmount: result.totalAmount,
      items: result.items,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    );
  }
}
