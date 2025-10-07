  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { Container, Card, Button, Form } from "react-bootstrap";
  import { motion } from "framer-motion";
  import { useAuth } from "../auth/AuthContext";
  import { API_BASE_URL } from "../config";

  const OrganizerDashboard = () => {
    const { user } = useAuth();
    const [packages, setPackages] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [newPackage, setNewPackage] = useState({ title: "", price: "", description: "" });
    const [packageFile, setPackageFile] = useState(null);

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
    const MotionRow = motion.div;
    const MotionCol = motion.div;

    // Auto-resize textarea
    const handleTextareaChange = (e, setter, field) => {
      setter(prev => ({ ...prev, [field]: e.target.value }));
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const getImageUrl = (imagePath) => {
      if (!imagePath) return null;
      return `${API_BASE_URL}${imagePath.startsWith("/") ? imagePath : "/" + imagePath}`;
    };

    // Fetch packages and bookings
    useEffect(() => {
      if (!user?.id) return;

      const fetchData = async () => {
        try {
          const [packRes, bookingRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/packages?organizerId=${user.id}`),
            axios.get(`${API_BASE_URL}/api/bookings/organizer/${user.id}`)
          ]);

          setPackages(packRes.data || []);
          setBookings(bookingRes.data || []);
        } catch (err) {
          console.error("Error fetching data:", err);
          alert("Failed to fetch organizer data");
        }
      };

      fetchData();
    }, [user?.id]);

    // Add Package
    const handleAddPackage = async (e) => {
      e.preventDefault();
      if (!user) return;

      try {
        const formData = new FormData();
        formData.append("name", newPackage.title);
        formData.append("price", newPackage.price);
        formData.append("description", newPackage.description);
        formData.append("userId", user.id);
        if (packageFile) formData.append("image", packageFile);

        const res = await axios.post(`${API_BASE_URL}/api/packages`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        setPackages(prev => [...prev, res.data]);
        setNewPackage({ title: "", price: "", description: "" });
        setPackageFile(null);
        alert("Package added successfully!");
      } catch (err) {
        console.error("Error adding package:", err);
        alert("Error adding package: " + (err.response?.data || err.message));
      }
    };

    // Delete Package
    const handleDeletePackage = async (id) => {
      if (!window.confirm("Are you sure you want to delete this package?")) return;
      try {
        await axios.delete(`${API_BASE_URL}/api/packages/${id}`);
        setPackages(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        console.error("Error deleting package:", err);
        alert("Failed to delete package");
      }
    };

    if (!user) return <p className="text-white">Loading...</p>;

    return (
      <Container className="my-5">
        <h2 className="text-center mb-4 text-white">Welcome, {user.name} (Organizer)</h2>

        {/* Add Package Form */}
        <Form onSubmit={handleAddPackage} className="my-4 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          <h5 className="text-white mb-3">Add New Package</h5>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Package Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter package name"
              value={newPackage.title}
              onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Price (₹)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              placeholder="Enter price"
              value={newPackage.price}
              onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter package description"
              value={newPackage.description}
              onChange={(e) => handleTextareaChange(e, setNewPackage, "description")}
              style={{ overflow: "hidden", resize: "none" }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Package Image (Optional)</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e) => setPackageFile(e.target.files[0])} />
          </Form.Group>
          <Button type="submit" variant="success">Add Package</Button>
        </Form>

        {/* Packages List */}
        <h3 className="mt-5 mb-3 text-white">My Packages</h3>
        <MotionRow variants={containerVariants} initial="hidden" animate="visible" className="row g-4">
          {packages.length > 0 ? packages.map(pkg => (
            <MotionCol className="col-md-6 col-lg-4" key={pkg.id} variants={itemVariants}>
              <Card className="h-100">
                {pkg.imageUrl && <Card.Img variant="top" src={getImageUrl(pkg.imageUrl)} />}
                <Card.Body>
                  <Card.Title>{pkg.title}</Card.Title>
                  <Card.Text><strong>Price: ₹{pkg.price}</strong></Card.Text>
                  <Card.Text>{pkg.description}</Card.Text>
                  <Button variant="danger" size="sm" onClick={() => handleDeletePackage(pkg.id)}>Delete</Button>
                </Card.Body>
              </Card>
            </MotionCol>
          )) : <p className="text-white">No packages added yet.</p>}
        </MotionRow>

        {/* Bookings */}
        <h3 className="mt-5 mb-3 text-white">Booked Packages & Customer Details</h3>
        <MotionRow variants={containerVariants} initial="hidden" animate="visible" className="row g-4">
          {bookings.length > 0 ? bookings.map(b => (
            <MotionCol className="col-md-6 col-lg-4" key={b.id} variants={itemVariants}>
              <Card className="h-100">
                {b.decorationPackage?.imageUrl && <Card.Img variant="top" src={getImageUrl(b.decorationPackage.imageUrl)} />}
                <Card.Body>
                  <Card.Title>{b.decorationPackage?.title}</Card.Title>
                  <Card.Text><strong>Price:</strong> ₹{b.decorationPackage?.price}</Card.Text>
                  <hr style={{ borderColor: "white" }} />
                  <h6>Customer Info:</h6>
                  <Card.Text><strong>Name:</strong> {b.customer?.name || "N/A"}</Card.Text>
                  <Card.Text><strong>Email:</strong> {b.customer?.email || "N/A"}</Card.Text>
                  <Card.Text><strong>Contact Number:</strong> {b.contactNumber || "N/A"}</Card.Text>
                  <Card.Text><strong>Location:</strong> {b.location || "N/A"}</Card.Text>
                  <Card.Text><strong>Day:</strong> {b.day || "N/A"}</Card.Text>
                  <Card.Text><strong>Time:</strong> {b.time || "N/A"}</Card.Text>
                </Card.Body>
              </Card>
            </MotionCol>
          )) : <p className="text-white">No packages booked yet.</p>}
        </MotionRow>
      </Container>
    );
  };

  export default OrganizerDashboard;
