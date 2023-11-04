const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const db = require('../db'); // Import your MySQL database connection

// Create a category
router.post('/api/properties', requireLogin, async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    const query = 'INSERT INTO properties (name, parent) VALUES (?, ?)';
    db.query(query, [name, parentCategory || null], (error, results) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to save the category' });
      } else {
        res.status(200).json({ message: 'Category created successfully', categoryId: results.insertId });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save the category' });
  }
});

// Get all categories
router.get('/api/properties', requireLogin, async (req, res) => {
  try {
    const query = 'SELECT c.*, p.name AS parent_name FROM properties c LEFT JOIN properties p ON c.parent = p._id';
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch the properties' });
      } else {
        // Here, we use LEFT JOIN to join categories with itself and alias the parent's name as "parent_name".
        console.log(results)
        res.status(200).json(results);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch the properties' });
  }
});

// Update category
router.put('/api/properties', requireLogin, async (req, res) => {
  try {
    const { name, parentCategory, id,  } = req.body;

    const updateObject = parentCategory
      ? { name, parent: parentCategory}
      : { name, parent: null };

    const query = 'UPDATE properties SET name = ?, parent = ? WHERE _id = ?';
    db.query(query, [name, updateObject.parent, id], (error) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to update the category' });
      } else {
        res.status(200).json({ message: 'Category updated successfully' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update the category' });
  }
});

// Get category by ID
router.get('/api/properties/:categoryId', requireLogin, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const query = 'SELECT * FROM properties WHERE _id = ?';
    db.query(query, [categoryId], (error, results) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch the category' });
      } else if (results.length === 1) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch the category' });
  }
});

// Delete category by ID
router.delete('/api/properties/:categoryId', requireLogin, async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log(categoryId)
    const query = 'DELETE FROM properties WHERE _id = ?';
    db.query(query, [categoryId], (error, results) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to delete the category' });
      } else if (results.affectedRows === 1) {
        res.status(200).json({ message: 'Category deleted successfully' });
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to delete the category' });
  }
});

module.exports = router;
