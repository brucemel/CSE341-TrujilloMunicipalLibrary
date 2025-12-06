const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true,
        maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    isbn: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true,
        trim: true,
        match: [/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits']
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children', 'Romance', 'Mystery', 'Fantasy', 'Other']
    },
    publicationYear: {
        type: Number,
        required: [true, 'Publication year is required'],
        min: [1000, 'Publication year must be after 1000'],
        max: [new Date().getFullYear(), 'Publication year cannot be in the future']
    },
    publisher: {
        type: String,
        required: [true, 'Publisher is required'],
        trim: true,
        maxlength: [100, 'Publisher name cannot exceed 100 characters']
    },
    totalCopies: {
        type: Number,
        required: [true, 'Total copies is required'],
        min: [1, 'Must have at least 1 copy'],
        default: 1
    },
    availableCopies: {
        type: Number,
        required: [true, 'Available copies is required'],
        min: [0, 'Available copies cannot be negative'],
        default: 1
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    coverImage: {
        type: String,
        trim: true,
        default: 'https://via.placeholder.com/200x300?text=No+Cover'
    },
    addedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ genre: 1 });

module.exports = mongoose.model('Book', bookSchema);