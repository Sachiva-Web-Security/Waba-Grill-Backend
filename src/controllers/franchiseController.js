const db = require("../config/db");

exports.createFranchise = async (req,res)=>{

try{

const {
firstName,
lastName,
email,
phone,
city,
state,
investment,
experience,
message
} = req.body;

const checkSql = "SELECT id FROM franchise_applications WHERE email=?";

const [rows] = await db.query(checkSql,[email]);

if(rows.length > 0){
return res.json({
success:false,
message:"You already submitted application"
});
}

const sql = `
INSERT INTO franchise_applications
(first_name,last_name,email,phone,city,state,investment,experience,message)
VALUES (?,?,?,?,?,?,?,?,?)
`;

await db.query(sql,[
firstName,
lastName,
email,
phone,
city,
state,
investment,
experience,
message
]);

res.json({
success:true,
message:"Application submitted"
});

}catch(error){
console.log(error);
res.status(500).json({error:"Server error"});
}

};