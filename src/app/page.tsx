"use client"

import { useSession, signIn } from "next-auth/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { recipientSchema, getRecipientType } from "@/lib/validators"

const formSchema = z.object({
  recipient: recipientSchema,
})

export default function Home() {
  const { data: session, status } = useSession()
  const [isMinting, setIsMinting] = useState(false)
  const [mintResult, setMintResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!session) return

    setIsMinting(true)
    setMintResult(null)

    try {
      const recipientType = getRecipientType(data.recipient)
      
      const response = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: data.recipient,
          recipientType,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMintResult({
          success: true,
          message: "POAP minted successfully! 🎉",
        })
      } else {
        setMintResult({
          success: false,
          message: result.error || "Failed to mint POAP",
        })
      }
    } catch (error) {
      setMintResult({
        success: false,
        message: "An error occurred while minting",
      })
    } finally {
      setIsMinting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              POAP Minter
            </h1>
            <p className="text-gray-600 mb-8">
              Sign in with X to mint your POAP
            </p>
            <button
              onClick={() => signIn("twitter")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Mint with X
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {session.user.name}!
          </h1>
          <p className="text-gray-600">
            @{session.user.username}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="recipient"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Where should we send your POAP?
              </label>
              <input
                {...register("recipient")}
                id="recipient"
                type="text"
                placeholder="ENS name, Ethereum address, or email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isMinting}
              />
              {errors.recipient && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.recipient.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isMinting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isMinting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Minting...
                </>
              ) : (
                "Mint POAP"
              )}
            </button>
          </form>

          {mintResult && (
            <div
              className={`mt-6 p-4 rounded-md ${
                mintResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <p
                className={`text-sm ${
                  mintResult.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {mintResult.message}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/admin"
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            View minted POAPs →
          </a>
        </div>
      </div>
    </div>
  )
}
