import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import Modal from "../components/Modal";
import { useAuth } from "../auth/AuthContext";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [projectFile, setProjectFile] = useState(null);
  const [newPackage, setNewPackage] = useState({ name: "", price: "", description: "" });
  const [packageFile, setPackageFile] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const backendURL = "http://localhost:8080";

  // Auto-resize textarea
  const handleTextareaChange = (e, setter, field) => {
    setter(prev => ({ ...prev, [field]: e.target.value }));
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${backendURL}${imagePath.startsWith("/") ? imagePath : "/" + imagePath}`;
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [projRes, packRes, bookingRes] = await Promise.all([
          axios.get(`${backendURL}/api/projects?organizerId=${user.id}`),
          axios.get(`${backendURL}/api/packages?organizerId=${user.id}`),
          axios.get(`${backendURL}/api/bookings/organizer/${user.id}`)
        ]);

        setProjects(projRes.data || []);
        setPackages(packRes.data || []);
        setBookings(bookingRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [user?.id]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
  const MotionRow = motion.div;
  const MotionCol = motion.div;

  // Add Project
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const formData = new FormData();
      formData.append("title", newProject.name);
      formData.append("description", newProject.description);
      formData.append("organizerId", user.id);
      if (projectFile) formData.append("image", projectFile);

      const res = await axios.post(`${backendURL}/api/projects`, formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });

      setProjects(prev => [...prev, res.data]);
      setNewProject({ name: "", description: "" });
      setProjectFile(null);
      alert("Project added successfully!");
    } catch (err) {
      console.error("Error adding project:", err);
      alert("Error adding project: " + (err.response?.data || err.message));
    }
  };

  // Add Package - FIXED: Changed organizerId back to userId to match backend
  const handleAddPackage = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const formData = new FormData();
      formData.append("name", newPackage.name);
      formData.append("price", newPackage.price);
      formData.append("description", newPackage.description);
      formData.append("userId", user.id); // ✅ FIXED: Backend expects "userId", not "organizerId"
      if (packageFile) formData.append("image", packageFile);

      const res = await axios.post(`${backendURL}/api/packages`, formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });

      setPackages(prev => [...prev, res.data]);
      setNewPackage({ name: "", price: "", description: "" });
      setPackageFile(null);
      alert("Package added successfully!");
    } catch (err) {
      console.error("Error adding package:", err);
      alert("Error adding package: " + (err.response?.data || err.message));
    }
  };

  // Delete handlers
  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${backendURL}/api/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await axios.delete(`${backendURL}/api/packages/${id}`);
      setPackages(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting package:", err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 text-white">Welcome, {user.name} (Organizer)</h2>

      {/* Projects
      <h3 className="mb-3 text-white">My Projects</h3>
      <MotionRow variants={containerVariants} initial="hidden" animate="visible" className="row g-4">
        {projects.map(p => (
          <MotionCol className="col-md-6 col-lg-4" key={p.id} variants={itemVariants}>
            <Card className="h-100">
              {p.imageUrl && <Card.Img variant="top" src={getImageUrl(p.imageUrl)} />}
              <Card.Body>
                <Card.Title>{p.title}</Card.Title>
                <Card.Text>{p.description}</Card.Text>
                <Button variant="danger" size="sm" onClick={() => handleDeleteProject(p.id)}>Delete</Button>
              </Card.Body>
            </Card>
          </MotionCol>
        ))}
      </MotionRow> */}

      {/* Add Project Form
      <Form onSubmit={handleAddProject} className="my-4 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
        <h5 className="text-white mb-3">Add New Project</h5>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">Project Name</Form.Label>
          <Form.Control type="text" placeholder="Enter project name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">Description</Form.Label>
          <Form.Control as="textarea" placeholder="Enter project description" value={newProject.description} onChange={(e) => handleTextareaChange(e, setNewProject, "description")} required style={{ overflow: "hidden", resize: "none" }} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">Project Image (Optional)</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={(e) => setProjectFile(e.target.files[0])} />
        </Form.Group>
        <Button type="submit" variant="success">Add Project</Button>
      </Form> */}

      {/* Packages */}
      <h3 className="mt-5 mb-3 text-white">My Packages</h3>
      <MotionRow variants={containerVariants} initial="hidden" animate="visible" className="row g-4">
        {packages.map(pkg => (
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
        ))}
      </MotionRow>

      {/* Add Package Form */}
      <Form onSubmit={handleAddPackage} className="my-4 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
        <h5 className="text-white mb-3">Add New Package</h5>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">Package Name</Form.Label>
          <Form.Control type="text" placeholder="Enter package name" value={newPackage.name} onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">Price (₹)</Form.Label>
          <Form.Control type="number" step="0.01" placeholder="Enter price" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">Description</Form.Label>
          <Form.Control as="textarea" placeholder="Enter package description" value={newPackage.description} onChange={(e) => handleTextareaChange(e, setNewPackage, "description")} required style={{ overflow: "hidden", resize: "none" }} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">Package Image (Optional)</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={(e) => setPackageFile(e.target.files[0])} />
        </Form.Group>
        <Button type="submit" variant="success">Add Package</Button>
      </Form>

      {/* Booked Packages */}
      <h3 className="mt-5 mb-3 text-white">Booked Packages & Customer Details</h3>
      <MotionRow variants={containerVariants} initial="hidden" animate="visible" className="row g-4">
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <MotionCol className="col-md-6 col-lg-4" key={b.id} variants={itemVariants}>
              <Card className="h-100">
                {b.decorationPackage?.imageUrl && (
                  <Card.Img variant="top" src={getImageUrl(b.decorationPackage.imageUrl)} />
                )}
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
          ))
        ) : (
          <p className="text-white">No packages booked yet.</p>
        )}
      </MotionRow>

      <Modal content={modalContent} onClose={() => setModalContent(null)} />
    </Container>
  );
};

export default OrganizerDashboard;