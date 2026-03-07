const db = require("../config/db");


// Get Menu Name + Image
exports.getMenuImageInfo = async (req, res) => {
  try {

    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id, name, image FROM menu_items WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    res.status(200).json(rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server Error" });

  }
};


// Update Image
exports.updateMenuImage = async (req, res) => {
  try {

    const { id, image } = req.body;

    await db.query(
      "UPDATE menu_items SET image = ? WHERE id = ?",
      [image, id]
    );

    res.status(200).json({
      message: "Menu image updated successfully"
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server Error" });

  }
};


// Remove Image
exports.removeMenuImage = async (req, res) => {
  try {

    const { id } = req.body;

    await db.query(
      "UPDATE menu_items SET image = NULL WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Menu image removed successfully"
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server Error" });

  }
};

exports.uploadMenuImage = async (req,res)=>{

try{

const { id } = req.body

const imagePath = "/uploads/"+req.file.filename

await db.query(

"UPDATE menu_items SET image=? WHERE id=?",

[imagePath,id]

)

res.json({

message:"Image uploaded successfully",

image:imagePath

})

}catch(err){

console.log(err)

res.status(500).json({

message:"Upload failed"

})

}

}