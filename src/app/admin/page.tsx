import { getMintsByEvent } from "@/lib/redis"

export default async function AdminPage() {
  const eventId = process.env.POAP_EVENT_ID!
  const mints = await getMintsByEvent(eventId)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minted POAPs</h1>
          <p className="mt-2 text-gray-600">
            Event ID: {eventId} • Total mints: {mints.length}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {mints.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No POAPs have been minted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Twitter User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Minted At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mints.map((mint, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {mint.twitterName}
                        <span className="block text-xs text-gray-500">
                          ID: {mint.twitterId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {mint.recipientType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-mono text-xs">
                          {mint.recipient}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(mint.mintedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            ← Back to mint page
          </a>
        </div>
      </div>
    </div>
  )
}