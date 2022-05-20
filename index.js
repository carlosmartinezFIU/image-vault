const express = require('express');
const cors = require('cors');
const pool = require('./db');
const multer = require('multer');
const fs = require('fs-extra');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)
const path = require('path');
const PORT = process.env.PORT || 5000;

/**uses the multer middleware to set uploads when image is uploaded */
const upload = multer({dest: 'uploads/'});

const app = express();
app.use(cors());
app.use(express.json());

//post a new photocard , Uses the single 
app.post("/photocard", upload.single("image"), async (req, res) =>{
    const { path } = req.file;
    const { location, description } = req.body;
    
    const newRow = await pool.query('INSERT INTO photos (photo_location, photo_description, photo_img) VALUES($1, $2, $3) RETURNING *', 
    [location, description, path]);

    res.send(newRow.rows[0]);
    
});

//get a certain image to its respective id from the database
app.get('/uploads/:filename', async (req, res) =>{
    const filename = req.params.filename
    const getStream = fs.createReadStream(path.join(__dirname, 'uploads', filename))

    getStream.pipe(res)
})


//get all photocards in database
app.get("/photocard", async (req, res) =>{
    try {
        const allPhotos = await pool.query("SELECT * FROM photos");
        res.json(allPhotos.rows);
    } catch (error) {
        console.log(error)
    }
})

//update a photocard
app.put("/photocard/:id", async (req, res) =>{
    
    try {
        const { id } = req.params;
        const { photo_location } = req.body;
        const { photo_description } = req.body;

        const updatedPhoto = await pool.query("UPDATE photos SET photo_location = $1, photo_description = $2 WHERE photo_id = $3 ", 
        [photo_location, photo_description,  id]);

        res.send(updatedPhoto);
    } catch (error) {
        console.log(error);
    }
    
})

//delete a photocard
app.delete('/photocard/:id', async (req,res) =>{
    
    const { newPath } = req.body;

    try {
        const { id } = req.params;
        const deletePhotoCard = await pool.query('DELETE FROM photos WHERE photo_id = $1 RETURNING *', [id]);
        await unlinkFile(newPath)


        res.json(deletePhotoCard);
    } catch (error) {
        console.log(error);
    }
})


 if(process.env.NODE_ENV === "production"){
     app.use(express.static(path.join(__dirname, "client/build")));

     app.get('*', (req, res) => {
         res.sendFile(path.resolve(__dirname, "client/build/index.html"))
     })
 }





app.listen(PORT, () =>{
    console.log(`Server runnning on ${PORT}`)
} )