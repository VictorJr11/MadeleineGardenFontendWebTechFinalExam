import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  Input, 
  Select, 
  Label 
} from '@/components/ui/';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Trash2, 
  Edit, 
  Plus, 
  Filter, 
  RefreshCcw 
} from 'lucide-react';

const API_BASE_URL = '/api/bookings';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    customerName: '',
    status: '',
    startDate: '',
    endDate: '',
    minPrice: '',
    maxPrice: ''
  });

  const [currentBooking, setCurrentBooking] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const applyFilters = async () => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    try {
      const response = await fetch(`/api/bookings/search?${queryParams.toString()}`);
      const filteredBookings = await response.json();
      setBookings(filteredBookings);
    } catch (error) {
      alert(error.message);
    }
  };

  const resetFilters = () => {
    setFilters({
      customerName: '',
      status: '',
      startDate: '',
      endDate: '',
      minPrice: '',
      maxPrice: ''
    });
    fetchBookings();
  };

  const handleAddBooking = async (bookingData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) throw new Error('Failed to create booking');
      
      const newBooking = await response.json();
      setBookings([...bookings, newBooking]);
      setIsAddModalOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdateBooking = async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${bookingData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) throw new Error('Failed to update booking');
      
      const updatedBooking = await response.json();
      setBookings(bookings.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      ));
      setIsEditModalOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${bookingId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete booking');
      
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Booking Management</h1>

      {/* Filter Panel */}
      <Card className="mb-4">
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Input 
              placeholder="Customer Name"
              value={filters.customerName}
              onChange={(e) => setFilters({...filters, customerName: e.target.value})}
            />
            <Select 
              value={filters.status}
              onValueChange={(value) => setFilters({...filters, status: value})}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
            <div className="flex space-x-2">
              <Button onClick={applyFilters} variant="outline">
                <Filter className="mr-2" size={16} /> Apply Filters
              </Button>
              <Button onClick={resetFilters} variant="secondary">
                <RefreshCcw className="mr-2" size={16} /> Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Booking Button */}
      <Button 
        className="mb-4" 
        onClick={() => setIsAddModalOpen(true)}
      >
        <Plus className="mr-2" /> Add Booking
      </Button>

      {/* Bookings Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map(booking => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.firstName} {booking.lastName}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`badge ${
                    booking.status === 'Confirmed' ? 'bg-green-500' :
                    booking.status === 'Pending' ? 'bg-yellow-500' :
                    'bg-red-500'
                  } text-white px-2 py-1 rounded`}>
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setCurrentBooking(booking);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Booking Modal */}
      <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ModalContent>
          <ModalHeader>Add New Booking</ModalHeader>
          {/* Add booking form fields similar to the original HTML form */}
          <ModalFooter>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleAddBooking(/* form data */)}>
              Add Booking
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Booking Modal */}
      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent>
          <ModalHeader>Edit Booking</ModalHeader>
          {/* Edit booking form fields similar to the original HTML form */}
          <ModalFooter>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleUpdateBooking(/* form data */)}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BookingManagement;