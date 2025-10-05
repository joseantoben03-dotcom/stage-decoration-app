import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal, Form, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookedPackageIds, setBookedPackageIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [organizers, setOrganizers] = useState([]);
  const [filter, setFilter] = useState({ organizerId: "", minPrice: "", maxPrice: "" });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    contactNumber: "",
    time: "",
    day: "",
    organizerId: ""
  });

  const MotionRow = motion.div;
  const MotionCol = motion.div;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [projRes, bookedRes, orgRes, pkgRes] = await Promise.all([
          axios.get("http://localhost:8080/api/projects/all"),
          axios.get(`http://localhost:8080/api/bookings/customer/${user.id}`),
          axios.get("http://localhost:8080/api/customers/organizers"),
          axios.get("http://localhost:8080/api/customers/packages")
        ]);

        setProjects(Array.isArray(projRes.data) ? projRes.data : []);
        setOrganizers(Array.isArray(orgRes.data) ? orgRes.data : []);

        const bookedIds = Array.isArray(bookedRes.data)
          ? bookedRes.data.map(b => b.decorationPackage?.id).filter(Boolean)
          : [];
        setBookedPackageIds(bookedIds);

        let pkgData = [];
        if (Array.isArray(pkgRes.data)) {
          pkgData = pkgRes.data;
        } else if (pkgRes.data && Array.isArray(pkgRes.data.packages)) {
          pkgData = pkgRes.data.packages;
        }

        // Convert organizers array to single organizer object for frontend
        pkgData = pkgData.map(pkg => {
          const organizer = Array.isArray(pkg.organizers) && pkg.organizers.length > 0
            ? { ...pkg.organizers[0] }
            : pkg.organizer || null;
          return { ...pkg, organizer };
        });

        setPackages(pkgData);
      } catch (err) {
        console.error("Error fetching data:", err.response || err.message);
        alert("Failed to fetch data. Check backend or network connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleFilterChange = (e) => setFilter({ ...filter, [e.target.name]: e.target.value });

  const applyFilters = async () => {
    try {
      const params = {};
      if (filter.organizerId) params.organizerId = filter.organizerId;
      if (filter.minPrice) params.minPrice = filter.minPrice;
      if (filter.maxPrice) params.maxPrice = filter.maxPrice;

      const res = await axios.get("http://localhost:8080/api/customers/packages", { params });
      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data.packages)) {
        data = res.data.packages;
      }

      data = data.map(pkg => {
        const organizer = Array.isArray(pkg.organizers) && pkg.organizers.length > 0
          ? { ...pkg.organizers[0] }
          : pkg.organizer || null;
        return { ...pkg, organizer };
      });

      setPackages(data);
    } catch (err) {
      console.error("Failed to fetch packages:", err.response || err.message);
      alert("Failed to fetch packages.");
    }
  };

  const openBookingForm = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      location: "",
      contactNumber: "",
      time: "",
      day: "",
      organizerId: pkg.organizer?.id || (pkg.organizers?.[0]?.id || "")
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitBooking = async () => {
    if (!formData.organizerId) {
      alert("Please select an organizer");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/bookings", {
        customerId: user.id,
        packageId: selectedPackage.id,
        organizerId: formData.organizerId,
        location: formData.location,
        contactNumber: formData.contactNumber,
        day: formData.day,
        time: formData.time
      });

      setBookedPackageIds(prev => [...prev, selectedPackage.id]);
      alert("Package booked successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Booking failed:", err.response || err.message);
      alert("Failed to book package: " + (err.response?.data || err.message));
    }
  };

  const handleUnbookPackage = async (pkgId) => {
    try {
      await axios.delete("http://localhost:8080/api/bookings", { params: { customerId: user.id, packageId: pkgId } });
      setBookedPackageIds(prev => prev.filter(id => id !== pkgId));
      alert("Package unbooked successfully!");
    } catch (err) {
      console.error("Unbooking failed:", err.response || err.message);
      alert("Failed to unbook package: " + (err.response?.data || err.message));
    }
  };

  if (!user || loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: "#fff" }}>Welcome, {user.name} (Customer)</h2>

      {/* <h3 className="mb-3" style={{ color: "#fff" }}>Available Projects</h3>
      <MotionRow className="row g-4" variants={containerVariants} initial="hidden" animate="visible">
        {projects.length > 0 ? projects.map(p => (
          <MotionCol className="col-md-6 col-lg-4" key={p.id} variants={itemVariants}>
            <Card className="h-100">
              {p.imageUrl && <Card.Img variant="top" src={`http://localhost:8080${p.imageUrl}`} alt={p.title} />}
              <Card.Body>
                <Card.Title>{p.title}</Card.Title>
                <Card.Text>{p.description}</Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    Organizer: {p.organizer?.name || "N/A"} <br />
                    Phone: {p.organizer?.phoneNumber || "N/A"}
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          </MotionCol>
        )) : <Col><p style={{ color: "#fff" }}>No projects available yet.</p></Col>}
      </MotionRow> */}

      <h3 className="mt-5 mb-3" style={{ color: "#fff" }}>Filter Packages</h3>
      <Form className="mb-4 d-flex gap-3 flex-wrap">
        <Form.Group>
          <Form.Label style={{ color: "#fff" }}>Organizer</Form.Label>
          <Form.Select name="organizerId" value={filter.organizerId} onChange={handleFilterChange}>
            <option value="">All</option>
            {organizers.length > 0 ? organizers.map(o => <option key={o.id} value={o.id}>{o.name}</option>) : <option disabled>No organizers available</option>}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label style={{ color: "#fff" }}>Min Price</Form.Label>
          <Form.Control type="number" name="minPrice" value={filter.minPrice} onChange={handleFilterChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label style={{ color: "#fff" }}>Max Price</Form.Label>
          <Form.Control type="number" name="maxPrice" value={filter.maxPrice} onChange={handleFilterChange} />
        </Form.Group>

        <Button variant="primary" onClick={applyFilters} style={{ alignSelf: "end" }}>Apply Filters</Button>
      </Form>

      <h3 className="mb-3" style={{ color: "#fff" }}>Available Packages</h3>
      <MotionRow className="row g-4" variants={containerVariants} initial="hidden" animate="visible">
        {packages.length > 0 ? packages.map(pkg => {
          const isBooked = bookedPackageIds.includes(pkg.id);
          return (
            <MotionCol className="col-md-6 col-lg-4" key={pkg.id} variants={itemVariants}>
              <Card className="h-100">
                {pkg.imageUrl && <Card.Img variant="top" src={`http://localhost:8080${pkg.imageUrl}`} alt={pkg.title} />}
                <Card.Body>
                  <Card.Title>{pkg.title}</Card.Title>
                  <Card.Text><strong>Price: ₹{pkg.price}</strong></Card.Text>
                  <Card.Text>{pkg.description}</Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      Organizer: {pkg.organizer?.name || "N/A"} <br />
                      Phone: {pkg.organizer?.phoneNumber || "N/A"}
                    </small>
                  </Card.Text>
                  <Button variant={isBooked ? "danger" : "primary"} onClick={() => isBooked ? handleUnbookPackage(pkg.id) : openBookingForm(pkg)}>
                    {isBooked ? "Unbook Package" : "Book Package"}
                  </Button>
                </Card.Body>
              </Card>
            </MotionCol>
          );
        }) : <Col><p style={{ color: "#fff" }}>No packages available yet.</p></Col>}
      </MotionRow>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Organizer</Form.Label>
              <Form.Select
                name="organizerId"
                value={formData.organizerId}
                onChange={handleChange}
              >
                {selectedPackage?.organizers?.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" name="time" value={formData.time} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Day</Form.Label>
              <Form.Control type="date" name="day" value={formData.day} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmitBooking}>Confirm Booking</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerDashboard;
