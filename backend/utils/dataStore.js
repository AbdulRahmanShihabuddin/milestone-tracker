import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MILESTONES_FILE = path.join(DATA_DIR, 'milestones.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(MILESTONES_FILE)) {
  fs.writeFileSync(MILESTONES_FILE, JSON.stringify([], null, 2));
}

// Read data from file
const readData = (filename) => {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

// Write data to file
const writeData = (filename, data) => {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
    return false;
  }
};

// User operations
export const getUsers = () => readData(USERS_FILE);

export const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  return writeData(USERS_FILE, users);
};

export const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const findUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

// Milestone operations
export const getMilestones = () => readData(MILESTONES_FILE);

export const getMilestonesByUserId = (userId) => {
  const milestones = getMilestones();
  return milestones.filter(milestone => milestone.userId === userId);
};

export const addMilestone = (milestone) => {
  const milestones = getMilestones();
  milestones.push(milestone);
  return writeData(MILESTONES_FILE, milestones);
};

export const updateMilestone = (id, updatedData) => {
  const milestones = getMilestones();
  const index = milestones.findIndex(m => m.id === id);
  
  if (index === -1) return false;
  
  milestones[index] = { ...milestones[index], ...updatedData };
  return writeData(MILESTONES_FILE, milestones);
};

export const deleteMilestone = (id) => {
  const milestones = getMilestones();
  const filtered = milestones.filter(m => m.id !== id);
  return writeData(MILESTONES_FILE, filtered);
};

export const findMilestoneById = (id) => {
  const milestones = getMilestones();
  return milestones.find(m => m.id === id);
};
