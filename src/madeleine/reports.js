import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Spinner } from 'lucide-react';

const BookingReports = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    bookingType: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookingsData, filters]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookingsData(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Error loading bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let tempBookings = [...bookingsData];

    if (filters.startDate) {
      tempBookings = tempBookings.filter(booking =>
        new Date(booking.checkInDate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      tempBookings = tempBookings.filter(booking =>
        new Date(booking.checkOutDate) <= new Date(filters.endDate)
      );
    }

    if (filters.status) {
      tempBookings = tempBookings.filter(
        booking => booking.status === filters.status
      );
    }

    if (filters.bookingType) {
      tempBookings = tempBookings.filter(
        booking => booking.bookingType === filters.bookingType
      );
    }

    setFilteredBookings(tempBookings);
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [id]: value
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const downloadBookingReport = () => {
    setLoading(true);
    const doc = new jsPDF('l', 'pt');

    // Header
    doc.setFontSize(22);
    doc.text('Booking Report', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

    // Generation Date
    doc.setFontSize(10);
    const currentDate = new Date().toLocaleString();
    doc.text(`Generated on: ${currentDate}`, doc.internal.pageSize.getWidth() - 40, 20, { align: 'right' });

    // Filters Info
    let filterText = 'Filters: ';
    if (filters.startDate) filterText += `Check-in Date: ${filters.startDate} `;
    if (filters.endDate) filterText += `Check-out Date: ${filters.endDate} `;
    if (filters.status) filterText += `Status: ${filters.status} `;
    if (filters.bookingType) filterText += `Type: ${filters.bookingType}`;

    if (filterText !== 'Filters: ') {
      doc.text(filterText, 40, 60);
    }

    // Prepare table data
    const tableData = filteredBookings.map(booking => [
      booking.id,
      `${booking.firstName} ${booking.lastName}`,
      `${booking.email}\n${booking.phone}`,
      `${booking.city}, ${booking.country}\n${booking.address}`,
      `${new Date(booking.checkInDate).toLocaleDateString()}\n${booking.arrival}`,
      new Date(booking.checkOutDate).toLocaleDateString(),
      booking.bookingType,
      booking.status,
      `$${booking.totalPrice.toFixed(2)}`
    ]);

    // Generate table
    doc.autoTable({
      head: [['ID', 'Name', 'Contact', 'Location', 'Check-in', 'Check-out', 'Type', 'Status', 'Price']],
      body: tableData,
      startY: 80,
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 80 }
    });

    // Summary statistics page
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Summary Statistics', 40, 40);

    const totalBookings = tableData.length;
    const totalRevenue = tableData.reduce((sum, row) => {
      const price = parseFloat(row[8].replace('$', ''));
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    const statusCounts = filteredBookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});

    const typeCounts = filteredBookings.reduce((acc, booking) => {
      acc[booking.bookingType] = (acc[booking.bookingType] || 0) + 1;
      return acc;
    }, {});

    doc.setFontSize(12);
    doc.text([
      `Total Bookings: ${totalBookings}`,
      `Total Revenue: $${totalRevenue.toFixed(2)}`,
      `Average Revenue per Booking: $${(totalRevenue / totalBookings).toFixed(2)}`
    ], 40, 70);

    // Status and Type breakdowns
    let yPos = 120;
    doc.text('Status Breakdown:', 40, yPos);
    yPos += 20;
    Object.entries(statusCounts).forEach(([status, count]) => {
      const percentage = ((count / totalBookings) * 100).toFixed(1);
      doc.text(`${status}: ${count} (${percentage}%)`, 60, yPos);
      yPos += 20;
    });

    yPos += 10;
    doc.text('Booking Type Breakdown:', 40, yPos);
    yPos += 20;
    Object.entries(typeCounts).forEach(([type, count]) => {
      const percentage = ((count / totalBookings) * 100).toFixed(1);
      doc.text(`${type}: ${count} (${percentage}%)`, 60, yPos);
      yPos += 20;
    });

    // Save PDF
    try {
      doc.save('booking-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex items-center">
            <Spinner className="animate-spin mr-3 text-blue-500" />
            <span>Generating Report...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Booking Reports</h1>
        <p className="text-gray-600 mt-2">Generate and download detailed booking reports in PDF format</p>
      </div>

      {/* Report Options */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Report Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Date Range</label>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm text-gray-600">Check-in Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Check-out Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Status Filter</label>
            <select
              id="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Booking Type</label>
            <select
              id="bookingType"
              value={filters.bookingType}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            >
              <option value="">All Types</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Deluxe">Deluxe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bookings Preview</h2>
          <button
            onClick={downloadBookingReport}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
          >
            Download Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{booking.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.firstName} {booking.lastName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.email}<br />{booking.phone}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.city}, {booking.country}<br />
                    <span className="text-xs text-gray-500">{booking.address}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(booking.checkInDate).toLocaleDateString()}<br />
                    <span className="text-xs text-gray-500">{booking.arrival}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.bookingType}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${booking.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingReports;