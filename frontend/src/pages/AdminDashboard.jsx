export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Appointments",
      value: 24,
    },
    {
      title: "Pending Requests",
      value: 7,
    },
    {
      title: "Completed Jobs",
      value: 15,
    },
    {
      title: "Revenue Estimate",
      value: "€3,240",
    },
  ];

  const appointments = [
    {
      id: 1,
      customer: "John Carter",
      service: "Wiring",
      quantity: 10,
      urgency: "Urgent",
      slot: "2026-05-09 15:00",
      status: "Booked",
    },
    {
      id: 2,
      customer: "Emma Wilson",
      service: "Inspection",
      quantity: 1,
      urgency: "Normal",
      slot: "2026-05-10 10:00",
      status: "Pending",
    },
    {
      id: 3,
      customer: "Michael Lee",
      service: "Socket installation",
      quantity: 4,
      urgency: "Urgent",
      slot: "2026-05-11 11:00",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Lutz Electrical Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              Manage appointments, bookings, and customer requests.
            </p>
          </div>

          <button className="bg-yellow-400 hover:bg-yellow-500 transition px-6 py-3 rounded-2xl font-semibold shadow-lg">
            Export Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-md border border-gray-200"
            >
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <h2 className="text-3xl font-bold mt-3 text-gray-900">
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Appointments & Requests
              </h2>
              <p className="text-gray-500 mt-1">
                Recent customer bookings and inquiries.
              </p>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search customer or service"
                className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-64"
              />

              <select className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                <option>All Status</option>
                <option>Booked</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Service
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Urgency
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Appointment Slot
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-5 font-medium text-gray-900">
                      {appointment.customer}
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {appointment.service}
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {appointment.quantity}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.urgency === "Urgent"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {appointment.urgency}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {appointment.slot}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : appointment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <button className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-90 transition">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
