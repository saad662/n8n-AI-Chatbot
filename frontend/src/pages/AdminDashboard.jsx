import React from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = React.useState([
    {
      title: 'Total Leads',
      value: 0,
      change: '+0%',
    },
    {
      title: 'Booked Appointments',
      value: 0,
      change: '+0%',
    },
    {
      title: 'Urgent Requests',
      value: 0,
      change: '+0%',
    },
    {
      title: 'Revenue Estimate',
      value: '€0',
      change: '+0%',
    },
  ]);

  React.useEffect(() => {
    const savedLeads = JSON.parse(localStorage.getItem('lutz_leads') || '[]');

    const booked = savedLeads.filter(
      (lead) => lead.status === 'Booked'
    ).length;

    const urgent = savedLeads.filter(
      (lead) => lead.urgency === 'urgent'
    ).length;

    const revenue = savedLeads.reduce((acc, lead) => {
      return acc + Number(lead.price || 0);
    }, 0);

    setStats([
      {
        title: 'Total Leads',
        value: savedLeads.length,
        change: '+12%',
      },
      {
        title: 'Booked Appointments',
        value: booked,
        change: '+8%',
      },
      {
        title: 'Urgent Requests',
        value: urgent,
        change: '+4%',
      },
      {
        title: 'Revenue Estimate',
        value: `€${revenue}`,
        change: '+18%',
      },
    ]);
  }, []);

  const [leads, setLeads] = React.useState([]);

  React.useEffect(() => {
    const savedLeads = JSON.parse(localStorage.getItem('lutz_leads') || '[]');
    setLeads(savedLeads.reverse());
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Booked':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'Urgent':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-sm text-yellow-500 font-semibold uppercase tracking-wide">
              Lutz Electrical CRM
            </p>

            <h1 className="text-4xl font-bold text-gray-900 mt-2">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-3 max-w-2xl">
              Manage customer leads, electrical service bookings, pricing requests,
              urgent repairs, and Google Calendar appointments in one place.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-black text-white px-5 py-3 rounded-2xl font-semibold hover:opacity-90 transition">
              Sync Calendar
            </button>

            <button className="bg-yellow-400 px-5 py-3 rounded-2xl font-semibold hover:bg-yellow-500 transition">
              Export Leads
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm font-medium">
                  {stat.title}
                </p>

                <span className="text-green-600 text-xs font-semibold bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mt-4">
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Leads & Bookings
                </h2>

                <p className="text-gray-500 mt-1">
                  Live customer requests collected from the AI chatbot.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search customer, service, email"
                  className="px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full sm:w-72"
                />

                <select className="px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400">
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
                      Contact
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Service
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Price
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Urgency
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Appointment
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {lead.customerName}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            Qty: {lead.quantity}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm text-gray-900">
                            {lead.phone}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {lead.email}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-900">
                        {lead.service}
                      </td>

                      <td className="px-6 py-5 font-semibold text-gray-900">
                        {lead.price}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyStyle(
                            lead.urgency
                          )}`}
                        >
                          {lead.urgency}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-700">
                        {lead.slot}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                AI Chatbot Status
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">AI Assistant</span>
                  <span className="text-green-600 font-semibold">
                    Online
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Google Calendar</span>
                  <span className="text-green-600 font-semibold">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">n8n Workflow</span>
                  <span className="text-green-600 font-semibold">
                    Running
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">New Leads Today</span>
                  <span className="font-bold text-gray-900">14</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Activity
              </h2>

              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2" />

                  <div>
                    <p className="font-medium text-gray-900">
                      Appointment booked
                    </p>
                    <p className="text-sm text-gray-500">
                      Wiring service for Saad Amin.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2" />

                  <div>
                    <p className="font-medium text-gray-900">
                      Urgent repair request
                    </p>
                    <p className="text-sm text-gray-500">
                      Emergency inspection submitted.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2" />

                  <div>
                    <p className="font-medium text-gray-900">
                      Calendar synchronized
                    </p>
                    <p className="text-sm text-gray-500">
                      Google Calendar updated successfully.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
