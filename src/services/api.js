// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data for projects
let projectsData = [
  {
    id: 1,
    title: "Wedding Decor A",
    description: "Elegant wedding setup",
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    title: "Birthday Party B",
    description: "Fun birthday party decoration",
    imageUrl: "https://via.placeholder.com/300",
  },
];

// Mock data for packages
let packagesData = [
  {
    id: 1,
    title: "Basic Package",
    description: "Simple decoration package",
    price: 100,
    imageUrl: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    title: "Premium Package",
    description: "Luxury decoration package",
    price: 300,
    imageUrl: "https://via.placeholder.com/300",
  },
];

// PROJECTS
export const getProjects = async () => {
  await delay(500);
  return { data: projectsData };
};

export const uploadProject = async (formData) => {
  await delay(500);

  const newProject = {
    id: projectsData.length + 1,
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: URL.createObjectURL(formData.get("image")), // display uploaded image
  };

  projectsData.push(newProject);
  return { data: newProject };
};

// PACKAGES
export const getPackages = async () => {
  await delay(500);
  return { data: packagesData };
};

export const addPackage = async (formData) => {
  await delay(500);

  const newPackage = {
    id: packagesData.length + 1,
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: URL.createObjectURL(formData.get("image")),
  };

  packagesData.push(newPackage);
  return { data: newPackage };
};
