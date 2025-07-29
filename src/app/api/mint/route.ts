import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { mintPOAP } from "@/lib/poap"
import { saveMintRecord, hasMinted } from "@/lib/redis"
import { getRecipientType } from "@/lib/validators"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { recipient, recipientType } = body

    if (!recipient || !recipientType) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      )
    }

    // Check if user already minted
    const eventId = process.env.POAP_EVENT_ID!
    const alreadyMinted = await hasMinted(session.user.id, eventId)
    
    if (alreadyMinted) {
      return NextResponse.json(
        { success: false, error: "You have already minted this POAP" },
        { status: 400 }
      )
    }

    // Mint the POAP
    const mintResult = await mintPOAP(recipient, recipientType)

    if (!mintResult.success) {
      return NextResponse.json(
        { success: false, error: mintResult.error },
        { status: 400 }
      )
    }

    // Save mint record
    await saveMintRecord({
      twitterId: session.user.id,
      twitterName: session.user.username || session.user.name || "Unknown",
      recipientType,
      recipient,
      eventId,
      tokenId: mintResult.token_id,
      mintedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      tokenId: mintResult.token_id,
    })
  } catch (error) {
    console.error("Error in mint API:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}