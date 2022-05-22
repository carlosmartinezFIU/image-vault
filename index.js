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

/** Using function from s3.js to upload from multer upload folder to s3 */
const { uploadImage, getImageS3, deleteImage } = require('./s3');

const app = express();
app.use(cors());
app.use(express.json());

//post a new photocard , Uses the single 
app.post("/photocard", upload.single("image"), async (req, res) =>{
    /**
     *  fieldname: 'image',
        originalname: 'jamiacaImg.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',
        filename: '0123a1d0293e34ddc50db80d54e1c63d',
        path: 'uploads/0123a1d0293e34ddc50db80d54e1c63d',
        size: 86268
     */
    const { filename } = req.file;
    const filePathFolder = req.file.path;
    const { location, description } = req.body;

    const awsResult = await uploadImage(req.file)
    console.log(awsResult);
    const newFileName = `/images/${filename}`
    const newRow = await pool.query('INSERT INTO photos (photo_location, photo_description, photo_img) VALUES($1, $2, $3) RETURNING *', 
    [location, description, newFileName]);

    try {
        await unlinkFile(filePathFolder);
    } catch (error) {
        console.log(error)
    }
    res.send(newRow.rows[0]);
    
});

//get a certain image to its respective id from the database
app.get('/images/:filename', async (req, res) =>{
   console.log("This is the get from the server", req.params);
   // const filename = req.params.filename
   // const getStream = fs.createReadStream(path.join(__dirname, 'uploads', filename))
   // getStream.pipe(res)

   //req.params = { filename: '3cd29034678bf2c548ea70ee8b72ab66'}

    const fileNameData = req.params.filename
    console.log("In the get pointer", fileNameData)
    const readFile = getImageS3(fileNameData)

    readFile.pipe(res)
})


//get all photocards in database
app.get("/photocard", async (req, res) =>{
    try {
        const allPhotos = await pool.query("SELECT * FROM photos");
        res.send(allPhotos.rows);
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
    const newArray = newPath.split("/");
    const one = newArray[0];
    const two = newArray[1];
    const three  = newArray[2];


    try {
        const deletedData = deleteImage(three)
        const { id } = req.params;
        const deletePhotoCard = await pool.query('DELETE FROM photos WHERE photo_id = $1 RETURNING *', [id]);
        

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