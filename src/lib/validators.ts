import { isAddress } from "ethers"
import { z } from "zod"

export const recipientSchema = z.string().refine(
  (value) => {
    return isValidEmail(value) || isValidAddress(value) || isValidENS(value)
  },
  {
    message: "Please enter a valid email, Ethereum address, or ENS name",
  }
)

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidAddress(address: string): boolean {
  return isAddress(address)
}

export function isValidENS(ens: string): boolean {
  const ensRegex = /^[a-zA-Z0-9-]+\.eth$/
  return ensRegex.test(ens)
}

export function getRecipientType(recipient: string): "email" | "address" | "ens" | null {
  if (isValidEmail(recipient)) return "email"
  if (isValidAddress(recipient)) return "address"
  if (isValidENS(recipient)) return "ens"
  return null
}

export async function resolveENS(ens: string): Promise<string | null> {
  try {
    const { JsonRpcProvider } = await import("ethers")
    const provider = new JsonRpcProvider(
      `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`
    )
    const address = await provider.resolveName(ens)
    return address
  } catch (error) {
    console.error("Error resolving ENS:", error)
    return null
  }
}