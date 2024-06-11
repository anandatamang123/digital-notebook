document.addEventListener('DOMContentLoaded', () => {
    const addNoteButton = document.getElementById('add-note-button');
    const noteModal = document.getElementById('note-modal');
    const closeButton = document.querySelector('.close-button');
    const noteForm = document.getElementById('note-form');
    const notesList = document.getElementById('notes-list');
    const categoriesList = document.getElementById('categories-list');
    const searchCategory = document.getElementById('search-category');

    const getNotes = () => JSON.parse(localStorage.getItem('notes')) || [];

    const saveNotes = (notes) => {
        localStorage.setItem('notes', JSON.stringify(notes));
    };

    const displayNotes = (category = '') => {
        const notes = getNotes();
        notesList.innerHTML = '';
        const filteredNotes = category ? notes.filter(note => note.category.toLowerCase().includes(category.toLowerCase())) : notes;
        filteredNotes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.classList.add('note');
            noteDiv.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                ${note.image ? `<img src="${note.image}" alt="Note Image">` : ''}
                <p><strong>Category:</strong> ${note.category}</p>
                <button onclick="deleteNote('${note.id}')">Delete</button>
                <button onclick="editNote('${note.id}')">Edit</button>
            `;
            notesList.appendChild(noteDiv);
        });
    };

    const displayCategories = () => {
        const notes = getNotes();
        const categories = [...new Set(notes.map(note => note.category))];
        categoriesList.innerHTML = '';
        categories.forEach(category => {
            const categoryItem = document.createElement('li');
            categoryItem.textContent = category;
            categoryItem.onclick = () => displayNotes(category);
            categoriesList.appendChild(categoryItem);
        });
    };

    const addOrUpdateNote = (note) => {
        const notes = getNotes();
        const noteIndex = notes.findIndex(n => n.id === note.id);
        if (noteIndex > -1) {
            notes[noteIndex] = note;
        } else {
            notes.push(note);
        }
        saveNotes(notes);
        displayNotes();
        displayCategories();
    };

    const deleteNote = (id) => {
        const notes = getNotes();
        const updatedNotes = notes.filter(note => note.id !== id);
        saveNotes(updatedNotes);
        displayNotes();
        displayCategories();
    };

    window.deleteNote = deleteNote;

    const editNote = (id) => {
        const notes = getNotes();
        const note = notes.find(note => note.id === id);
        if (note) {
            document.getElementById('note-id').value = note.id;
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-category').value = note.category;
            document.getElementById('note-content').value = note.content;
            noteModal.style.display = 'block';
        }
    };

    window.editNote = editNote;

    addNoteButton.onclick = () => {
        noteForm.reset();
        document.getElementById('note-id').value = '';
        noteModal.style.display = 'block';
    };

    closeButton.onclick = () => {
        noteModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === noteModal) {
            noteModal.style.display = 'none';
        }
    };

    noteForm.onsubmit = (event) => {
        event.preventDefault();
        const id = document.getElementById('note-id').value || Date.now().toString();
        const title = document.getElementById('note-title').value;
        const category = document.getElementById('note-category').value;
        const content = document.getElementById('note-content').value;
        const imageFile = document.getElementById('note-image').files[0];
        let image = '';

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = () => {
                image = reader.result;
                addOrUpdateNote({ id, title, category, content, image });
                noteModal.style.display = 'none';
            };
            reader.readAsDataURL(imageFile);
        } else {
            addOrUpdateNote({ id, title, category, content, image });
            noteModal.style.display = 'none';
        }
    };

    searchCategory.oninput = () => {
        displayNotes(searchCategory.value);
    };

    displayNotes();
    displayCategories();
});
