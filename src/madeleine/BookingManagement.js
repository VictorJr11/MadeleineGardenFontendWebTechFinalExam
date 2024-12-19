import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Select,
  MenuItem
} from '@mui/material';

const BookingManagement = () => {
  // State management
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState({
    id: null,
    customerName: '',
    status: '',
    startDate: '',
    endDate: '',
    price: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    customerName: '',
    status: '',
    startDate: '',
    endDate: '',
    minPrice: null,
    maxPrice: null
  });

  // API Base URL (adjust as needed)
  const API_BASE_URL = '/api/bookings';

  // Fetch All Bookings
  const fetchBookings = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to fetch bookings');
    }
  };

  // Create Booking
  const createBooking = async (bookingData) => {
    try {
      const response = await axios.post(API_BASE_URL, bookingData);
      setBookings([...bookings, response.data]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    }
  };

  // Get Booking by ID
  const getBookingById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      setCurrentBooking(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching booking:', error);
      alert('Failed to fetch booking details');
    }
  };

  // Update Booking
  const updateBooking = async (id, bookingData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, bookingData);
      setBookings(bookings.map(booking => 
        booking.id === id ? response.data : booking
      ));
      handleCloseModal();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking');
    }
  };

  // Update Booking Status
  const updateBookingStatus = async (id, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/status`, { status });
      setBookings(bookings.map(booking => 
        booking.id === id ? response.data : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  // Delete Booking
  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setBookings(bookings.filter(booking => booking.id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
  };

  // Search Bookings
  const searchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, { 
        params: searchCriteria 
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error searching bookings:', error);
      alert('Failed to search bookings');
    }
  };

  // Modal Handlers
  const handleOpenModal = (booking = null) => {
    if (booking) {
      setCurrentBooking(booking);
    } else {
      setCurrentBooking({
        id: null,
        customerName: '',
        status: '',
        startDate: '',
        endDate: '',
        price: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBooking({
      id: null,
      customerName: '',
      status: '',
      startDate: '',
      endDate: '',
      price: 0
    });
  };

  // Effect to fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Card className="p-4">
      <CardHeader 
        title="Booking Management" 
        action={
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpenModal()}
          >
            Create New Booking
          </Button>
        } 
      />
      
      <CardContent>
        {/* Search Section */}
        <div className="mb-4 flex space-x-2">
          <TextField
            label="Customer Name"
            value={searchCriteria.customerName}
            onChange={(e) => setSearchCriteria({
              ...searchCriteria, 
              customerName: e.target.value
            })}
          />
          <Select
            value={searchCriteria.status}
            onChange={(e) => setSearchCriteria({
              ...searchCriteria, 
              status: e.target.value
            })}
            label="Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={searchBookings}
          >
            Search
          </Button>
        </div>

        {/* Booking List */}
        {bookings.map(booking => (
          <Card key={booking.id} className="mb-2">
            <CardContent className="flex justify-between items-center">
              <div>
                <p>ID: {booking.id}</p>
                <p>Customer: {booking.customerName}</p>
                <p>Status: {booking.status}</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => getBookingById(booking.id)}
                >
                  View
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={() => deleteBooking(booking.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Booking Modal */}
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>
            {currentBooking.id ? 'Edit Booking' : 'Create Booking'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Customer Name"
              fullWidth
              value={currentBooking.customerName}
              onChange={(e) => setCurrentBooking({
                ...currentBooking, 
                customerName: e.target.value
              })}
            />
            <Select
              label="Status"
              fullWidth
              value={currentBooking.status}
              onChange={(e) => setCurrentBooking({
                ...currentBooking, 
                status: e.target.value
              })}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={currentBooking.startDate}
              onChange={(e) => setCurrentBooking({
                ...currentBooking, 
                startDate: e.target.value
              })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={currentBooking.endDate}
              onChange={(e) => setCurrentBooking({
                ...currentBooking, 
                endDate: e.target.value
              })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={currentBooking.price}
              onChange={(e) => setCurrentBooking({
                ...currentBooking, 
                price: parseFloat(e.target.value)
              })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button 
              color="primary" 
              onClick={() => currentBooking.id 
                ? updateBooking(currentBooking.id, currentBooking)
                : createBooking(currentBooking)
              }
            >
              {currentBooking.id ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BookingManagement;