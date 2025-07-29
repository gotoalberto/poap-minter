import { resolveENS } from "./validators"

const POAP_API_BASE = "https://api.poap.tech"

interface POAPAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface POAPMintResponse {
  success: boolean
  token_id?: string
  error?: string
}

export async function getPOAPAccessToken(): Promise<string> {
  const response = await fetch(`${POAP_API_BASE}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.POAP_CLIENT_ID,
      client_secret: process.env.POAP_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to get POAP access token")
  }

  const data: POAPAuthResponse = await response.json()
  return data.access_token
}

export async function mintPOAP(
  recipient: string,
  recipientType: "email" | "address" | "ens"
): Promise<POAPMintResponse> {
  try {
    const accessToken = await getPOAPAccessToken()
    
    let address = recipient
    if (recipientType === "ens") {
      const resolved = await resolveENS(recipient)
      if (!resolved) {
        return { success: false, error: "Failed to resolve ENS name" }
      }
      address = resolved
    }

    const mintData = {
      event_id: parseInt(process.env.POAP_EVENT_ID!),
      secret_code: process.env.POAP_SECRET_CODE!,
      address: recipientType === "email" ? undefined : address,
      email: recipientType === "email" ? recipient : undefined,
    }

    const response = await fetch(`${POAP_API_BASE}/actions/claim-qr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "X-API-Key": process.env.POAP_API_KEY!,
      },
      body: JSON.stringify(mintData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { 
        success: false, 
        error: errorData.message || "Failed to mint POAP" 
      }
    }

    const data = await response.json()
    return { 
      success: true, 
      token_id: data.queue_uid || data.token_id 
    }
  } catch (error) {
    console.error("Error minting POAP:", error)
    return { 
      success: false, 
      error: "An error occurred while minting POAP" 
    }
  }
}