import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Table, 
  Modal, 
  Form, 
  InputGroup,
  Pagination 
} from 'react-bootstrap';
import { Pencil, Trash, Search } from 'lucide-react';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Create Admin State
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  });

  // Update Admin State
  const [updateAdmin, setUpdateAdmin] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAdminId, setDeleteAdminId] = useState(null);

  // Error Handling Function
  const handleApiError = async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || 'An error occurred');
    }
    return response.json();
  };

  // Fetch Admins
  const fetchAdmins = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8083/api/admins?page=${currentPage}&size=${pageSize}`);
      const data = await handleApiError(response);
      setAdmins(data.content || data);
      setTotalPages(data.totalPages || Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error('Error fetching admins:', error);
      alert(error.message);
    }
  }, [currentPage, pageSize]);
  
  const searchAdmins = useCallback(async () => {
    if (!searchTerm) {
      fetchAdmins();
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8083/api/admins/search?email=${encodeURIComponent(searchTerm)}&name=${encodeURIComponent(searchTerm)}&page=${currentPage}&size=${pageSize}`
      );
      const data = await handleApiError(response);
      setAdmins(data.content || data);
      setTotalPages(data.totalPages || Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error('Error searching admins:', error);
      alert(error.message);
    }
  }, [searchTerm, currentPage, pageSize, fetchAdmins]);

  // Debounced Search
  const debouncedSearch = useCallback(() => {
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func(...args);
        }, delay);
      };
    };

    return debounce(searchAdmins, 300);
  }, [searchAdmins]);

  // Create Admin
  const createAdmin = async () => {
    try {
      const response = await fetch('http://localhost:8083/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAdmin)
      });
      await handleApiError(response);
      fetchAdmins();
      setShowCreateModal(false);
      setNewAdmin({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: ''
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      alert(error.message);
    }
  };

  // Open Update Modal
  const openUpdateModal = async (id) => {
    try {
      const response = await fetch(`http://localhost:8083/api/admins/${id}`);
      const admin = await handleApiError(response);
      setUpdateAdmin(admin);
      setShowUpdateModal(true);
    } catch (error) {
      console.error('Error fetching admin details:', error);
      alert(error.message);
    }
  };

  // Update Admin
  const updateAdminHandler = async () => {
    try {
      const response = await fetch(`http://localhost:8083/api/admins/${updateAdmin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: updateAdmin.firstName,
          lastName: updateAdmin.lastName,
          email: updateAdmin.email,
          role: updateAdmin.role
        })
      });
      await handleApiError(response);
      fetchAdmins();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating admin:', error);
      alert(error.message);
    }
  };

  // Delete Admin
  const deleteAdmin = async () => {
    try {
      const response = await fetch(`http://localhost:8083/api/admins/${deleteAdminId}`, {
        method: 'DELETE'
      });
      await handleApiError(response);
      fetchAdmins();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert(error.message);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Trigger search on term or page change
  useEffect(() => {
    const performSearch = debouncedSearch();
    performSearch();
  }, [searchTerm, currentPage, pageSize, debouncedSearch]);

  // Pagination Change Handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1);
  };









  return (
    <Container className="mt-5">
      <h1 className="mb-4">Admin Management</h1>
      
      <Button 
        variant="primary" 
        className="mb-3" 
        onClick={() => setShowCreateModal(true)}
      >
        Add New Admin
      </Button>

      <Row className="mb-4">
        <Col className="d-flex justify-content-end">
          <InputGroup style={{maxWidth: '500px'}}>
            <Form.Control 
              type="text" 
              placeholder="Search by name ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Form.Control 
              type="number" 
              value={pageSize} 
              onChange={(e) => setPageSize(Number(e.target.value))}
              min="1" 
              max="100" 
              style={{maxWidth: '100px'}}
            />
            <Button variant="primary" onClick={searchAdmins}>
              <Search size={18} />
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Table striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No results found</td>
            </tr>
          ) : (
            admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.firstName}</td>
                <td>{admin.lastName}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => openUpdateModal(admin.id)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => {
                      setDeleteAdminId(admin.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item 
              key={index} 
              active={index === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>

      {/* Create Admin Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control 
                type="text"
                value={newAdmin.firstName}
                onChange={(e) => setNewAdmin({...newAdmin, firstName: e.target.value})}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control 
                type="text"
                value={newAdmin.lastName}
                onChange={(e) => setNewAdmin({...newAdmin, lastName: e.target.value})}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control 
                type="text"
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                required 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={createAdmin}>
            Create Admin
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Admin Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control 
                type="text"
                value={updateAdmin.firstName}
                onChange={(e) => setUpdateAdmin({...updateAdmin, firstName: e.target.value})}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control 
                type="text"
                value={updateAdmin.lastName}
                onChange={(e) => setUpdateAdmin({...updateAdmin, lastName: e.target.value})}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email"
                value={updateAdmin.email}
                onChange={(e) => setUpdateAdmin({...updateAdmin, email: e.target.value})}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control 
                type="text"
                value={updateAdmin.role}
                onChange={(e) => setUpdateAdmin({...updateAdmin, role: e.target.value})}
                required 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={updateAdminHandler}>
            Update Admin
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Admin Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this admin?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteAdmin}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminManagement;